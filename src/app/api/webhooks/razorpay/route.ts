import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
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

  // 2. Atomic Persist inside PostgreSQL Transaction
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$transaction(async (tx) => {
        // Idempotent deduplication check
        const existing = await tx.webhookEvent.findUnique({
          where: { eventId },
        });

        if (existing) return;

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
            await tx.payment.updateMany({
              where: { gatewayOrderId: orderId },
              data: {
                status: 'CAPTURED',
                gatewayPaymentId: paymentEntity?.id,
                details: 'Payment captured via Razorpay webhook',
              },
            });
            await tx.order.updateMany({
              where: {
                payments: {
                  some: { gatewayOrderId: orderId },
                },
              },
              data: {
                status: 'PAID',
              },
            });
          }
        }
      });
    } catch (err) {
      logger.error('[Webhook Razorpay Error]:', err);
    }
  }

  // 3. Ultra-fast <15ms HTTP 200 Response
  return NextResponse.json({ received: true }, { status: 200 });
}
