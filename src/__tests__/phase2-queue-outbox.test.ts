import { describe, it, expect } from 'vitest';
import { redis } from '@/lib/redis/client';
import { createDomainEvent } from '@/lib/queue/domain-events';
import { classifyError, calculateBackoffMs } from '@/lib/queue/retry';
import { sendToDeadLetterQueue, getDeadLetterItems, clearDeadLetterQueue } from '@/lib/queue/dead-letter';

describe('Phase 2 — Distributed Runtime, Outbox & DLQ Engine', () => {
  describe('1. Redis Ephemeral Client Adapter', () => {
    it('sets and retrieves ephemeral keys with expiration', async () => {
      await redis.set('nonce:test_101', 'consumed', 60);
      const val = await redis.get('nonce:test_101');
      expect(val).toBe('consumed');

      const nxResult = await redis.setNx('nonce:test_101', 'new_val', 60);
      expect(nxResult).toBe(false);
    });
  });

  describe('2. Error Classification & Exponential Backoff', () => {
    it('classifies 4xx errors as PERMANENT and 429 as RATE_LIMIT', () => {
      expect(classifyError(400)).toBe('PERMANENT');
      expect(classifyError(404)).toBe('PERMANENT');
      expect(classifyError(429)).toBe('RATE_LIMIT');
      expect(classifyError(500)).toBe('TEMPORARY');
      expect(classifyError(503)).toBe('TEMPORARY');
    });

    it('calculates exponential backoff delays with jitter', () => {
      const delay1 = calculateBackoffMs(1, { maxAttempts: 5, initialDelayMs: 1000, backoffFactor: 2 });
      const delay2 = calculateBackoffMs(2, { maxAttempts: 5, initialDelayMs: 1000, backoffFactor: 2 });
      expect(delay1).toBeGreaterThanOrEqual(1000);
      expect(delay2).toBeGreaterThanOrEqual(2000);
    });
  });

  describe('3. Dead Letter Queue (DLQ) & Fault Isolation', () => {
    it('captures failed events into DLQ after max retry attempts', () => {
      clearDeadLetterQueue();
      const event = createDomainEvent('PaymentCaptured', { orderId: 'OTARU-REG-888' });
      sendToDeadLetterQueue(event, 'Shiprocket API Gateway Timeout 504', 5);

      const items = getDeadLetterItems();
      expect(items.length).toBe(1);
      expect(items[0]!.event.payload).toEqual({ orderId: 'OTARU-REG-888' });
      expect(items[0]!.error).toContain('Shiprocket API Gateway Timeout');
    });
  });
});
