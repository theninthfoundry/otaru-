import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { db } from '@/server/db';
import { markPaid, markPaymentFailed, markRefunded } from '@/server/commerce/orders';
import { verifyWebhookSignature } from '@/server/payments/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PaymentEntity = z.object({
  id: z.string(),
  order_id: z.string().nullable().optional(),
  amount: z.number(),
  currency: z.string(),
  method: z.string().optional(),
  error_description: z.string().nullable().optional(),
});
const RefundEntity = z.object({ payment_id: z.string(), amount: z.number() });

const Envelope = z.object({
  event: z.string(),
  payload: z
    .object({
      payment: z.object({ entity: PaymentEntity }).optional(),
      refund: z.object({ entity: RefundEntity }).optional(),
    })
    .passthrough(),
});

/**
 * Razorpay delivers at-least-once. Order of operations:
 *  1) verify HMAC over the RAW body   2) dedupe on event id   3) apply   4) mark processed
 * Any failure after (1) returns 500 so Razorpay retries with backoff.
 */
export async function POST(req: Request) {
  const raw = await req.text(); // raw body: re-serialised JSON would break the signature
  if (raw.length > 256_000) return new Response('too large', { status: 413 });

  if (!verifyWebhookSignature(raw, req.headers.get('x-razorpay-signature'))) {
    return new Response('invalid signature', { status: 400 });
  }

  const eventId = req.headers.get('x-razorpay-event-id') ?? crypto.createHash('sha256').update(raw).digest('hex');

  let envelope: z.infer<typeof Envelope>;
  try {
    envelope = Envelope.parse(JSON.parse(raw));
  } catch {
    return new Response('ignored', { status: 200 }); // authentic but not a shape we handle — do not trigger retries
  }

  try {
    await db.webhookEvent.create({ data: { id: eventId, event: envelope.event } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const prev = await db.webhookEvent.findUnique({ where: { id: eventId } });
      if (prev?.processedAt) return new Response('duplicate', { status: 200 });
      // received earlier but never finished (crash) — fall through and process again; handlers are idempotent
    } else {
      console.error('[webhook] ledger write failed', err);
      return new Response('error', { status: 500 });
    }
  }

  try {
    const pay = envelope.payload.payment?.entity;
    switch (envelope.event) {
      case 'payment.captured':
      case 'order.paid':
        if (pay?.order_id) {
          await markPaid({
            razorpayOrderId: pay.order_id,
            razorpayPaymentId: pay.id,
            amountPaise: pay.amount,
            currency: pay.currency,
            method: pay.method,
          });
        }
        break;
      case 'payment.failed':
        if (pay?.order_id) {
          await markPaymentFailed({
            razorpayOrderId: pay.order_id,
            razorpayPaymentId: pay.id,
            amountPaise: pay.amount,
            method: pay.method,
            reason: pay.error_description ?? undefined,
          });
        }
        break;
      case 'refund.processed': {
        const rf = envelope.payload.refund?.entity;
        if (rf) await markRefunded({ razorpayPaymentId: rf.payment_id, refundedPaise: rf.amount });
        break;
      }
      default:
        break; // subscribed-but-unhandled events are acknowledged
    }
    await db.webhookEvent.update({ where: { id: eventId }, data: { processedAt: new Date() } });
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('[webhook] processing failed', { event: envelope.event, eventId, err: String(err) });
    return new Response('error', { status: 500 });
  }
}
