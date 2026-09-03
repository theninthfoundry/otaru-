import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkIdempotency,
  registerIdempotencyKey,
} from '@/lib/payments/idempotency';
import { auditLog, verifyChainIntegrity, getAuditEvents } from '@/lib/payments/audit-trail';
import { addTransaction, getTransactions, clearLedger } from '@/lib/payments/ledger';

describe('Phase 1.5 — Concurrency, Idempotency & Transactional Verification', () => {
  beforeEach(() => {
    clearLedger();
  });

  describe('1. Idempotency Key Lock & Unique Ownership', () => {
    it('returns DUPLICATE for registered idempotency keys within TTL', () => {
      const email = 'collector@otaru.in';
      const rawKey = '123e4567-e89b-12d3-a456-426614174000';
      const payload = { orderId: 'order_MOCK_101', status: 'created' };

      expect(checkIdempotency(rawKey, email)).toEqual({ status: 'NEW' });

      registerIdempotencyKey(rawKey, email, 'OTARU-REG-101', payload);

      const dupCheck = checkIdempotency(rawKey, email);
      expect(dupCheck.status).toBe('DUPLICATE');
      if (dupCheck.status === 'DUPLICATE') {
        expect(dupCheck.cachedResponse).toEqual(payload);
      }
    });

    it('rejects malformed idempotency keys not matching UUID standard', () => {
      expect(checkIdempotency('invalid-key-string', 'user@otaru.in')).toEqual({
        status: 'INVALID_KEY',
      });
    });
  });

  describe('2. Audit Chain Hash Integrity & Serialization', () => {
    it('computes sequential SHA-256 hash chains without breaking prevHash links', () => {
      const email = 'audit-test@otaru.in';

      auditLog({ type: 'ORDER_CREATED', details: 'Test Order 1', email, ref: 'REF-001' });
      auditLog({ type: 'PAYMENT_VERIFIED', details: 'Test Payment Verified 1', email, ref: 'REF-001' });
      auditLog({ type: 'NONCE_CONSUMED', details: 'Test Nonce Consumed 1', email, ref: 'REF-001' });

      const integrity = verifyChainIntegrity();
      expect(integrity.intact).toBe(true);
      expect(integrity.brokenAt).toBeUndefined();

      const events = getAuditEvents(3);
      expect(events.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('3. Financial Ledger State & Minor Unit Integrity', () => {
    it('creates and tracks financial transaction status updates', () => {
      const tx = addTransaction({
        id: 'order_TEST_101',
        orderId: 'OTARU-REG-999999',
        customerId: 'patron@otaru.in',
        customerName: 'A. Roy',
        amount: 299.00,
        currency: 'USD',
        method: 'Razorpay Gateway',
        status: 'CREATED',
        details: 'Order Created',
        security: { rateLimitPass: true, csrfPass: true, signatureVerified: false },
      });

      expect(tx.status).toBe('CREATED');
      const allTx = getTransactions();
      expect(allTx.some((t) => t.id === 'order_TEST_101')).toBe(true);
    });
  });
});
