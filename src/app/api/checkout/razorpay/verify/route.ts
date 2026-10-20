import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateBody, VerifyRequestSchema } from '@/lib/payments/schemas';
import { checkPaymentRateLimit } from '@/lib/payments/payment-rate-limiter';
import { consumeNonceAsync } from '@/lib/payments/nonce-store';
import { updateTransactionStatus } from '@/lib/payments/ledger';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';
import { sendOrderConfirmationWhatsApp } from '@/lib/integrations/interakt';
import { trackKlaviyoEvent } from '@/lib/integrations/klaviyo';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock, nonce, internalOrderId } = validation.data;

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
      const nonceResult = await consumeNonceAsync(nonce, razorpay_order_id);
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

      // Production Data Integrity Gate: Refuse false success if database is unconfigured
      if (isProduction && !isDatabaseConfigured()) {
        logger.error('[Verify API CRITICAL ALERT] Payment captured on gateway, but database is unconfigured in production.', {
          gatewayOrderId: razorpay_order_id,
          gatewayPaymentId: razorpay_payment_id,
        });
        auditLog({
          type: 'RECONCILIATION_REQUIRED',
          details: `Payment CAPTURED on gateway but persistence unconfigured. Payment: ${razorpay_payment_id}`,
          ref: razorpay_order_id,
          meta: { paymentId: razorpay_payment_id, gatewayOrderId: razorpay_order_id, status: 'UNPERSISTED_PAYMENT' },
        });
        return NextResponse.json(
          {
            verified: false,
            error: 'Payment was captured, but order confirmation persistence failed. Please retain your payment reference and contact the atelier concierge.',
            code: 'PAYMENT_CAPTURED_PERSISTENCE_FAILED',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
          },
          { status: 500 }
        );
      }

      let isUnmatchedPayment = false;
      let matchedInternalOrderId: string | null = null;
      let amountMismatchDetected = false;

      if (isDatabaseConfigured()) {
        try {
          await prisma.$transaction(async (tx) => {
            const existingPayment = await tx.payment.findUnique({
              where: { gatewayOrderId: razorpay_order_id },
              include: { order: true },
            });

            if (existingPayment) {
              matchedInternalOrderId = existingPayment.order.internalId;

              // 1. Idempotency Guard: Already captured payment
              if (existingPayment.status === 'CAPTURED') {
                logger.info(`[Verify API] Payment ${razorpay_payment_id} already marked CAPTURED. Idempotent acknowledgment.`);
                return;
              }

              // 2. Authoritative Amount Cross-Check
              if (validation.data.amount) {
                const clientAmountMinor = Math.round(parseFloat(validation.data.amount) * 100);
                if (clientAmountMinor !== existingPayment.amountMinor) {
                  logger.warn(`[Verify API CRITICAL] AMOUNT_MISMATCH for payment ${razorpay_payment_id}. Expected: ${existingPayment.amountMinor}, Received: ${clientAmountMinor}`);
                  amountMismatchDetected = true;
                  await tx.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                      status: 'FAILED',
                      gatewayPaymentId: razorpay_payment_id,
                      signature: razorpay_signature,
                      details: `CRITICAL AMOUNT MISMATCH: Gateway/client claimed ${clientAmountMinor}, expected ${existingPayment.amountMinor}.`,
                    },
                  });
                  await tx.paymentEvent.create({
                    data: {
                      paymentId: existingPayment.id,
                      fromStatus: existingPayment.status,
                      toStatus: 'FAILED',
                      gatewayEventId: razorpay_payment_id,
                    },
                  });
                  return;
                }
              }

              await tx.payment.update({
                where: { id: existingPayment.id },
                data: {
                  status: 'CAPTURED',
                  gatewayPaymentId: razorpay_payment_id,
                  signature: razorpay_signature,
                  details: 'Payment captured and HMAC signature verified.',
                },
              });

              await tx.paymentEvent.create({
                data: {
                  paymentId: existingPayment.id,
                  fromStatus: existingPayment.status,
                  toStatus: 'CAPTURED',
                  gatewayEventId: razorpay_payment_id,
                },
              });

              await tx.order.update({
                where: { id: existingPayment.orderId },
                data: {
                  status: 'PAID',
                },
              });

              await tx.outboxEvent.create({
                data: {
                  eventId: `evt_pay_cap_${razorpay_payment_id}`,
                  type: 'PaymentCaptured',
                  payload: {
                    orderId: existingPayment.orderId,
                    internalId: existingPayment.order.internalId,
                    gatewayOrderId: razorpay_order_id,
                    gatewayPaymentId: razorpay_payment_id,
                    amountMinor: existingPayment.amountMinor,
                    currency: existingPayment.currency,
                  },
                  status: 'PENDING',
                },
              });
            } else {
              // 3. Fallback: Check if Order exists by internalOrderId
              const existingOrder = internalOrderId
                ? await tx.order.findUnique({ where: { internalId: internalOrderId } })
                : null;

              if (existingOrder) {
                matchedInternalOrderId = existingOrder.internalId;

                if (validation.data.amount) {
                  const clientAmountMinor = Math.round(parseFloat(validation.data.amount) * 100);
                  if (clientAmountMinor !== existingOrder.totalMinor) {
                    logger.warn(`[Verify API CRITICAL] AMOUNT_MISMATCH for recovered order ${existingOrder.internalId}. Expected: ${existingOrder.totalMinor}, Received: ${clientAmountMinor}`);
                    amountMismatchDetected = true;
                    return;
                  }
                }

                const newPayment = await tx.payment.create({
                  data: {
                    orderId: existingOrder.id,
                    gateway: 'RAZORPAY',
                    gatewayOrderId: razorpay_order_id,
                    gatewayPaymentId: razorpay_payment_id,
                    amountMinor: existingOrder.totalMinor,
                    currency: existingOrder.currency,
                    status: 'CAPTURED',
                    signature: razorpay_signature,
                    details: 'Payment created and captured during verification recovery workflow',
                  },
                });

                await tx.paymentEvent.create({
                  data: {
                    paymentId: newPayment.id,
                    fromStatus: 'CREATED',
                    toStatus: 'CAPTURED',
                    gatewayEventId: razorpay_payment_id,
                  },
                });

                await tx.order.update({
                  where: { id: existingOrder.id },
                  data: { status: 'PAID' },
                });

                await tx.outboxEvent.create({
                  data: {
                    eventId: `evt_pay_cap_rec_${razorpay_payment_id}`,
                    type: 'PaymentCaptured',
                    payload: {
                      orderId: existingOrder.id,
                      internalId: existingOrder.internalId,
                      gatewayOrderId: razorpay_order_id,
                      gatewayPaymentId: razorpay_payment_id,
                      amountMinor: existingOrder.totalMinor,
                    },
                    status: 'PENDING',
                  },
                });
              } else {
                // 4. UNMATCHED PAYMENT ISOLATION (ZERO-FABRICATION PRINCIPLE)
                // When neither Order nor Payment exists, a valid HMAC proves money was paid,
                // BUT DOES NOT establish what products, sizes or quantities were selected.
                // We MUST NOT fabricate a fake 'PAID' order with empty items!
                // Instead, record the payment in PAYMENT_PENDING container and flag for concierge.
                isUnmatchedPayment = true;
                const unmatchedInternalId = internalOrderId || `OTARU-UNMATCHED-${Date.now()}`;
                matchedInternalOrderId = unmatchedInternalId;
                const amountFloat = parseFloat(validation.data.amount || '0');
                const amountMinor = Math.round(amountFloat * 100);

                const unmatchedOrder = await tx.order.create({
                  data: {
                    internalId: unmatchedInternalId,
                    customerEmail: validation.data.customerEmail || 'unmatched-payment@otaru.in',
                    customerName: 'UNMATCHED PAYMENT (REQUIRES ATELIER RECONCILIATION)',
                    status: 'PAYMENT_PENDING', // NEVER mark PAID without verified cart items
                    subtotalMinor: amountMinor,
                    shippingMinor: 0,
                    taxMinor: 0,
                    totalMinor: amountMinor,
                    currency: 'INR',
                    payments: {
                      create: {
                        gateway: 'RAZORPAY',
                        gatewayOrderId: razorpay_order_id,
                        gatewayPaymentId: razorpay_payment_id,
                        amountMinor,
                        currency: 'INR',
                        status: 'CAPTURED',
                        signature: razorpay_signature,
                        details: 'CRITICAL: Captured payment could not be matched to an authoritative cart/order in database. Held for manual concierge reconciliation. DO NOT DISPATCH.',
                      },
                    },
                  },
                });

                await tx.outboxEvent.create({
                  data: {
                    eventId: `evt_unmatched_pay_${razorpay_payment_id}`,
                    type: 'UnmatchedPaymentCaptured',
                    payload: {
                      orderId: unmatchedOrder.id,
                      internalId: unmatchedInternalId,
                      gatewayOrderId: razorpay_order_id,
                      gatewayPaymentId: razorpay_payment_id,
                      requiresReconciliation: true,
                    },
                    status: 'PENDING',
                  },
                });
              }
            }
          });
        } catch (dbErr) {
          logger.error('[Verify API CRITICAL] Database transaction failed during payment capture verification', {
            error: dbErr,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
          });
          if (isProduction) {
            return NextResponse.json(
              {
                verified: false,
                error: 'Payment was captured, but persistence encountered an error. Your acquisition is safely logged for reconciliation.',
                code: 'PERSISTENCE_TRANSACTION_FAILED',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
              },
              { status: 500 }
            );
          }
        }
      }

      if (amountMismatchDetected) {
        auditLog({
          type: 'AMOUNT_MISMATCH_BLOCKED',
          details: `Verification rejected due to amount mismatch for payment ${razorpay_payment_id}`,
          ref: razorpay_order_id,
          meta: { paymentId: razorpay_payment_id },
        });
        return NextResponse.json(
          {
            verified: false,
            error: 'Payment verification failed: captured amount does not match authoritative order total.',
            code: 'AMOUNT_MISMATCH',
            paymentId: razorpay_payment_id,
          },
          { status: 400 }
        );
      }

      if (isUnmatchedPayment) {
        auditLog({
          type: 'RECONCILIATION_REQUIRED',
          details: `Captured payment ${razorpay_payment_id} unlinked from cart provenance. Staged for atelier concierge intake.`,
          ref: razorpay_order_id,
          meta: { paymentId: razorpay_payment_id, orderId: razorpay_order_id, internalId: matchedInternalOrderId },
        });
        return NextResponse.json(
          {
            verified: false,
            requiresReconciliation: true,
            error: 'Payment was received by gateway, but order item provenance requires concierge reconciliation. Your payment ID has been securely logged. The atelier team has been notified.',
            code: 'PAYMENT_CAPTURED_UNMATCHED_ORDER',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            internalOrderId: matchedInternalOrderId,
          },
          { status: 202 }
        );
      }

      auditLog({
        type: 'PAYMENT_VERIFIED',
        details: `Live payment CAPTURED. Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`,
        ip,
        ref: razorpay_order_id,
        meta: { paymentId: razorpay_payment_id, mode: 'LIVE' },
      });

      // Automated Multi-Channel Notification Triggers
      if (validation.data.customerEmail) {
        trackKlaviyoEvent({
          eventName: 'Placed Order',
          email: validation.data.customerEmail,
          properties: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: validation.data.amount || '0',
          },
        }).catch((err) => console.warn('[Klaviyo Event Dispatch Error]:', err));
      }

      if (validation.data.customerPhone) {
        sendOrderConfirmationWhatsApp(
          validation.data.customerPhone,
          validation.data.customerName || 'Archival Collector',
          razorpay_order_id,
          validation.data.amount ? `₹${validation.data.amount}` : 'Acquisition Confirmed'
        ).catch((err) => console.warn('[Interakt WhatsApp Dispatch Error]:', err));
      }

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

      if (validation.data.customerEmail) {
        trackKlaviyoEvent({
          eventName: 'Placed Order (Sandbox)',
          email: validation.data.customerEmail,
          properties: {
            orderId: razorpay_order_id,
            mode: 'SANDBOX',
          },
        }).catch((err) => console.warn('[Klaviyo Event Dispatch Error]:', err));
      }

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
