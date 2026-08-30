import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateBody, VerifyRequestSchema } from '@/lib/payments/schemas';
import { checkPaymentRateLimit } from '@/lib/payments/payment-rate-limiter';
import { consumeNonce } from '@/lib/payments/nonce-store';
import { updateTransactionStatus } from '@/lib/payments/ledger';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

  try {
    const rateLimit = checkPaymentRateLimit('verify', ip);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      auditLog({
        type: 'RATE_LIMIT_BLOCKED',
        details: `Verify blocked by payment rate limiter. IP: ${ip}`,
        ip,
        meta: { endpoint: 'verify' },
      });
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.', code: 'INVALID_BODY' }, { status: 400 });
    }

    const validation = validateBody(VerifyRequestSchema, rawBody);
    if (!validation.success) {
      auditLog({
        type: 'SCHEMA_VALIDATION_FAILED',
        details: `Verify schema validation failed: ${validation.error}`,
        ip,
      });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_FAILED' },
        { status: 400 },
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock, nonce } = validation.data;

    // Strict Production Gate: Reject any mock payment attempt in Production
    if (isProduction && (mock || razorpay_signature === 'mock_signature_approved')) {
      logger.warn(`[Verify API SECURITY ALERT] Rejected mock verification attempt in production environment. IP: ${ip}, Order: ${razorpay_order_id}`);
      auditLog({
        type: 'PAYMENT_FAILED',
        details: `Mock verification attempt FORBIDDEN in production. Order: ${razorpay_order_id}`,
        ip,
        ref: razorpay_order_id,
      });
      return NextResponse.json(
        {
          verified: false,
          error: 'Mock payment verification is strictly forbidden in production.',
          code: 'PRODUCTION_MOCK_FORBIDDEN',
        },
        { status: 403 },
      );
    }

    if (nonce) {
      const nonceResult = consumeNonce(nonce, razorpay_order_id);
      if (!nonceResult.ok) {
        const isReplay = nonceResult.reason === 'ALREADY_CONSUMED';
        auditLog({
          type: isReplay ? 'REPLAY_ATTACK_DETECTED' : 'NONCE_REPLAY_BLOCKED',
          details: `Nonce ${nonceResult.reason} for order ${razorpay_order_id}. Nonce: ${nonce}`,
          ip,
          ref: razorpay_order_id,
          meta: { reason: nonceResult.reason },
        });
        return NextResponse.json(
          {
            verified: false,
            error: isReplay
              ? 'This payment credential has already been used. Possible replay attack detected.'
              : 'Payment session expired or invalid. Please restart checkout.',
            code: isReplay ? 'REPLAY_DETECTED' : `NONCE_${nonceResult.reason}`,
          },
          { status: 409 },
        );
      }
      auditLog({
        type: 'NONCE_CONSUMED',
        details: `Nonce successfully consumed for order ${razorpay_order_id}`,
        ip,
        ref: razorpay_order_id,
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && !mock) {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSigBuffer = Buffer.from(
        crypto.createHmac('sha256', keySecret).update(text).digest('hex'),
        'utf8',
      );
      const receivedSigBuffer = Buffer.from(razorpay_signature, 'utf8');

      const signaturesMatch =
        expectedSigBuffer.length === receivedSigBuffer.length &&
        crypto.timingSafeEqual(expectedSigBuffer, receivedSigBuffer);

      if (!signaturesMatch) {
        logger.warn(`[Verify API] Signature MISMATCH for order: ${razorpay_order_id}`);
        updateTransactionStatus(
          razorpay_order_id,
          'FAILED',
          'Signature verification failed. Cryptographic mismatch detected.',
          { signatureVerified: false },
        );
        auditLog({
          type: 'PAYMENT_FAILED',
          details: `Signature mismatch for order ${razorpay_order_id}. Payment ID: ${razorpay_payment_id}`,
          ip,
          ref: razorpay_order_id,
          meta: { paymentId: razorpay_payment_id },
        });
        return NextResponse.json(
          {
            verified: false,
            error: 'Payment verification failed. Cryptographic signature did not match.',
            code: 'SIGNATURE_MISMATCH',
          },
          { status: 400 },
        );
      }

      logger.info(`[Verify API] Live signature verified for order: ${razorpay_order_id}`);
      updateTransactionStatus(
        razorpay_order_id,
        'CAPTURED',
        `Live payment captured. Payment ID: ${razorpay_payment_id}. Constant-time signature verified.`,
        { signatureVerified: true },
      );
      auditLog({
        type: 'PAYMENT_VERIFIED',
        details: `Live payment CAPTURED. Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`,
        ip,
        ref: razorpay_order_id,
        meta: { paymentId: razorpay_payment_id, mode: 'LIVE' },
      });
      return NextResponse.json({ verified: true });
    }

    // Local Development Sandbox Only
    if (!isProduction && razorpay_signature === 'mock_signature_approved') {
      updateTransactionStatus(
        razorpay_order_id,
        'CAPTURED',
        `Sandbox payment captured. Payment ID: ${razorpay_payment_id}. Mock authorization accepted.`,
        { signatureVerified: true },
      );
      auditLog({
        type: 'PAYMENT_VERIFIED',
        details: `Sandbox payment CAPTURED. Order: ${razorpay_order_id}`,
        ip,
        ref: razorpay_order_id,
        meta: { mode: 'SANDBOX' },
      });
      return NextResponse.json({ verified: true });
    }

    updateTransactionStatus(
      razorpay_order_id,
      'FAILED',
      `Payment verification rejected. Signature: ${razorpay_signature}`,
      { signatureVerified: false },
    );
    auditLog({
      type: 'PAYMENT_FAILED',
      details: `Payment REJECTED for order: ${razorpay_order_id}`,
      ip,
      ref: razorpay_order_id,
    });
    return NextResponse.json(
      { verified: false, error: 'Payment verification rejected.', code: 'PAYMENT_REJECTED' },
      { status: 400 },
    );
  } catch (error: unknown) {
    logger.error('[Verify API] Unhandled exception:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
