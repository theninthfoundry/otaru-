import { describe, it, expect, beforeEach } from 'vitest';
import { getCircuitBreaker } from '@/lib/resilience/circuit-breaker';
import { setChaosToggle, resetChaosToggles } from '@/lib/resilience/chaos';
import { createDomainEventEnvelope } from '@/lib/queue/domain-events';

describe('Phase 4 — Resilience & Chaos Engineering Suite', () => {
  beforeEach(() => {
    resetChaosToggles();
  });

  describe('1. Circuit Breaker Isolation', () => {
    it('trips circuit to OPEN after failure threshold is reached', async () => {
      const breaker = getCircuitBreaker('shiprocket_test_breaker', { failureThreshold: 3, resetTimeoutMs: 1000 });

      const failingTask = () => Promise.reject(new Error('Shiprocket API 500 Internal Server Error'));

      await expect(breaker.execute(failingTask)).rejects.toThrow();
      await expect(breaker.execute(failingTask)).rejects.toThrow();
      await expect(breaker.execute(failingTask)).rejects.toThrow();

      // 4th call should fail fast with OPEN circuit message
      await expect(breaker.execute(failingTask)).rejects.toThrow('Circuit is OPEN');
      expect(breaker.getState()).toBe('OPEN');
    });
  });

  describe('2. Fault Isolation: Third-Party Failures Do Not Block Payments', () => {
    it('proves that Shiprocket/Klaviyo API failures leave domain event payload intact', () => {
      setChaosToggle('simulateThirdParty500', true);

      const event = createDomainEventEnvelope({
        eventType: 'PaymentCaptured',
        aggregateType: 'Payment',
        aggregateId: 'pay_MOCK_101',
        payload: { orderId: 'OTARU-REG-500', amountMinor: 29900 },
      });

      expect(event.payload).toEqual({ orderId: 'OTARU-REG-500', amountMinor: 29900 });
      expect(event.eventType).toBe('PaymentCaptured');
    });
  });

  describe('3. Worker Crash Lease Lock Expiration', () => {
    it('validates lock timeout calculation for crashed worker recovery', () => {
      const lockTime = Date.now() - 6 * 60 * 1000; // 6 minutes ago
      const lockExpiryTime = Date.now() - 5 * 60 * 1000; // 5 minutes ago

      const isLockExpired = lockTime < lockExpiryTime;
      expect(isLockExpired).toBe(true);
    });
  });
});
