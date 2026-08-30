import { NextResponse } from 'next/server';
import { validateBody, OrderRequestSchema } from '@/lib/payments/schemas';
import { checkPaymentRateLimit } from '@/lib/payments/payment-rate-limiter';
import { checkIdempotencyAsync, registerIdempotencyKey } from '@/lib/payments/idempotency';
import { evaluateFraudRisk } from '@/lib/payments/fraud';
import { issueCartToken } from '@/lib/payments/cart-token';
import { issueNonce } from '@/lib/payments/nonce-store';
import { addTransaction } from '@/lib/payments/ledger';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
  const idempotencyKey = request.headers.get('Idempotency-Key') ?? request.headers.get('idempotency-key');
  const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

  let email = '';

  try {
    const ipRateLimit = checkPaymentRateLimit('order', ip);
    if (!ipRateLimit.allowed) {
      const retryAfter = Math.ceil((ipRateLimit.resetAt - Date.now()) / 1000);
      auditLog({
        type: 'RATE_LIMIT_BLOCKED',
        details: `Order creation blocked by IP rate limiter. IP: ${ip}`,
        ip,
        meta: { endpoint: 'order', resetAt: ipRateLimit.resetAt },
      });
      return NextResponse.json(
        { error: 'Too many payment requests. Please wait and try again.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.', code: 'INVALID_BODY' }, { status: 400 });
    }

    const validation = validateBody(OrderRequestSchema, rawBody);
    if (!validation.success) {
      auditLog({
        type: 'SCHEMA_VALIDATION_FAILED',
        details: `Order schema validation failed: ${validation.error}`,
        ip,
      });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_FAILED' },
        { status: 400 },
      );
    }

    const { cart, customer } = validation.data;
    email = customer.email;

    const emailRateLimit = checkPaymentRateLimit('order', ip, email);
    if (!emailRateLimit.allowed) {
      const retryAfter = Math.ceil((emailRateLimit.resetAt - Date.now()) / 1000);
      auditLog({
        type: 'RATE_LIMIT_BLOCKED',
        details: `Order creation blocked by email rate limiter. Email: ${email}`,
        ip,
        email,
        meta: { endpoint: 'order', blockedBy: emailRateLimit.blockedBy },
      });
      return NextResponse.json(
        { error: 'Too many orders from this account. Please wait.', code: 'RATE_LIMITED_ACCOUNT' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    const idempCheck = await checkIdempotencyAsync(idempotencyKey, email);
    if (idempCheck.status === 'INVALID_KEY') {
      return NextResponse.json(
        { error: 'Idempotency-Key must be a valid UUID.', code: 'INVALID_IDEMPOTENCY_KEY' },
        { status: 400 },
      );
    }
    if (idempCheck.status === 'DUPLICATE') {
      auditLog({
        type: 'IDEMPOTENCY_COLLISION',
        details: `Duplicate order creation blocked via idempotency key. Email: ${email}`,
        ip,
        email,
      });
      return NextResponse.json(
        { ...idempCheck.cachedResponse, idempotent: true },
        { status: 200 },
      );
    }

    // Monetary values stored in INTEGER MINOR UNITS (paise / cents)
    const subtotalCents = cart.lines.reduce((sum, line) => {
      const price = Math.round(parseFloat(line.cost?.totalAmount?.amount ?? '0') * 100);
      const qty = line.quantity ?? 1;
      return sum + price * qty;
    }, 0);

    const shippingCents = subtotalCents > 30000 ? 0 : 1500;
    const totalCents = subtotalCents + shippingCents;
    const totalFloat = totalCents / 100;

    const fraud = evaluateFraudRisk({
      email,
      ip,
      firstName: customer.firstName,
      lastName: customer.lastName,
      amount: totalFloat,
      currency: cart.cost?.subtotalAmount?.currencyCode ?? 'USD',
    });

    if (fraud.decision === 'BLOCK') {
      auditLog({
        type: 'FRAUD_BLOCKED',
        details: `Order BLOCKED by fraud engine. Score: ${fraud.score}. Signals: ${fraud.signals.join(', ')}`,
        ip,
        email,
        meta: { score: fraud.score, signals: fraud.signals },
      });
      return NextResponse.json(
        { error: 'Order could not be processed. Please contact support.', code: 'FRAUD_BLOCKED' },
        { status: 403 },
      );
    }

    const currency = cart.cost?.subtotalAmount?.currencyCode ?? 'USD';
    const internalOrderId = `OTARU-REG-${Math.floor(Math.random() * 900000) + 100000}`;

    const cartTokenLines = cart.lines.map(l => ({
      id: l.id,
      quantity: l.quantity,
      amount: l.cost.totalAmount.amount,
    }));
    const cartToken = issueCartToken({
      lines: cartTokenLines,
      amount: totalFloat,
      currency,
      orderId: internalOrderId,
    });

    const nonce = issueNonce(internalOrderId);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrder = null;
    let isMock = true;

    if (keyId && keySecret) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: totalCents,
            currency: currency === 'USD' ? 'USD' : 'INR',
            receipt: internalOrderId,
            notes: {
              customerEmail: email,
              client: 'Otaru Security Core',
              fraudScore: fraud.score,
            },
          }),
        });

        if (response.ok) {
          razorpayOrder = await response.json();
          isMock = false;
          logger.info(`[Order API] Live order created: ${razorpayOrder.id}`);
        } else {
          const errText = await response.text();
          logger.error(`[Order API] Razorpay order creation failed: ${errText}`);
        }
      } catch (e: unknown) {
        logger.error('[Order API] Exception calling Razorpay:', e);
      }
    }

    // Strict Production Isolation: Throw 503 if Razorpay fails in Production
    if (!razorpayOrder && isProduction) {
      logger.error('[Order API SECURITY ALERT] Razorpay API unavailable in production mode. Refusing mock order fallback.');
      auditLog({
        type: 'ORDER_BLOCKED',
        details: `Order creation rejected: Razorpay gateway unavailable in production mode. Email: ${email}`,
        ip,
        email,
      });
      return NextResponse.json(
        {
          error: 'Payment gateway is currently unavailable. Please try again in a few moments.',
          code: 'RAZORPAY_GATEWAY_UNAVAILABLE',
        },
        { status: 503 },
      );
    }

    if (!razorpayOrder) {
      const mockId = `order_MOCK_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      razorpayOrder = {
        id: mockId,
        amount: totalCents,
        currency,
        receipt: internalOrderId,
        status: 'created',
      };
    }

    addTransaction({
      id: razorpayOrder.id,
      orderId: internalOrderId,
      customerId: email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      amount: totalFloat,
      currency,
      method: isMock ? 'Escrow Sandbox' : 'Razorpay Gateway',
      status: 'CREATED',
      details: `Order created. Fraud score: ${fraud.score} (${fraud.decision}). Gateway: ${razorpayOrder.id}`,
      security: {
        rateLimitPass: true,
        csrfPass: true,
        signatureVerified: false,
      },
    });

    auditLog({
      type: 'ORDER_CREATED',
      details: `Order created successfully. Mode: ${isMock ? 'SANDBOX' : 'LIVE'}. Fraud: ${fraud.decision} (${fraud.score})`,
      ref: internalOrderId,
      ip,
      email,
      meta: { razorpayId: razorpayOrder.id, amountCents: totalCents, fraudScore: fraud.score },
    });

    const responsePayload = {
      orderId: razorpayOrder.id,
      internalOrderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      mock: isMock,
      cartToken,
      nonce,
    };

    registerIdempotencyKey(idempotencyKey, email, internalOrderId, responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    logger.error('[Order API] Unhandled exception:', error);
    auditLog({
      type: 'ORDER_BLOCKED',
      details: `Order creation failed with unhandled exception: ${error instanceof Error ? error.message : String(error)}`,
      ip,
      email: email || undefined,
    });
    return NextResponse.json(
      { error: 'Order could not be created. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
