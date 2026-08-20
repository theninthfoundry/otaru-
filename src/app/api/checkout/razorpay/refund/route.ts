import { NextResponse } from 'next/server';
import { validateBody, RefundRequestSchema } from '@/lib/payments/schemas';
import { checkPaymentRateLimit } from '@/lib/payments/payment-rate-limiter';
import { getTransactions, updateTransactionStatus } from '@/lib/payments/ledger';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';

export async function POST(request: Request) {
  const reqHeaders = request.headers;
  const ip =
    reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    reqHeaders.get('x-real-ip') ||
    '127.0.0.1';

  try {
    const rateLimit = checkPaymentRateLimit('refund', ip);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      auditLog({
        type: 'RATE_LIMIT_BLOCKED',
        details: `Refund blocked by rate limiter. IP: ${ip}`,
        ip,
        meta: { endpoint: 'refund' },
      });
      return NextResponse.json(
        { error: 'Too many refund requests. Please wait.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.', code: 'INVALID_BODY' }, { status: 400 });
    }

    const validation = validateBody(RefundRequestSchema, rawBody);
    if (validation.error || !validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Validation failed', code: 'VALIDATION_FAILED' },
        { status: 400 },
      );
    }

    const { paymentId, amount, reason } = validation.data;

    const transactions = getTransactions();
    const tx = transactions.find(t => t.id === paymentId || t.orderId === paymentId);

    if (!tx) {
      return NextResponse.json(
        { error: 'Transaction not found in Otaru Ledger.', code: 'NOT_FOUND' },
        { status: 404 },
      );
    }

    if (tx.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'Transaction has already been refunded.', code: 'ALREADY_REFUNDED' },
        { status: 409 },
      );
    }

    if (tx.status !== 'CAPTURED') {
      return NextResponse.json(
        { error: `Cannot refund a transaction with status: ${tx.status}. Only CAPTURED transactions can be refunded.`, code: 'INVALID_STATE' },
        { status: 400 },
      );
    }

    const refundAmount = amount ?? tx.amount;

    if (refundAmount > tx.amount) {
      return NextResponse.json(
        { error: `Refund amount (${refundAmount}) exceeds transaction amount (${tx.amount}).`, code: 'AMOUNT_EXCEEDED' },
        { status: 400 },
      );
    }

    const refundAmountInCents = Math.round(refundAmount * 100);
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let refundResult: { id: string; status: string; amount: number; mock: boolean } | null = null;

    if (keyId && keySecret && !tx.id.startsWith('order_MOCK')) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch(`https://api.razorpay.com/v1/payments/${tx.id}/refund`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: refundAmountInCents,
            notes: {
              reason: reason ?? 'Refund initiated via Otaru Admin Ledger.',
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          refundResult = { id: data.id, status: data.status, amount: data.amount / 100, mock: false };
          logger.info(`[Refund API] Live refund initiated: ${data.id}`);
        } else {
          const errText = await response.text();
          logger.error(`[Refund API] Live refund failed: ${errText}`);
        }
      } catch (e: unknown) {
        logger.error('[Refund API] Exception calling Razorpay:', e instanceof Error ? e : new Error(String(e)));
      }
    }

    if (!refundResult) {
      const mockRefundId = `rfnd_MOCK_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      refundResult = { id: mockRefundId, status: 'processed', amount: refundAmount, mock: true };
      logger.info(`[Refund API] Sandbox refund simulated: ${mockRefundId}`);
    }

    updateTransactionStatus(
      tx.id,
      'REFUNDED',
      `Refund ${refundResult.mock ? '[Sandbox]' : '[Live]'} processed. Refund ID: ${refundResult.id}. Amount: ${refundResult.amount} ${tx.currency}. Reason: ${reason ?? 'N/A'}`,
      { signatureVerified: true },
    );

    auditLog({
      type: 'REFUND_ISSUED',
      details: `Refund issued for order ${tx.orderId}. Amount: ${refundResult.amount} ${tx.currency}. Mode: ${refundResult.mock ? 'SANDBOX' : 'LIVE'}`,
      ref: tx.orderId,
      ip,
      email: tx.customerId,
      meta: { refundId: refundResult.id, amount: refundResult.amount, reason },
    });

    return NextResponse.json({
      success: true,
      refundId: refundResult.id,
      amount: refundResult.amount,
      currency: tx.currency,
      mock: refundResult.mock,
    });
  } catch (error: unknown) {
    logger.error('[Refund API] Unhandled exception:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Refund failed. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
