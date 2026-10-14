import { NextResponse } from 'next/server';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { checkPaymentRateLimit } from '@/lib/payments/payment-rate-limiter';
import { checkIdempotencyAsync, registerIdempotencyKey } from '@/lib/payments/idempotency';
import { evaluateFraudRisk } from '@/lib/payments/fraud';
import { issueCartToken } from '@/lib/payments/cart-token';
import { issueNonce } from '@/lib/payments/nonce-store';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';
import { idempotencyEngine } from '@/lib/domain/checkout/idempotency-engine';
import { leasedInventoryEngine } from '@/lib/domain/inventory/lease-reservation-engine';
import { outboxEventEngine } from '@/lib/domain/events/outbox-event-engine';
import { tamperEvidentLedger } from '@/lib/security/tamper-evident-ledger';

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
  const idempotencyKey = request.headers.get('Idempotency-Key') ?? request.headers.get('idempotency-key');

  try {
    const ipRateLimit = checkPaymentRateLimit('order', ip);
    if (!ipRateLimit.allowed) {
      auditLog({
        type: 'RATE_LIMIT_BLOCKED',
        details: `Checkout blocked by IP rate limiter. IP: ${ip}`,
        ip,
      });
      return NextResponse.json(
        { error: 'Too many checkout requests. Please wait a moment.', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const customer = body.customer || {};
    const email = typeof customer.email === 'string' ? customer.email.trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid customer email is required for atelier accession.', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Idempotency check
    if (idempotencyKey) {
      const idempCheck = await checkIdempotencyAsync(idempotencyKey, email);
      if (idempCheck.status === 'DUPLICATE') {
        auditLog({
          type: 'IDEMPOTENCY_COLLISION',
          details: `Duplicate checkout blocked via idempotency key for email: ${email}`,
          ip,
          email,
        });
        return NextResponse.json(
          { ...idempCheck.cachedResponse, idempotent: true },
          { status: 200 }
        );
      }
    }

    // Authoritative Server-Side Price Calculation (Zero-Trust)
    let subtotal = 0;
    const verifiedLines: Array<{ id: string; quantity: number; amount: string }> = [];

    for (const item of items) {
      if (!item || typeof item.id !== 'string') continue;
      const baseId = item.id.split('-')[0] || item.id;
      const catalogItem = PRODUCT_CATALOG[baseId];
      if (!catalogItem && (process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true')) {
        return NextResponse.json(
          { error: `Item '${item.id}' could not be verified in product catalog.`, code: 'UNKNOWN_PRODUCT' },
          { status: 400 }
        );
      }
      const verifiedPrice = catalogItem ? catalogItem.price : 0;
      const verifiedQty = Math.max(1, Math.min(10, Math.floor(Number(item.qty) || 1)));

      const lineTotal = verifiedPrice * verifiedQty;
      subtotal += lineTotal;

      verifiedLines.push({
        id: item.id,
        quantity: verifiedQty,
        amount: String(lineTotal),
      });
    }

    const shipping = subtotal > 250 ? 0 : 15;
    const isGiftWrapping = Boolean(body.giftWrapping);
    const giftFee = isGiftWrapping ? (subtotal >= 500 ? 0 : 25) : 0;
    const gstAmount = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + shipping + gstAmount + giftFee;

    // Fraud Evaluation
    const fraud = evaluateFraudRisk({
      email,
      ip,
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      amount: totalAmount,
      currency: body.currency || 'USD',
    });

    if (fraud.decision === 'BLOCK') {
      auditLog({
        type: 'FRAUD_BLOCKED',
        details: `Checkout blocked by fraud risk evaluator. Score: ${fraud.score}`,
        ip,
        email,
      });
      return NextResponse.json(
        { error: 'Transaction could not be authorized by atelier security.', code: 'FRAUD_BLOCKED' },
        { status: 403 }
      );
    }

    const internalOrderId = `OTARU-REG-${Math.floor(Math.random() * 900000) + 100000}`;
    const nonce = issueNonce(internalOrderId);
    const cartToken = issueCartToken({
      lines: verifiedLines,
      amount: totalAmount,
      currency: body.currency || 'USD',
      orderId: internalOrderId,
    });

    // Check for Razorpay live keys
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let razorpayOrderId = `order_${internalOrderId.toLowerCase()}`;
    const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

    if (keyId && keySecret) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100),
            currency: body.currency === 'INR' ? 'INR' : 'USD',
            receipt: internalOrderId,
            notes: {
              customerEmail: email,
              client: 'House of Otaru Unified Core',
              cartToken: cartToken.slice(0, 32),
            },
          }),
        });
        if (res.ok) {
          const rzData = await res.json();
          razorpayOrderId = rzData.id;
        } else if (isProduction) {
          return NextResponse.json(
            { error: 'Payment gateway unavailable in production mode.', code: 'RAZORPAY_GATEWAY_UNAVAILABLE' },
            { status: 503 }
          );
        }
      } catch (err) {
        logger.warn('[Checkout] Razorpay API fallback to mock ledger order', { error: err });
        if (isProduction) {
          return NextResponse.json(
            { error: 'Payment gateway unavailable in production mode.', code: 'RAZORPAY_GATEWAY_UNAVAILABLE' },
            { status: 503 }
          );
        }
      }
    } else if (isProduction) {
      return NextResponse.json(
        { error: 'Payment gateway credentials unconfigured in production.', code: 'RAZORPAY_GATEWAY_UNAVAILABLE' },
        { status: 503 }
      );
    }

    // 1. Immutable Block in Tamper-Evident Cryptographic Ledger
    const ledgerBlock = tamperEvidentLedger.appendBlock(internalOrderId, 'ORDER_COMMITTED', {
      orderId: internalOrderId,
      customerEmail: email,
      amount: totalAmount,
      subtotal,
      gstAmount,
      currency: body.currency || 'USD',
      lineCount: verifiedLines.length,
      clientIp: ip,
      fraudScore: fraud.score,
    });

    // 2. Stage Transactional Outbox Event (Guaranteed At-Least-Once Delivery)
    await outboxEventEngine.stageEvent('OrderCreated', internalOrderId, {
      orderNumber: internalOrderId,
      customerEmail: email,
      totalMinor: Math.round(totalAmount * 100),
      currency: body.currency || 'USD',
      itemCount: verifiedLines.reduce((acc, curr) => acc + curr.quantity, 0),
      ledgerHash: ledgerBlock.currentHash,
    });

    // 3. Commit/Reserve Inventory Leases for Verified Items
    for (const item of verifiedLines) {
      await leasedInventoryEngine.reserveLease(item.id, internalOrderId, item.quantity, 1800);
    }

    auditLog({
      type: 'ORDER_CREATED',
      ref: internalOrderId,
      details: `Atelier accession ledger order created for ${email}. Total: $${totalAmount}`,
      ip,
      email,
      meta: { ledgerHash: ledgerBlock.currentHash },
    });

    const responsePayload = {
      success: true,
      orderId: razorpayOrderId,
      internalOrderId,
      nonce,
      cartToken,
      amount: totalAmount,
      currency: body.currency || 'USD',
      ledgerHash: ledgerBlock.currentHash,
      ledgerIndex: ledgerBlock.index,
    };

    if (idempotencyKey) {
      await registerIdempotencyKey(idempotencyKey, email, internalOrderId, responsePayload);
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err) {
    logger.error('[CheckoutAPI] Unexpected failure', err, { clientIp: ip });
    return NextResponse.json(
      { error: 'An unexpected security failure occurred.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
