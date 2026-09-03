import { describe, it, expect } from 'vitest';
import { getSecurityHeadersMap } from '@/lib/domain/security/security-headers';
import { ErrorShield } from '@/lib/domain/security/error-shield';
import { TelemetryLogger } from '@/lib/domain/observability/telemetry';
import { PrivacyRetentionEngine, CollectorProfile } from '@/lib/domain/privacy/retention-policy';

describe('GATE H — SECURITY PERIMETER, OBSERVABILITY, PRIVACY & DR', () => {

  // -------------------------------------------------------------------------
  // 1. Security Perimeter Headers
  // -------------------------------------------------------------------------
  describe('H1: Security Perimeter & Defensive HTTP Headers', () => {
    it('provides mandatory HSTS, frame protection, nosniff, and strict CSP', () => {
      const headers = getSecurityHeadersMap();

      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Strict-Transport-Security']).toContain('max-age=');
      expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
      expect(headers['Content-Security-Policy']).toContain('https://checkout.razorpay.com');
    });
  });

  // -------------------------------------------------------------------------
  // 2. Calm Error Shielding
  // -------------------------------------------------------------------------
  describe('H2: Calm Error Shield & Stack Sanitization', () => {
    it('shields raw database exceptions from the user while logging internal trace', () => {
      const rawDbError = new Error('PrismaClientKnownRequestError: Unique constraint failed on postgres://admin:secret@db:5432');
      const route = '/api/checkout/reserve';
      const requestId = 'req_prod_test_99';

      const userFacing = ErrorShield.shield(rawDbError, route, requestId);

      // Client response must be calm and never contain postgres credentials or SQL errors
      expect(userFacing.message).toBe('Something interrupted the archive.');
      expect(userFacing.referenceCode).toMatch(/^OTR-ERR-[A-Z0-9]{4}$/);
      expect(userFacing.message).not.toContain('postgres://');
      expect(userFacing.message).not.toContain('PrismaClient');

      // Internal telemetry contains raw trace for debugging
      const internalLog = ErrorShield.getInternalLog(userFacing.referenceCode);
      expect(internalLog).toBeDefined();
      expect(internalLog?.rawMessage).toContain('PrismaClientKnownRequestError');
      expect(internalLog?.requestId).toBe(requestId);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Structured Telemetry & Latency Percentiles
  // -------------------------------------------------------------------------
  describe('H3: Structured Telemetry & Observability', () => {
    it('records telemetry and calculates latency percentiles accurately', () => {
      const logger = new TelemetryLogger();

      // Simulate 10 request durations (10ms to 100ms)
      for (let i = 1; i <= 10; i++) {
        logger.log({
          requestId: `req_${i}`,
          route: '/api/archive',
          event: 'ARCHIVE_QUERY',
          durationMs: i * 10,
          statusCode: 200,
          releaseTag: 'v1.0-release',
        });
      }

      const percentiles = logger.getLatencyPercentiles();
      expect(percentiles.p50).toBe(60);
      expect(percentiles.p95).toBe(100);
      expect(logger.getErrorCount()).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // 4. Privacy Anonymization vs Financial Retention
  // -------------------------------------------------------------------------
  describe('H4: Privacy Anonymization & Legal Accounting Retention', () => {
    it('anonymizes personal PII while preserving legal tax and order records', () => {
      const profile: CollectorProfile = {
        id: 'usr_collector_mumbai_01',
        name: 'Sreeshanth Sharma',
        email: 'sreeshanth@collector.in',
        phoneNumber: '+91 98765 43210',
        shippingAddress: '42 Marine Drive, Mumbai, MH',
        orders: [
          {
            orderId: 'OTR-2026-000184',
            amountPaise: 4032000,
            gstPaise: 483840,
            timestamp: '2026-09-04T00:00:00.000Z',
          },
        ],
      };

      const anonymized = PrivacyRetentionEngine.anonymizeCustomerData(profile);

      // PII scrubbed
      expect(anonymized.name).toBe('[ANONYMIZED_COLLECTOR]');
      expect(anonymized.email).toContain('@archive.internal');
      expect(anonymized.phoneNumber).toBeNull();
      expect(anonymized.shippingAddress).toBeNull();

      // Statutory financial ledger preserved
      expect(anonymized.orders.length).toBe(1);
      expect(anonymized.orders[0]!.orderId).toBe('OTR-2026-000184');
      expect(anonymized.orders[0]!.amountPaise).toBe(4032000);
      expect(anonymized.orders[0]!.gstPaise).toBe(483840);
    });
  });
});
