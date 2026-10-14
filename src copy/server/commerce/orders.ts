import 'server-only';
import crypto from 'node:crypto';
import { Prisma, type Order } from '@prisma/client';
import { db } from '@/server/db';
import { env } from '@/server/env';
import { createRazorpayOrder } from '@/server/payments/razorpay';
import { CheckoutError, priceCart, type CartLineInput } from './pricing';

type Tx = Prisma.TransactionClient;
type StockLine = { variantId: string; qty: number };

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
}
export interface ShippingInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}
export interface CheckoutSession {
  orderId: string;
  orderNumber: string;
  trackingToken: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  expiresAt: string;
}

/* ───────────────────────── helpers ───────────────────────── */

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // no 0 O 1 I L

function newOrderNumber(): string {
  const d = new Date();
  const ym = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  let suffix = '';
  for (const b of crypto.randomBytes(6)) suffix += ALPHABET[b % ALPHABET.length];
  return `OTR-${ym}-${suffix}`;
}

const byVariant = (a: StockLine, b: StockLine) => a.variantId.localeCompare(b.variantId);

/** Atomic reserve: the WHERE clause is the oversell guard (no check-then-act race). */
async function reserve(tx: Tx, lines: StockLine[]) {
  for (const l of [...lines].sort(byVariant)) {
    const n = await tx.$executeRaw`
      UPDATE "Variant"
         SET "reserved" = "reserved" + ${l.qty}, "updatedAt" = now()
       WHERE "id" = ${l.variantId} AND "active" = true
         AND "stockOnHand" - "reserved" >= ${l.qty}`;
    if (n === 0) throw new CheckoutError('sold_out', 409, 'Sorry — one of your pieces has just sold out.');
  }
}

async function release(tx: Tx, lines: StockLine[]) {
  for (const l of [...lines].sort(byVariant)) {
    await tx.$executeRaw`
      UPDATE "Variant"
         SET "reserved" = GREATEST("reserved" - ${l.qty}, 0), "updatedAt" = now()
       WHERE "id" = ${l.variantId}`;
  }
}

/** Payment captured against a live reservation: turn "reserved" into "sold". */
async function commitReserved(tx: Tx, lines: StockLine[]) {
  for (const l of [...lines].sort(byVariant)) {
    await tx.$executeRaw`
      UPDATE "Variant"
         SET "stockOnHand" = "stockOnHand" - ${l.qty},
             "reserved" = GREATEST("reserved" - ${l.qty}, 0),
             "updatedAt" = now()
       WHERE "id" = ${l.variantId}`;
  }
}

/** Late payment on a released reservation: lock rows, verify ALL lines fit, then decrement. */
async function takeStockIfAvailable(tx: Tx, lines: StockLine[]): Promise<boolean> {
  const ids = lines.map((l) => l.variantId).sort();
  const rows = await tx.$queryRaw<{ id: string; stockOnHand: number; reserved: number }[]>(
    Prisma.sql`SELECT "id", "stockOnHand", "reserved" FROM "Variant"
               WHERE "id" IN (${Prisma.join(ids)}) ORDER BY "id" FOR UPDATE`,
  );
  const m = new Map(rows.map((r) => [r.id, r]));
  for (const l of lines) {
    const r = m.get(l.variantId);
    if (!r || r.stockOnHand - r.reserved < l.qty) return false;
  }
  for (const l of lines) {
    await tx.$executeRaw`
      UPDATE "Variant" SET "stockOnHand" = "stockOnHand" - ${l.qty}, "updatedAt" = now()
       WHERE "id" = ${l.variantId}`;
  }
  return true;
}

function toSession(order: Order, razorpayOrderId: string): CheckoutSession {
  return {
    orderId: order.id,
    orderNumber: order.number,
    trackingToken: order.trackingToken,
    razorpayOrderId,
    amountPaise: order.totalPaise,
    currency: order.currency,
    expiresAt: order.expiresAt.toISOString(),
  };
}

/** Idempotent: safe to call twice. Creates the provider order only if it does not exist yet. */
async function attachRazorpayOrder(order: Order): Promise<string> {
  if (order.razorpayOrderId) return order.razorpayOrderId;
  const rz = await createRazorpayOrder({ amountPaise: order.totalPaise, receipt: order.number, orderId: order.id });
  const r = await db.order.updateMany({ where: { id: order.id, razorpayOrderId: null }, data: { razorpayOrderId: rz.id } });
  if (r.count === 1) return rz.id;
  const fresh = await db.order.findUniqueOrThrow({ where: { id: order.id } });
  return fresh.razorpayOrderId!;
}

