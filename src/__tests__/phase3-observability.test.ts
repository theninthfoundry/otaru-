import { describe, it, expect } from 'vitest';
import { createTraceContext, getTraceContext } from '@/lib/observability/tracer';
import { metrics } from '@/lib/observability/metrics';
import { logger } from '@/lib/security/logger';

describe('Phase 3 — Production Observability, Metrics & Tracing Suite', () => {
  describe('1. Correlation ID Propagation & Tracing', () => {
    it('creates and retrieves end-to-end trace context bindings', () => {
      const trace = createTraceContext({
        orderId: 'OTARU-REG-8812',
        eventId: 'evt_10192',
      });

      expect(trace.correlationId).toBeDefined();
      expect(trace.orderId).toBe('OTARU-REG-8812');

      const retrieved = getTraceContext(trace.correlationId);
      expect(retrieved?.eventId).toBe('evt_10192');
    });
  });

  describe('2. Metrics Registry & Quantile Histograms', () => {
    it('records and calculates p50, p95, and p99 latency quantiles', () => {
      for (let i = 1; i <= 100; i++) {
        metrics.recordHistogram('http_checkout_duration', i * 10);
      }

      const quantiles = metrics.getQuantiles('http_checkout_duration');
      expect(quantiles.count).toBe(100);
      expect(quantiles.p50).toBeGreaterThanOrEqual(500);
      expect(quantiles.p95).toBeGreaterThanOrEqual(950);
    });

    it('exports aggregated metrics payload', () => {
      metrics.incrementCounter('checkout_success_total');
      const payload = metrics.exportMetricsPayload();

      expect(payload.timestamp).toBeDefined();
      expect(payload.metrics.checkout_success_total).toBeDefined();
    });
  });

  describe('3. PII & Secret Redaction Logger', () => {
    it('formats audit logs cleanly without throwing errors', () => {
      expect(() => {
        logger.audit('Test payment audit log', {
          orderId: 'ORD-101',
          razorpay_signature: 'super_secret_sig',
          password: 'my_secret_pass',
        });
      }).not.toThrow();
    });
  });
});
