/**
 * HOUSE OF OTARU — TRANSACTIONAL OUTBOX & EVENT ENGINE
 * System Design Concept: Transactional Outbox Pattern with At-Least-Once Delivery
 * 
 * In distributed luxury commerce, side effects (SMS/Email passports, Shiprocket courier dispatch,
 * and ledger sync) must never fail the patron's synchronous checkout commit.
 * Events are written transactionally to an append-only outbox and pumped asynchronously.
 */

import { DomainEventType, AnyDomainEvent } from './domain-events';

export type OutboxStatus = 'PENDING' | 'PROCESSING' | 'DISPATCHED' | 'FAILED';

export interface OutboxEntry {
  id: string;
  eventType: DomainEventType;
  aggregateId: string;
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: number;
  status: OutboxStatus;
  lastError?: string;
}

export type EventHandler<T extends Record<string, unknown> = Record<string, unknown>> = (
  event: OutboxEntry & { payload: T }
) => Promise<void>;

class OutboxEventEngine {
  private outbox: Map<string, OutboxEntry> = new Map();
  private subscribers: Map<DomainEventType, Set<EventHandler>> = new Map();

  /**
   * Enqueues an event into the transactional outbox.
   */
  async stageEvent(
    eventType: DomainEventType,
    aggregateId: string,
    payload: Record<string, unknown>,
    maxAttempts: number = 5
  ): Promise<OutboxEntry> {
    const id = `outbox_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const entry: OutboxEntry = {
      id,
      eventType,
      aggregateId,
      payload,
      createdAt: new Date().toISOString(),
      attempts: 0,
      maxAttempts,
      nextAttemptAt: Date.now(),
      status: 'PENDING',
    };

    this.outbox.set(id, entry);

    // Fire non-blocking immediate dispatch attempt
    setTimeout(() => {
      this.dispatchSingleEntry(entry).catch((err) => {
        console.error(`[OutboxEngine] Immediate dispatch failed for ${id}:`, err);
      });
    }, 0);

    return entry;
  }

  /**
   * Subscribes a consumer handler to a specific domain event type.
   */
  subscribe<T extends Record<string, unknown>>(
    eventType: DomainEventType,
    handler: EventHandler<T>
  ): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }

    const set = this.subscribers.get(eventType)!;
    set.add(handler as EventHandler);

    return () => {
      set.delete(handler as EventHandler);
    };
  }

  /**
   * Dispatches a single outbox entry with exponential backoff on failure.
   */
  private async dispatchSingleEntry(entry: OutboxEntry): Promise<boolean> {
    const handlers = this.subscribers.get(entry.eventType);
    if (!handlers || handlers.size === 0) {
      entry.status = 'DISPATCHED';
      return true;
    }

    entry.attempts++;
    entry.status = 'PROCESSING';

    try {
      for (const handler of handlers) {
        await handler(entry);
      }

      entry.status = 'DISPATCHED';
      return true;
    } catch (err) {
      entry.lastError = err instanceof Error ? err.message : String(err);

      if (entry.attempts >= entry.maxAttempts) {
        entry.status = 'FAILED';
        console.error(`[OutboxEngine] Event ${entry.id} permanently failed after ${entry.attempts} attempts:`, entry.lastError);
      } else {
        entry.status = 'PENDING';
        // Exponential backoff: 2s, 4s, 8s, 16s...
        const backoffMs = Math.pow(2, entry.attempts) * 1000;
        entry.nextAttemptAt = Date.now() + backoffMs;
      }
      return false;
    }
  }

  /**
   * Sweeps and processes all pending outbox entries whose backoff timer has elapsed.
   */
  async pumpOutboxQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    const now = Date.now();
    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const entry of this.outbox.values()) {
      if (entry.status === 'PENDING' && entry.nextAttemptAt <= now) {
        processed++;
        const ok = await this.dispatchSingleEntry(entry);
        if (ok) succeeded++;
        else failed++;
      }
    }

    return { processed, succeeded, failed };
  }

  /**
   * Returns current health stats of the outbox.
   */
  getOutboxMetrics(): { pending: number; dispatched: number; failed: number; total: number } {
    let pending = 0;
    let dispatched = 0;
    let failed = 0;

    for (const entry of this.outbox.values()) {
      if (entry.status === 'PENDING' || entry.status === 'PROCESSING') pending++;
      else if (entry.status === 'DISPATCHED') dispatched++;
      else if (entry.status === 'FAILED') failed++;
    }

    return {
      pending,
      dispatched,
      failed,
      total: this.outbox.size,
    };
  }
}

export const outboxEventEngine = new OutboxEventEngine();
