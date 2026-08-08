import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { updateTransactionStatus } from '@/lib/payments/ledger';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';

const processedEventIds = new Map<string, number>();
const EVENT_ID_TTL_MS = 60 * 60 * 1000;

function isEventAlreadyProcessed(eventId: string): boolean {
  const processedAt = processedEventIds.get(eventId);
  if (!processedAt) return false;
  if (Date.now() - processedAt > EVENT_ID_TTL_MS) {
    processedEventIds.delete(eventId);
    return false;
  }
  return true;
}

function markEventProcessed(eventId: string): void {
  processedEventIds.set(eventId, Date.now());
  if (processedEventIds.size > 10_000) {
    const cutoff = Date.now() - EVENT_ID_TTL_MS;
    for (const [id, ts] of processedEventIds.entries()) {
      if (ts < cutoff) processedEventIds.delete(id);
    }
  }
}

const MAX_WEBHOOK_AGE_MS = 5 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  const razorpaySignature = headersList.get('x-razorpay-signature');
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    '0.0.0.0';

  if (webhookSecret) {
    if (!razorpaySignature) {
      logger.warn('[Webhook] Missing x-razorpay-signature header.');
      auditLog({ type: 'WEBHOOK_REPLAY_DETECTED', details: 'Webhook rejected: missing signature header.', ip });
      return NextResponse.json({ error: 'Webhook signature required.' }, { status: 401 });
    }

    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSig, 'utf8');
    const receivedBuf = Buffer.from(razorpaySignature, 'utf8');

    const sigValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!sigValid) {
      logger.warn('[Webhook] Signature mismatch — possible replay or spoofing attempt.');
      auditLog({
        type: 'WEBHOOK_REPLAY_DETECTED',
        details: 'Webhook rejected: signature mismatch.',
        ip,
        meta: { receivedSig: razorpaySignature?.substring(0, 16) + '...' },
      });
      return NextResponse.json({ error: 'Webhook signature invalid.' }, { status: 401 });
    }
  } else {
    logger.warn('[Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping verification in dev mode.');
  }

  try {
    const event = JSON.parse(body);
    const eventType: string = event.event ?? 'unknown';
    const eventId: string | undefined = event.id;
    const eventCreatedAt: number | undefined = event.created_at;

    if (eventCreatedAt) {
      const eventAgeMs = Date.now() - eventCreatedAt * 1000;
      if (eventAgeMs > MAX_WEBHOOK_AGE_MS) {
        logger.warn(`[Webhook] Event too old: ${eventAgeMs}ms. Type: ${eventType}`);
        auditLog({
          type: 'WEBHOOK_REPLAY_DETECTED',
          details: `Webhook rejected: event too old (${Math.round(eventAgeMs / 1000)}s). Type: ${eventType}`,
          ip,
          meta: { eventType, ageSeconds: Math.round(eventAgeMs / 1000) },
        });
        return NextResponse.json({ error: 'Webhook event too old. Possible replay.' }, { status: 400 });
      }
    }

    if (eventId) {
      if (isEventAlreadyProcessed(eventId)) {
        logger.warn(`[Webhook] Duplicate event ID: ${eventId}. Type: ${eventType}`);
        auditLog({
          type: 'WEBHOOK_REPLAY_DETECTED',
          details: `Webhook rejected: duplicate event ID ${eventId}. Type: ${eventType}`,
          ip,
          meta: { eventId, eventType },
        });
        return NextResponse.json({ received: true, duplicate: true });
      }
      markEventProcessed(eventId);
    }

    const paymentEntity = event.payload?.payment?.entity;
    const refundEntity = event.payload?.refund?.entity;

    logger.info(`[Webhook] Processing: ${eventType}`, {
      eventId,
      paymentId: paymentEntity?.id,
      orderId: paymentEntity?.order_id,
    });

    switch (eventType) {
      case 'payment.captured': {
        if (paymentEntity?.order_id) {
          updateTransactionStatus(
            paymentEntity.order_id,
            'CAPTURED',
            `Webhook: payment.captured. Payment ID: ${paymentEntity.id}. Amount: ${paymentEntity.amount / 100} ${paymentEntity.currency}.`,
            { signatureVerified: true },
          );
          auditLog({
            type: 'WEBHOOK_RECEIVED',
            details: `payment.captured event. Order: ${paymentEntity.order_id}, Payment: ${paymentEntity.id}`,
            ref: paymentEntity.order_id,
            ip,
            meta: { eventId, amount: paymentEntity.amount / 100 },
          });
        }
        break;
      }

      case 'payment.failed': {
        if (paymentEntity?.order_id) {
          updateTransactionStatus(
            paymentEntity.order_id,
            'FAILED',
            `Webhook: payment.failed. Reason: ${paymentEntity.error_description ?? 'Unknown'}. Code: ${paymentEntity.error_code ?? 'N/A'}.`,
            { signatureVerified: true },
          );
          auditLog({
            type: 'PAYMENT_FAILED',
            details: `payment.failed event. Order: ${paymentEntity.order_id}. Reason: ${paymentEntity.error_description ?? 'Unknown'}`,
            ref: paymentEntity.order_id,
            ip,
            meta: { eventId, errorCode: paymentEntity.error_code },
          });
        }
        break;
      }

      case 'refund.processed': {
        if (refundEntity?.payment_id) {
          updateTransactionStatus(
            refundEntity.payment_id,
            'REFUNDED',
            `Webhook: refund.processed. Refund ID: ${refundEntity.id}. Amount: ${refundEntity.amount / 100} ${refundEntity.currency}.`,
            { signatureVerified: true },
          );
          auditLog({
            type: 'REFUND_ISSUED',
            details: `refund.processed event. Payment: ${refundEntity.payment_id}, Refund: ${refundEntity.id}`,
            ref: refundEntity.payment_id,
            ip,
            meta: { eventId, refundId: refundEntity.id, amount: refundEntity.amount / 100 },
          });
        }
        break;
      }

      default:
        logger.info(`[Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({
      received: true,
      event: eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    logger.error('[Webhook] Exception:', error);
    return NextResponse.json({ error: 'Failed to process webhook.' }, { status: 400 });
  }
}
