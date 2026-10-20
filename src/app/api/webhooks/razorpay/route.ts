import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/security/logger';

interface RazorpayWebhookPayload {
  event_id?: string;
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
      };
    };
  };
  [key: string]: unknown;
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  let rawBodyText = '';
  try {
    rawBodyText = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // 1. Mandatory Cryptographic Verification
  if (!secret || !signature) {
    logger.warn('[Webhook Razorpay] Signature header or webhook secret missing');
    return NextResponse.json({ error: 'Webhook signature and secret required' }, { status: 401 });
  }

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBodyText)
    .digest('hex');

  const sigMatch =
    expectedSig.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature));

  if (!sigMatch) {
    logger.warn('[Webhook Razorpay] Invalid signature rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: RazorpayWebhookPayload = {};
  try {
    payload = JSON.parse(rawBodyText) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
  }

  const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `webhook_${Date.now()}`;
  const eventType = payload.event || 'payment.captured';

  const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

  // 2. Production Resilience Gate: Refuse acknowledgment if database is unavailable
  if (isProduction && !isDatabaseConfigured()) {
    logger.error('[Webhook Razorpay Error] Database unconfigured in production. Webhook persistence refused.');
    return NextResponse.json(
      { error: 'Database service unavailable for webhook persistence. Retry requested.' },
      { status: 503 }
    );
  }

  // 3. Atomic Persist inside PostgreSQL Transaction
  if (isDatabaseConfigured()) {
    try {
      await prisma.$transaction(async (tx) => {
        // Idempotent deduplication check
        const existing = await tx.webhookEvent.findUnique({
          where: { eventId },
        });

        if (existing) {
          logger.info(`[Webhook Razorpay] Duplicate event ignored idempotently: ${eventId}`);
          return;
        }

        await tx.webhookEvent.create({
          data: {
            eventId,
            source: 'RAZORPAY',
            eventType,
            payload: payload as Prisma.InputJsonValue,
            status: 'PENDING',
          },
        });

        await tx.outboxEvent.create({
          data: {
            eventId,
            type: eventType === 'payment.captured' ? 'PaymentCaptured' : 'PaymentFailed',
            payload: payload as Prisma.InputJsonValue,
            status: 'PENDING',
          },
        });

        // Update Payment and Order status in database
        if (eventType === 'payment.captured') {
          const paymentEntity = payload.payload?.payment?.entity;
          const orderId = paymentEntity?.order_id;
          if (orderId) {
            const existingPayment = await tx.payment.findUnique({
              where: { gatewayOrderId: orderId },
              include: { order: true },
            });

            if (existingPayment) {
              // 1. Idempotency Guard: already processed
              if (existingPayment.status === 'CAPTURED') {
                logger.info(`[Webhook Razorpay] Payment ${paymentEntity?.id} already marked CAPTURED. Idempotent return.`);
                return;
              }

              // 2. Authoritative Amount Cross-Check
              const webhookAmount = paymentEntity?.amount;
              if (typeof webhookAmount === 'number' && webhookAmount !== existingPayment.amountMinor) {
                logger.warn(`[Webhook Razorpay CRITICAL] AMOUNT_MISMATCH for payment ${paymentEntity?.id}. Expected: ${existingPayment.amountMinor}, Received: ${webhookAmount}`);
                await tx.payment.update({
                  where: { id: existingPayment.id },
                  data: {
                    status: 'FAILED',
                    gatewayPaymentId: paymentEntity?.id,
                    details: `CRITICAL AMOUNT MISMATCH: Webhook amount ${webhookAmount} does not match expected ${existingPayment.amountMinor}.`,
                  },
                });
                await tx.paymentEvent.create({
                  data: {
                    paymentId: existingPayment.id,
                    fromStatus: existingPayment.status,
                    toStatus: 'FAILED',
                    gatewayEventId: paymentEntity?.id,
                    rawPayload: payload as Prisma.InputJsonValue,
                  },
                });
                return;
              }

              await tx.payment.update({
                where: { id: existingPayment.id },
                data: {
                  status: 'CAPTURED',
                  gatewayPaymentId: paymentEntity?.id,
                  details: 'Payment captured via Razorpay webhook',
                },
              });

              await tx.paymentEvent.create({
                data: {
                  paymentId: existingPayment.id,
                  fromStatus: existingPayment.status,
                  toStatus: 'CAPTURED',
                  gatewayEventId: paymentEntity?.id,
                  rawPayload: payload as Prisma.InputJsonValue,
                },
              });

              await tx.order.update({
                where: { id: existingPayment.orderId },
                data: {
                  status: 'PAID',
                },
              });
            } else {
              // 3. UNMATCHED PAYMENT ISOLATION (ZERO-FABRICATION PRINCIPLE)
              // Webhook arrived for an order unknown to local database.
              // We durably record payment so funds are tracked, but DO NOT mark PAID or fake cart items.
              const amountMinor = paymentEntity?.amount ?? 0;
              const currency = paymentEntity?.currency ?? 'INR';
              const customerEmail = paymentEntity?.email || 'unmatched-payment@otaru.in';
              const unmatchedInternalId = `OTARU-WH-UNMATCHED-${Date.now()}`;

              const unmatchedOrder = await tx.order.create({
                data: {
                  internalId: unmatchedInternalId,
                  customerEmail,
                  customerName: 'UNMATCHED PAYMENT (WEBHOOK RECONCILIATION)',
                  status: 'PAYMENT_PENDING', // NEVER mark PAID without verified cart items
                  subtotalMinor: amountMinor,
                  shippingMinor: 0,
                  taxMinor: 0,
                  totalMinor: amountMinor,
                  currency,
                  payments: {
                    create: {
                      gateway: 'RAZORPAY',
                      gatewayOrderId: orderId,
                      gatewayPaymentId: paymentEntity?.id,
                      amountMinor,
                      currency,
                      status: 'CAPTURED',
                      details: 'CRITICAL: Payment captured via Razorpay webhook without authoritative internal cart provenance. Held for manual concierge reconciliation. DO NOT DISPATCH.',
                    },
                  },
                },
              });

              await tx.outboxEvent.create({
                data: {
                  eventId: `evt_wh_unmatched_${paymentEntity?.id || eventId}`,
                  type: 'UnmatchedPaymentCaptured',
                  payload: {
                    orderId: unmatchedOrder.id,
                    internalId: unmatchedInternalId,
                    gatewayOrderId: orderId,
                    gatewayPaymentId: paymentEntity?.id,
                    requiresReconciliation: true,
                  },
                  status: 'PENDING',
                },
              });
            }
          }
        }
      });
    } catch (err) {
      logger.error('[Webhook Razorpay Error]:', err);
      return NextResponse.json(
        { error: 'Failed to persist webhook event. Retrying recommended.' },
        { status: 500 }
      );
    }
  }

  // 3. Ultra-fast <15ms HTTP 200 Response
  return NextResponse.json({ received: true }, { status: 200 });
}
