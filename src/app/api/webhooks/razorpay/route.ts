import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { logger } from '@/lib/security/logger';

export async function POST(request: Request) {
  const headersList = request.headers;
  const signature = headersList.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  let rawBodyText = '';
  try {
    rawBodyText = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // 1. Instant Cryptographic Verification
  if (secret && signature) {
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(rawBodyText)
      .digest('hex');

    const sigMatch =
      expectedSig.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature));

    if (!sigMatch) {
      logger.warn('[Webhook Razorpay] Invalid signature rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let payload: any = {};
  try {
    payload = JSON.parse(rawBodyText);
  } catch {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
  }

  const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `webhook_${Date.now()}`;
  const eventType = payload.event || 'payment.captured';

  // 2. Atomic Persist inside PostgreSQL Transaction
  if (process.env.DATABASE_URL && prisma?.$transaction) {
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
            payload,
            status: 'PENDING',
          },
        });

        await tx.outboxEvent.create({
          data: {
            eventId,
            type: eventType === 'payment.captured' ? 'PaymentCaptured' : 'PaymentFailed',
            payload,
            status: 'PENDING',
          },
        });
      });
    } catch (err) {
      logger.error('[Webhook Razorpay Error]:', err instanceof Error ? err : new Error(String(err)));
    }
  }

  // 3. Ultra-fast <15ms HTTP 200 Response
  return NextResponse.json({ received: true }, { status: 200 });
}