async function replay(order: Order): Promise<CheckoutSession> {
  if (order.status !== 'PENDING' || order.expiresAt.getTime() <= Date.now()) {
    throw new CheckoutError('order_closed', 409, 'This checkout has expired. Please start again.');
  }
  return toSession(order, await attachRazorpayOrder(order));
}

/* ───────────────────────── create ───────────────────────── */

/**
 * Saga:  1) price from DB  2) reserve stock + insert order (ONE db transaction)
 *        3) create Razorpay order (network, OUTSIDE the transaction)
 *        4) on step-3 failure, compensate (cancel + release).
 * Idempotency-Key makes the whole thing safe to retry.
 */
export async function createOrder(args: {
  idempotencyKey: string;
  items: CartLineInput[];
  customer: CustomerInput;
  shipping: ShippingInput;
}): Promise<CheckoutSession> {
  const existing = await db.order.findUnique({ where: { idempotencyKey: args.idempotencyKey } });
  if (existing) return replay(existing);

  await expireStale(25).catch(() => undefined); // lazy sweep so a dead cron never strands stock

  const priced = await priceCart(args.items);
  const expiresAt = new Date(Date.now() + env().ORDER_HOLD_MINUTES * 60_000);

  let order: Order;
  try {
    order = await db.$transaction(async (tx) => {
      await reserve(tx, priced.lines);
      return tx.order.create({
        data: {
          number: newOrderNumber(),
          idempotencyKey: args.idempotencyKey,
          subtotalPaise: priced.subtotalPaise,
          shippingPaise: priced.shippingPaise,
          totalPaise: priced.totalPaise,
          name: args.customer.name,
          email: args.customer.email,
          phone: args.customer.phone,
          shipping: args.shipping as unknown as Prisma.InputJsonValue,
          trackingToken: crypto.randomBytes(24).toString('base64url'),
          expiresAt,
          items: {
            create: priced.lines.map((l) => ({
              variantId: l.variantId,
              qty: l.qty,
              unitPricePaise: l.unitPricePaise,
              skuSnapshot: l.sku,
              titleSnapshot: l.title,
              sizeSnapshot: l.size,
            })),
          },
        },
      });
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const winner = await db.order.findUnique({ where: { idempotencyKey: args.idempotencyKey } });
      if (winner) return replay(winner); // lost a parallel-request race: the txn rolled back our reservation
    }
    throw err;
  }

  try {
    return toSession(order, await attachRazorpayOrder(order));
  } catch (err) {
    await cancelAndRelease(order.id).catch(() => undefined);
    console.error('[checkout] razorpay order creation failed', { order: order.number, err: String(err) });
    throw new CheckoutError('payment_provider_unavailable', 502, 'Payments are briefly unavailable. Please try again.');
  }
}

async function cancelAndRelease(orderId: string) {
  await db.$transaction(async (tx) => {
    const r = await tx.order.updateMany({ where: { id: orderId, status: 'PENDING' }, data: { status: 'CANCELLED' } });
    if (r.count !== 1) return;
    const items = await tx.orderItem.findMany({ where: { orderId }, select: { variantId: true, qty: true } });
    await release(tx, items);
  });
}

/* ───────────────────────── expiry ───────────────────────── */

/** Releases stock held by unpaid orders. Called by cron AND lazily by createOrder. */
export async function expireStale(limit = 100): Promise<number> {
  const stale = await db.order.findMany({
    where: { status: 'PENDING', expiresAt: { lt: new Date() } },
    select: { id: true },
    orderBy: { expiresAt: 'asc' },
    take: limit,
  });
  let expired = 0;
  for (const { id } of stale) {
    const done = await db.$transaction(async (tx) => {
      const r = await tx.order.updateMany({
        where: { id, status: 'PENDING', expiresAt: { lt: new Date() } },
        data: { status: 'EXPIRED' },
      });
      if (r.count !== 1) return false; // paid or cancelled in the meantime — they won the race
      const items = await tx.orderItem.findMany({ where: { orderId: id }, select: { variantId: true, qty: true } });
      await release(tx, items);
      return true;
    });
    if (done) expired++;
  }
  return expired;
}

/* ───────────────────────── payment outcomes ───────────────────────── */

export type MarkPaidResult =
  | { kind: 'paid' | 'duplicate' | 'refund_pending' | 'amount_mismatch'; orderNumber: string; trackingToken: string }
  | { kind: 'unknown_order' };

const SETTLED = ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED', 'REFUND_PENDING', 'REFUNDED'];

/**
 * The single convergence point for "money received". Called by the webhook
 * (source of truth) AND the browser verify route (fast UX). Idempotent and
 * race-safe: every status change is a conditional UPDATE ... WHERE status = X.
 */
export async function markPaid(p: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountPaise: number;
  currency: string;
  method?: string;
}): Promise<MarkPaidResult> {
  return db.$transaction(async (tx): Promise<MarkPaidResult> => {
    const order = await tx.order.findUnique({ where: { razorpayOrderId: p.razorpayOrderId }, include: { items: true } });
    if (!order) return { kind: 'unknown_order' };
    const ref = { orderNumber: order.number, trackingToken: order.trackingToken };

    if (p.amountPaise !== order.totalPaise || p.currency !== order.currency) {
      // Razorpay enforces the order amount, so this should be impossible. Never mark paid on a mismatch.
      console.error('[payments] amount mismatch', { order: order.number, got: p.amountPaise, want: order.totalPaise });
      return { kind: 'amount_mismatch', ...ref };
    }

    const existingPayment = await tx.payment.findUnique({ where: { razorpayPaymentId: p.razorpayPaymentId } });
    if (!existingPayment) {
      await tx.payment.create({
        data: {
          orderId: order.id,
          razorpayPaymentId: p.razorpayPaymentId,
          razorpayOrderId: p.razorpayOrderId,
          amountPaise: p.amountPaise,
          status: 'CAPTURED',
          method: p.method,
        },
      });
    } else if (existingPayment.status === 'FAILED') {
      await tx.payment.update({ where: { id: existingPayment.id }, data: { status: 'CAPTURED', method: p.method } });
    }

    const won = await tx.order.updateMany({ where: { id: order.id, status: 'PENDING' }, data: { status: 'PAID', paidAt: new Date() } });
    if (won.count === 1) {
      await commitReserved(tx, order.items);
      return { kind: 'paid', ...ref };
    }

    const current = await tx.order.findUniqueOrThrow({ where: { id: order.id }, select: { status: true } });
    if (SETTLED.includes(current.status)) return { kind: 'duplicate', ...ref };

    // EXPIRED / CANCELLED: the customer paid after we released the hold. Try to re-take stock.
    if (await takeStockIfAvailable(tx, order.items)) {
      await tx.order.updateMany({ where: { id: order.id, status: { in: ['EXPIRED', 'CANCELLED'] } }, data: { status: 'PAID', paidAt: new Date() } });
      return { kind: 'paid', ...ref };
    }
    await tx.order.updateMany({ where: { id: order.id, status: { in: ['EXPIRED', 'CANCELLED'] } }, data: { status: 'REFUND_PENDING' } });
    console.error('[payments] captured payment but stock gone — REFUND REQUIRED', { order: order.number, payment: p.razorpayPaymentId });
    return { kind: 'refund_pending', ...ref };
  });
}

