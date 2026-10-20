import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { validateEnvMatrix } from '@/lib/testing/env-matrix-checker';
import { issueNonceAsync } from '@/lib/payments/nonce-store';

describe('HOUSE OF OTARU — Production Data Integrity & Payment Lifecycle Gate', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.ADMIN_API_SECRET = 'otaru_test_admin_secret_998877';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test_razorpay_secret_112233';
    process.env.RAZORPAY_KEY_SECRET = 'keysec_test_razorpay_secret_445566';
    process.env.PAYMENT_CART_SECRET = 'cart_test_secret_778899001122';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  // ─────────────────────────────────────────────────────────────
  // 1. PRODUCTION DATABASE INTEGRITY & UNSAFE FALLBACK ELIMINATION
  // ─────────────────────────────────────────────────────────────
  describe('01. Unsafe Fallback Elimination & Database Gates', () => {
    it('refuses order creation in production mode if DATABASE_URL is unconfigured (503)', async () => {
      // Emulate production environment without database
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: checkoutHandler } = await import('@/app/api/checkout/route');

      const payload = {
        items: [{ id: '041-M', qty: 1 }],
        customer: {
          email: 'patron@houseofotaru.com',
          firstName: 'Archival',
          lastName: 'Collector',
          address: '42 Boro Stitch Way',
          city: 'Kyoto',
          zip: '600-8001',
        },
        currency: 'USD',
      };

      const request = new Request('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await checkoutHandler(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.code).toBe('DATABASE_UNAVAILABLE');
    });

    it('refuses razorpay order route in production mode if DATABASE_URL is unconfigured (503)', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: razorpayOrderHandler } = await import('@/app/api/checkout/razorpay/order/route');

      const payload = {
        cart: {
          lines: [
            {
              id: '041-M',
              quantity: 1,
              cost: { totalAmount: { amount: '480.00', currencyCode: 'USD' } },
              merchandise: { product: { id: '041' } },
            },
          ],
        },
        customer: {
          email: 'patron@houseofotaru.com',
          firstName: 'Archival',
          lastName: 'Collector',
          address: '42 Boro Stitch Way',
          city: 'Kyoto',
          zip: '600-8001',
        },
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await razorpayOrderHandler(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.code).toBe('DATABASE_UNAVAILABLE');
    });

    it('refuses webhook processing with 503 when DATABASE_URL is missing in production to force gateway retry', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const webhookBody = JSON.stringify({
        event: 'payment.captured',
        event_id: 'evt_prod_retry_test_001',
        payload: {
          payment: {
            entity: {
              id: 'pay_live_test_123',
              order_id: 'order_live_test_456',
              amount: 48000,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      });

      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(webhookBody)
        .digest('hex');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature,
        },
        body: webhookBody,
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(503);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHORITATIVE CATALOG PRICING (ZERO-TRUST PRICE GUARD)
  // ─────────────────────────────────────────────────────────────
  describe('02. Server Catalog Authority', () => {
    it('discards client-submitted price manipulation and calculates from catalog', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: checkoutHandler } = await import('@/app/api/checkout/route');

      const catalogPrice = PRODUCT_CATALOG['041']?.price;
      expect(catalogPrice).toBe(480);

      // Tampered client price (trying to acquire a $480 jacket for $0.01)
      const payload = {
        items: [{ id: '041-M', qty: 1, price: 0.01, amount: 0.01 }],
        customer: {
          email: 'attacker@sec-probe.net',
          firstName: 'Malicious',
          lastName: 'Actor',
          address: 'Unknown Street',
          city: 'Tokyo',
          zip: '100-0001',
        },
        currency: 'USD',
      };

      const request = new Request('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await checkoutHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Server-authoritative total: subtotal 480 + shipping 0 (>250) + gst 58 (12% of 480) = 538
      expect(data.amount).toBe(538);
      expect(data.amount).not.toBe(0.01);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. PAYMENT VERIFICATION CRYPTOGRAPHY & NONCE REPLAY SHIELD
  // ─────────────────────────────────────────────────────────────
  describe('03. Payment Verification Cryptography', () => {
    it('rejects verification when cryptographic HMAC signature is forged or mismatched', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const forgedPayload = {
        razorpay_order_id: 'order_test_9988776655',
        razorpay_payment_id: 'pay_test_1122334455',
        razorpay_signature: 'forged_sha256_hex_signature_abcdef1234567890',
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgedPayload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe('SIGNATURE_MISMATCH');
      expect(data.verified).toBe(false);
    });

    it('accepts authentic HMAC signature and verifies correctly', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const orderId = 'order_test_real_order_123';
      const paymentId = 'pay_test_real_payment_456';
      const secret = process.env.RAZORPAY_KEY_SECRET!;

      const validSig = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const payload = {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSig,
        internalOrderId: 'OTARU-REG-882211',
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.verified).toBe(true);
    });

    it('strictly forbids mock verification in production mode (403)', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const mockPayload = {
        razorpay_order_id: 'order_test_mock_order_123',
        razorpay_payment_id: 'pay_MOCK_SANDBOX999',
        razorpay_signature: 'mock_signature_approved',
        mock: true,
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.code).toBe('PRODUCTION_MOCK_FORBIDDEN');
      expect(data.verified).toBe(false);
    });

    it('blocks replay attack when a payment nonce is re-used', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const orderId = 'order_test_nonce_order_777';
      const paymentId = 'pay_test_nonce_pay_888';
      const secret = process.env.RAZORPAY_KEY_SECRET!;

      const nonce = await issueNonceAsync(orderId);

      const validSig = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const payload = {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSig,
        nonce,
      };

      // First verification attempt: consumes nonce
      const req1 = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res1 = await verifyHandler(req1);
      expect(res1.status).toBe(200);

      // Second verification attempt with same nonce: MUST be rejected with 409
      const req2 = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res2 = await verifyHandler(req2);
      expect(res2.status).toBe(409);
      const data2 = await res2.json();
      expect(data2.code).toBe('REPLAY_DETECTED');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. RAZORPAY WEBHOOK SECURITY & IDEMPOTENCY
  // ─────────────────────────────────────────────────────────────
  describe('04. Webhook Security & Idempotency', () => {
    it('rejects webhooks with missing signature or missing secret (401)', async () => {
      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'payment.captured' }),
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
    });

    it('rejects webhooks with an invalid cryptographic signature (401)', async () => {
      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': '0000000000000000000000000000000000000000000000000000000000000000',
        },
        body: JSON.stringify({ event: 'payment.captured' }),
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
    });

    it('accepts webhooks with valid HMAC signature calculated over raw payload', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const rawBody = JSON.stringify({
        event: 'payment.captured',
        event_id: 'evt_valid_webhook_001',
        payload: {
          payment: {
            entity: {
              id: 'pay_webhook_test_001',
              order_id: 'order_webhook_test_001',
              amount: 53800,
              currency: 'USD',
            },
          },
        },
      });

      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(rawBody)
        .digest('hex');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature,
        },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. ENVIRONMENT MATRIX & SECRET ISOLATION
  // ─────────────────────────────────────────────────────────────
  describe('05. Environment Matrix & Secret Isolation', () => {
    it('detects violations when server secrets are prefixed with NEXT_PUBLIC_', () => {
      process.env.NEXT_PUBLIC_ADMIN_SECRET = 'leak_secret_value_123';
      const violations = validateEnvMatrix();
      const leak = violations.find((v) => v.variable === 'NEXT_PUBLIC_ADMIN_SECRET');
      expect(leak).toBeDefined();
      expect(leak?.severity).toBe('CRITICAL');
    });

    it('identifies missing production secrets in production mode', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;
      delete process.env.RAZORPAY_KEY_SECRET;

      const violations = validateEnvMatrix();
      const dbViolation = violations.find((v) => v.variable === 'DATABASE_URL');
      const rzpViolation = violations.find((v) => v.variable === 'RAZORPAY_KEY_SECRET');

      expect(dbViolation).toBeDefined();
      expect(rzpViolation).toBeDefined();
    });
  });
});
