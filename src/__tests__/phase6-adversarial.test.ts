import { describe, it, expect, vi } from 'vitest';
import { POST as verifyPaymentHandler } from '@/app/api/checkout/razorpay/verify/route';
import { POST as createOrderHandler } from '@/app/api/checkout/razorpay/order/route';
import { scanProductionInvariants } from '@/lib/testing/production-invariant-scanner';
import path from 'path';

describe('Phase 6 — Production Trust Boundary & Adversarial Suite', () => {
  describe('1. Payment Trust Boundary Hardening', () => {
    it('strictly rejects mock payment verification in production mode with 403 Forbidden', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('STRICT_PAYMENT_MODE', 'true');

      const mockReq = new Request('http://localhost/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: 'order_TEST_101',
          razorpay_payment_id: 'pay_TEST_101',
          razorpay_signature: 'mock_signature_approved',
          mock: true,
        }),
      });

      const res = await verifyPaymentHandler(mockReq);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe('PRODUCTION_MOCK_FORBIDDEN');

      vi.unstubAllEnvs();
    });

    it('rejects order creation with HTTP 503 when payment gateway is unconfigured in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('STRICT_PAYMENT_MODE', 'true');
      vi.stubEnv('PAYMENT_CART_SECRET', 'test_secret_at_least_32_characters_long_12345');
      delete process.env.RAZORPAY_KEY_SECRET;
      delete process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const mockReq = new Request('http://localhost/api/checkout/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: {
            lines: [{ id: 'line_1', quantity: 1, cost: { totalAmount: { amount: '420.00', currencyCode: 'USD' } } }],
            cost: { subtotalAmount: { amount: '420.00', currencyCode: 'USD' } },
          },
          customer: { email: 'adversary@test.com', firstName: 'John', lastName: 'Doe' },
        }),
      });

      const res = await createOrderHandler(mockReq);
      expect(res.status).toBe(503);

      vi.unstubAllEnvs();
    });
  });

  describe('2. Production Invariant Static Scanner', () => {
    it('scans src codebase and confirms zero critical production invariant violations', () => {
      const srcPath = path.join(process.cwd(), 'src');
      const violations = scanProductionInvariants(srcPath);

      const criticals = violations.filter((v) => v.severity === 'CRITICAL');
      expect(criticals.length).toBe(0);
    });
  });
});