/** A failed attempt does NOT cancel the order — Razorpay lets the customer retry on the same order. */
export async function markPaymentFailed(p: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountPaise: number;
  method?: string;
  reason?: string;
}) {
  const order = await db.order.findUnique({ where: { razorpayOrderId: p.razorpayOrderId }, select: { id: true } });
  if (!order) return;
  await db.payment.createMany({
    data: [
      {
        orderId: order.id,
        razorpayPaymentId: p.razorpayPaymentId,
        razorpayOrderId: p.razorpayOrderId,
        amountPaise: p.amountPaise,
        status: 'FAILED',
        method: p.method,
        failureReason: p.reason?.slice(0, 200),
      },
    ],
    skipDuplicates: true,
  });
}

/** Status bookkeeping only. Restocking returned goods is a deliberate, manual ops step. */
export async function markRefunded(p: { razorpayPaymentId: string; refundedPaise: number }) {
  await db.$transaction(async (tx) => {
    const pay = await tx.payment.findUnique({ where: { razorpayPaymentId: p.razorpayPaymentId } });
    if (!pay || p.refundedPaise < pay.amountPaise) return; // partial refunds: leave statuses alone
    await tx.payment.update({ where: { id: pay.id }, data: { status: 'REFUNDED' } });
    await tx.order.updateMany({ where: { id: pay.orderId, status: { not: 'REFUNDED' } }, data: { status: 'REFUNDED' } });
  });
}

/** Guest-safe lookup: the 192-bit token is the capability, so order numbers can't be enumerated. */
export async function getOrderByTrackingToken(token: string) {
  return db.order.findUnique({
    where: { trackingToken: token },
    select: {
      number: true,
      status: true,
      totalPaise: true,
      paidAt: true,
      createdAt: true,
      items: { select: { titleSnapshot: true, sizeSnapshot: true, qty: true, unitPricePaise: true } },
    },
  });
}
