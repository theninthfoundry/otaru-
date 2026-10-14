import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';
import { tamperEvidentLedger } from '@/lib/security/tamper-evident-ledger';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  try {
    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internalOrderId,
      nonce,
      mock,
    } = body;

    const orderId = internalOrderId || razorpay_order_id || `OTARU-ORDER-${Date.now()}`;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

    if (isProduction && (mock || !secret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature)) {
      return NextResponse.json(
        { error: 'Live cryptographic payment verification required in production.', code: 'INVALID_CREDENTIALS' },
        { status: 400 }
      );
    }

    if (nonce) {
      const { consumeNonceAsync } = await import('@/lib/payments/nonce-store');
      const nonceResult = await consumeNonceAsync(nonce, razorpay_order_id || orderId);
      if (!nonceResult.ok) {
        return NextResponse.json(
          { error: 'Payment nonce is invalid or has already been consumed.', code: 'NONCE_INVALID' },
          { status: 409 }
        );
      }
    }

    // Verify signature if credentials exist
    if (secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const expectedSigBuffer = Buffer.from(generatedSignature, 'utf8');
      const receivedSigBuffer = Buffer.from(razorpay_signature, 'utf8');

      if (
        expectedSigBuffer.length !== receivedSigBuffer.length ||
        !crypto.timingSafeEqual(expectedSigBuffer, receivedSigBuffer)
      ) {
        auditLog({
          type: 'PAYMENT_FAILED',
          details: `Signature mismatch for order: ${orderId}`,
          ip,
          ref: orderId,
        });
        return NextResponse.json(
          { error: 'Payment signature verification failed.', code: 'SIGNATURE_INVALID' },
          { status: 400 }
        );
      }
    }

    // Append cryptographic block in ledger
    const ledgerBlock = tamperEvidentLedger.appendBlock(orderId, 'PAYMENT_SETTLED', {
      orderId,
      razorpayOrderId: razorpay_order_id || null,
      razorpayPaymentId: razorpay_payment_id || 'ESCROW-SETTLED',
      isSimulated: Boolean(mock || !secret),
      clientIp: ip,
      verifiedAt: new Date().toISOString(),
    });

    auditLog({
      type: 'PAYMENT_VERIFIED',
      ref: orderId,
      details: `Payment verified and recorded in atelier ledger. Hash: ${ledgerBlock.currentHash}`,
      ip,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      orderId,
      ledgerHash: ledgerBlock.currentHash,
    });
  } catch (err) {
    logger.error('[CheckoutVerifyAPI] Verification failure', err, { clientIp: ip });
    return NextResponse.json(
      { error: 'Verification failed.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
