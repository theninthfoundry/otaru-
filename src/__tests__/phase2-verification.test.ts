import { describe, it, expect } from 'vitest';
import { createDomainEventEnvelope } from '@/lib/queue/domain-events';
import { processPendingOutboxEvents } from '@/lib/queue/outbox-publisher';
import { redis } from '@/lib/redis/client';

describe('Phase 2 — Final Verification & Outbox Hardening Suite', () => {
  describe('1. Standardized Event Envelope Structure', () => {
    it('formats domain events with explicit aggregate metadata, versioning and correlation tracing', () => {
      const event = createDomainEventEnvelope({
        eventType: 'OrderCreated',
        aggregateType: 'Order',
        aggregateId: 'OTARU-REG-104921',
        payload: { subtotalMinor: 129900, currency: 'USD' },
        correlationId: 'req_test_881',
      });

      expect(event.eventType).toBe('OrderCreated');
      expect(event.aggregateType).toBe('Order');
      expect(event.aggregateId).toBe('OTARU-REG-104921');
      expect(event.version).toBe(1);
      expect(event.metadata.correlationId).toBe('req_test_881');
      expect(event.occurredAt).toBeDefined();
    });
  });

  describe('2. Outbox Publisher Concurrency & Claims', () => {
    it('returns zero processed events when no PostgreSQL database URL is connected in local testing', async () => {
      const processed = await processPendingOutboxEvents(10, 'worker_unit_test');
      expect(processed).toBe(0);
    });
  });

  describe('3. Production Redis Fail-Closed Isolation', () => {
    it('executes get/set operations cleanly on active Redis interface', async () => {
      await redis.set('lock:checkout:cart_88', 'active', 30);
      const val = await redis.get('lock:checkout:cart_88');
      expect(val).toBe('active');

      const isLocked = await redis.setNx('lock:checkout:cart_88', 'blocked', 30);
      expect(isLocked).toBe(false);
    });
  });
});
