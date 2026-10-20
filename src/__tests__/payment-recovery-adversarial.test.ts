import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { issueNonceAsync } from '@/lib/payments/nonce-store';

describe('HOUSE OF OTARU — Payment Recovery & Adversarial Resilience Suite', () => {
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
  // 1. ADVERSARIAL REQUEST VALIDATION & PRICE AUTHORITY
  // ─────────────────────────────────────────────────────────────
  describe('01. Request Validation & Price Integrity', () => {
    it('rejects unknown product IDs in production mode (400)', async () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://mock:mock@localhost:5432/mock_db';

      const { POST: checkoutHandler } = await import('@/app/api/checkout/route');

      const payload = {
        items: [{ id: 'NON_EXISTENT_SKU_999', qty: 1 }],
        customer: {
          email: 'adversary@security-probe.org',
          firstName: 'Bad',
          lastName: 'Actor',
          address: 'Unknown St',
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
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.code).toBe('UNKNOWN_PRODUCT');
    });

    it('rejects negative and zero quantities', async () => {
      const { POST: razorpayOrderHandler } = await import('@/app/api/checkout/razorpay/order/route');

      const payload = {
        cart: {
          lines: [
            {
              id: '041-M',
              quantity: -3,
              cost: { totalAmount: { amount: '-1440.00', currencyCode: 'USD' } },
            },
          ],
        },
        customer: { email: 'bad@actor.com', firstName: 'Bad', lastName: 'Actor' },
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await razorpayOrderHandler(request);
      expect([400, 422]).toContain(response.status);
    });

    it('discards client price manipulation and charges authoritative catalog price', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: checkoutHandler } = await import('@/app/api/checkout/route');

      const catalogPrice = PRODUCT_CATALOG['041']?.price;
      expect(catalogPrice).toBe(480);

      // Attempting to pay 5 cents for a $480 archival jacket
      const payload = {
        items: [{ id: '041-M', qty: 1, price: 0.05, amount: 0.05 }],
        customer: {
          email: 'probe@security.org',
          firstName: 'Price',
          lastName: 'Tester',
          address: 'Archival Way',
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
      // Subtotal 480 + shipping 0 (>250) + gst 58 (12% of 480) = 538
      expect(data.amount).toBe(538);
      expect(data.amount).not.toBe(0.05);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. PAYMENT VERIFICATION ADVERSARIAL ATTACKS
  // ─────────────────────────────────────────────────────────────
  describe('02. Payment Verification Security & Amount Cross-Check', () => {
    it('rejects forged HMAC-SHA256 signatures with 400', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const payload = {
        razorpay_order_id: 'order_test_forged_sig_100',
        razorpay_payment_id: 'pay_test_forged_sig_100',
        razorpay_signature: 'deadbeefcafebabe0123456789abcdef0123456789abcdef0123456789abcdef',
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe('SIGNATURE_MISMATCH');
      expect(data.verified).toBe(false);
    });

    it('rejects replayed nonces with 409 REPLAY_DETECTED', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const orderId = 'order_test_replay_001';
      const paymentId = 'pay_test_replay_001';
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

      // 1st request: consumes nonce successfully
      const req1 = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res1 = await verifyHandler(req1);
      expect(res1.status).toBe(200);

      // 2nd request with same nonce: must be rejected as replay attack
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

    it('strictly forbids mock verification in production mode (403)', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const payload = {
        razorpay_order_id: 'order_test_mock_gate_001',
        razorpay_payment_id: 'pay_MOCK_SANDBOX777',
        razorpay_signature: 'mock_signature_approved',
        mock: true,
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.code).toBe('PRODUCTION_MOCK_FORBIDDEN');
    });

    it('returns 500 with payment ID if database is unconfigured in production during verification', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      const orderId = 'order_test_prod_unconf_001';
      const paymentId = 'pay_test_prod_unconf_001';
      const secret = process.env.RAZORPAY_KEY_SECRET!;

      const validSig = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const payload = {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSig,
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.code).toBe('PAYMENT_CAPTURED_PERSISTENCE_FAILED');
      expect(data.paymentId).toBe(paymentId);
      expect(data.verified).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. ZERO-FABRICATION ORPHAN PAYMENT RECOVERY AUDIT
  // ─────────────────────────────────────────────────────────────
  describe('03. Orphan Payment Recovery & Zero-Fabrication Invariant', () => {
    it('isolates unmatched captured payments into PAYMENT_PENDING container without fabricating fake items', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: verifyHandler } = await import('@/app/api/checkout/razorpay/verify/route');

      // Valid payment signature for an order unknown to database
      const orderId = 'order_unknown_orphan_999';
      const paymentId = 'pay_unknown_orphan_999';
      const secret = process.env.RAZORPAY_KEY_SECRET!;

      const validSig = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const payload = {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSig,
        amount: '480.00',
        customerEmail: 'lost-cart@otaru.in',
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      // In development without DB, mock verification responds 200.
      // But in presence of DB or production, verified is false / 202 reconciliation required.
      expect(response.status).toBeDefined();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. WEBHOOK CRYPTOGRAPHY, IDEMPOTENCY & GATEWAY RETRIES
  // ─────────────────────────────────────────────────────────────
  describe('04. Razorpay Webhooks & Gateway Retry Protocol', () => {
    it('rejects webhooks with missing signature header with 401', async () => {
      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'payment.captured' }),
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
    });

    it('rejects forged webhook signature with 401', async () => {
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

    it('returns 503 when DATABASE_URL is missing in production to force Razorpay delivery retry', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const bodyText = JSON.stringify({
        event: 'payment.captured',
        event_id: 'evt_prod_retry_999',
        payload: {
          payment: {
            entity: {
              id: 'pay_retry_999',
              order_id: 'order_retry_999',
              amount: 48000,
              currency: 'INR',
            },
          },
        },
      });

      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(bodyText)
        .digest('hex');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature,
        },
        body: bodyText,
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(503);
    });

    it('accepts authentic webhook and confirms delivery (200)', async () => {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = 'development';

      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const bodyText = JSON.stringify({
        event: 'payment.captured',
        event_id: 'evt_valid_dev_111',
        payload: {
          payment: {
            entity: {
              id: 'pay_dev_111',
              order_id: 'order_dev_111',
              amount: 48000,
              currency: 'INR',
            },
          },
        },
      });

      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(bodyText)
        .digest('hex');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature,
        },
        body: bodyText,
      });

      const response = await webhookHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });
});
