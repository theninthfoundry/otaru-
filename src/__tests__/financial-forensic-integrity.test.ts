import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { transitionOrderState, InvalidStateTransitionError } from '@/lib/commerce/state-machine';
import { issueNonceAsync, consumeNonceAsync } from '@/lib/payments/nonce-store';
import { verifyCsrf } from '@/lib/security/csrf';

describe('OTARU RC1 — Forensic Production Verification & Financial Integrity Suite', () => {
  beforeEach(() => {
    process.env.ADMIN_API_SECRET = 'otaru_test_admin_secret_998877';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test_razorpay_secret_112233';
    process.env.PAYMENT_CART_SECRET = 'cart_test_secret_44556677889900';
  });

  // ─────────────────────────────────────────────────────────────
  // 01 — PRICE ATTACK DEFENSE
  // ─────────────────────────────────────────────────────────────
  describe('01. Price Attack & Server Catalog Authority', () => {
    it('enforces server catalog price and ignores client price tampering (₹1 attack)', async () => {
      const { POST: orderHandler } = await import('@/app/api/checkout/razorpay/order/route');

      // Catalog product "041" is priced at 480 USD ($480 = 48,000 cents)
      const catalogPrice = PRODUCT_CATALOG['041']?.price;
      expect(catalogPrice).toBe(480);

      // Malicious client sends $1.00 for a $480 product
      const tamperedPayload = {
        cart: {
          lines: [
            {
              id: '041-M',
              quantity: 1,
              cost: {
                totalAmount: {
                  amount: '1.00', // ATTACK: Attempting to pay $1 instead of $480
                  currencyCode: 'USD',
                },
              },
              merchandise: {
                id: '041-M',
                title: 'Yama Field Jacket',
                product: { id: '041' },
              },
            },
          ],
        },
        customer: {
          email: 'adversary@security-audit.org',
          firstName: 'Security',
          lastName: 'Auditor',
          address: '123 Ginza Archival St',
          city: 'Tokyo',
          zip: '104-0061',
        },
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tamperedPayload),
      });

      const response = await orderHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Server-authoritative subtotal: 48000 cents ($480) + $0 shipping (> $300) = 48000 cents
      // The client-tampered $1 (100 cents) MUST BE completely discarded!
      expect(data.amount).toBe(48000);
      expect(data.amount).not.toBe(100);
    });

    it('rejects invalid or negative order quantities', async () => {
      const { POST: orderHandler } = await import('@/app/api/checkout/razorpay/order/route');

      const negativePayload = {
        cart: {
          lines: [
            {
              id: '041-M',
              quantity: -5, // ATTACK: Negative quantity
              cost: { totalAmount: { amount: '-2400.00', currencyCode: 'USD' } },
            },
          ],
        },
        customer: { email: 'adversary@audit.org', firstName: 'Bad', lastName: 'Actor' },
      };

      const request = new Request('http://localhost:3000/api/checkout/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(negativePayload),
      });

      const response = await orderHandler(request);
      // Zod schema validation must catch quantity < 1
      expect([400, 422]).toContain(response.status);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 02 — PAYMENT/ORDER STATE MACHINE ATOMICITY
  // ─────────────────────────────────────────────────────────────
  describe('02. State Machine Transitions & Convergence', () => {
    it('strictly enforces valid state transitions and rejects illegal rollbacks', () => {
      expect(transitionOrderState('PENDING', 'CONFIRMED')).toBe('CONFIRMED');
      expect(transitionOrderState('CONFIRMED', 'PROCESSING')).toBe('PROCESSING');
      expect(transitionOrderState('PROCESSING', 'SHIPPED')).toBe('SHIPPED');
      expect(transitionOrderState('SHIPPED', 'DELIVERED')).toBe('DELIVERED');

      // Illegal transition: Cannot go from DELIVERED back to PENDING
      expect(() => transitionOrderState('DELIVERED', 'PENDING')).toThrow(
        InvalidStateTransitionError,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 03 — WEBHOOK VERIFICATION & IDEMPOTENCY
  // ─────────────────────────────────────────────────────────────
  describe('03. Webhook Cryptographic Verification & Idempotency', () => {
    const secret = 'whsec_test_razorpay_secret_112233';

    it('rejects webhook with missing signature header with 401', async () => {
      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'payment.captured' }),
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
    });

    it('rejects webhook with forged signature with 401', async () => {
      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const body = JSON.stringify({ event: 'payment.captured', id: 'evt_1' });
      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': '0'.repeat(64), // Forged signature
        },
        body,
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(401);
    });

    it('accepts webhook with valid HMAC signature and processes cleanly', async () => {
      const { POST: webhookHandler } = await import('@/app/api/webhooks/razorpay/route');

      const rawBody = JSON.stringify({
        event: 'payment.captured',
        event_id: 'evt_valid_99182',
        payload: {
          payment: {
            entity: {
              id: 'pay_test_99182',
              order_id: 'order_test_99182',
              amount: 48000,
              currency: 'USD',
              status: 'captured',
            },
          },
        },
      });

      const validSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

      const request = new Request('http://localhost:3000/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': validSignature,
        },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.received).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 04 — CSRF / WEBHOOK INTERACTION
  // ─────────────────────────────────────────────────────────────
  describe('04. CSRF Guard & Webhook Exclusion Boundary', () => {
    it('requires CSRF for browser actions and strictly verifies origin', () => {
      // Browser request from untrusted origin
      const untrustedRequest = {
        method: 'POST',
        headers: new Headers({
          origin: 'https://malicious-attacker.com',
          host: 'otaru.in',
          'sec-fetch-site': 'cross-site',
        }),
      } as unknown as import('next/server').NextRequest;

      expect(verifyCsrf(untrustedRequest)).toBe(false);

      // Browser request from trusted origin
      const trustedRequest = {
        method: 'POST',
        headers: new Headers({
          origin: 'https://otaru.in',
          host: 'otaru.in',
        }),
      } as unknown as import('next/server').NextRequest;

      expect(verifyCsrf(trustedRequest)).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 05 — REFUND ENDPOINT ACCESS CONTROL
  // ─────────────────────────────────────────────────────────────
  describe('05. Refund Endpoint Security & Authorization', () => {
    it('rejects unauthenticated refund requests with 401', async () => {
      const { POST: refundHandler } = await import('@/app/api/checkout/razorpay/refund/route');

      const request = new Request('http://localhost:3000/api/checkout/razorpay/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: 'pay_999', amount: 100 }),
      });

      const response = await refundHandler(request);
      expect(response.status).toBe(401);
    });

    it('rejects refund request with wrong secret with 403', async () => {
      const { POST: refundHandler } = await import('@/app/api/checkout/razorpay/refund/route');

      const request = new Request('http://localhost:3000/api/checkout/razorpay/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer invalid_secret_token',
        },
        body: JSON.stringify({ paymentId: 'pay_999', amount: 100 }),
      });

      const response = await refundHandler(request);
      expect(response.status).toBe(403);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 06 — IDOR ATTACK DEFENSE
  // ─────────────────────────────────────────────────────────────
  describe('06. Account Orders IDOR Prevention', () => {
    it('strictly rejects unauthenticated order requests with 401', async () => {
      const { GET: ordersHandler } = await import('@/app/api/account/orders/route');

      const request = {
        cookies: { get: () => undefined },
        nextUrl: { searchParams: new URLSearchParams('email=victim@target.com') },
      } as unknown as import('next/server').NextRequest;

      const response = await ordersHandler(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.orders).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 07 — LEDGER & AUDIT ACCESS CONTROL
  // ─────────────────────────────────────────────────────────────
  describe('07. Financial Ledger & Audit Telemetry Protection', () => {
    it('locks /api/checkout/razorpay/ledger to unauthenticated callers', async () => {
      const { GET: ledgerHandler } = await import('@/app/api/checkout/razorpay/ledger/route');

      const request = {
        headers: new Headers(),
      } as unknown as import('next/server').NextRequest;

      const response = await ledgerHandler(request);
      expect(response.status).toBe(401);
    });

    it('locks /api/checkout/razorpay/audit to unauthenticated callers', async () => {
      const { GET: auditHandler } = await import('@/app/api/checkout/razorpay/audit/route');

      const request = {
        headers: new Headers(),
      } as unknown as import('next/server').NextRequest;

      const response = await auditHandler(request);
      expect(response.status).toBe(401);
    });

    it('locks /api/metrics behind admin secret', async () => {
      const { GET: metricsHandler } = await import('@/app/api/metrics/route');

      const request = {
        headers: new Headers(),
      } as unknown as import('next/server').NextRequest;

      const response = await metricsHandler(request);
      expect(response.status).toBe(401);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 08 — DISTRIBUTED NONCE REPLAY ATTACK DEFENSE
  // ─────────────────────────────────────────────────────────────
  describe('08. Single-Use Payment Nonce Replay Prevention', () => {
    it('verifies nonces are strictly single-use and defeats replay attacks', async () => {
      const orderId = 'ORD-RC1-VERIFY-001';
      const nonce = await issueNonceAsync(orderId);

      expect(nonce).toBeDefined();

      // First consumption: Must succeed
      const firstTry = await consumeNonceAsync(nonce, orderId);
      expect(firstTry.ok).toBe(true);

      // Replay attempt: Must fail immediately
      const replayTry = await consumeNonceAsync(nonce, orderId);
      expect(replayTry.ok).toBe(false);
      if (!replayTry.ok) {
        expect(replayTry.reason).toBe('NOT_FOUND');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 09 — ZERO HARDCODED SECRETS AUDIT
  // ─────────────────────────────────────────────────────────────
  describe('09. Zero Hardcoded Production Secrets Verification', () => {
    it('confirms no hardcoded session secrets exist in src', () => {
      const searchDir = path.join(process.cwd(), 'src');
      let foundOldSecret = false;

      function scan(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== '__tests__') scan(fullPath);
          } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('otaru_session_secret_key_2026')) {
              foundOldSecret = true;
            }
          }
        }
      }

      scan(searchDir);
      expect(foundOldSecret).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 10 — LIVENESS VS READINESS PROBES
  // ─────────────────────────────────────────────────────────────
  describe('10. Process Liveness & Commerce Readiness Separation', () => {
    it('probes /api/health as an ultra-fast liveness check', async () => {
      const { GET: healthHandler } = await import('@/app/api/health/route');
      const response = await healthHandler();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.uptime).toBeDefined();
    });

    it('probes /api/ready as a comprehensive commerce readiness check', async () => {
      const { GET: readyHandler } = await import('@/app/api/ready/route');
      const response = await readyHandler();
      // In local test mode without live DB, ready route reports status cleanly
      expect([200, 503]).toContain(response.status);
      const data = await response.json();
      expect(data.catalog).toContain('ready');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 11 — REPRODUCIBLE DATABASE MIGRATION INTEGRITY
  // ─────────────────────────────────────────────────────────────
  describe('11. Database Lifecycle & Migration DDL', () => {
    it('verifies baseline migration 0_init/migration.sql exists and creates all core tables', () => {
      const migrationFile = path.join(process.cwd(), 'prisma', 'migrations', '0_init', 'migration.sql');
      expect(fs.existsSync(migrationFile)).toBe(true);

      const sql = fs.readFileSync(migrationFile, 'utf8');
      expect(sql).toContain('CREATE TABLE "users"');
      expect(sql).toContain('CREATE TABLE "orders"');
      expect(sql).toContain('CREATE TABLE "order_items"');
      expect(sql).toContain('CREATE TABLE "payments"');
      expect(sql).toContain('CREATE TABLE "webhook_events"');
      expect(sql).toContain('CREATE TABLE "outbox_events"');
      expect(sql).toContain('CREATE TABLE "audit_events"');
    });
  });
});
