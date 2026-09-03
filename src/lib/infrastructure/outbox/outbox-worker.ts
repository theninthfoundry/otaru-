/**
 * OTARU OUTBOX WORKER & RETRY ENGINE
 * Processes pending domain events and dispatches to downstream consumers (Email, SMS, Carrier).
 * Implements exponential backoff (1m, 5m, 15m, 1h, 6h, 24h) and Dead Letter Queue (DLQ).
 */

export const RETRY_DELAYS_MS = [
  60 * 1000,          // 1 minute
  5 * 60 * 1000,      // 5 minutes
  15 * 60 * 1000,     // 15 minutes
  60 * 60 * 1000,     // 1 hour
  6 * 60 * 60 * 1000, // 6 hours
  24 * 60 * 60 * 1000 // 24 hours
];

export const MAX_RETRY_ATTEMPTS = 5;

export interface OutboxItem {
  id: string;
  eventId: string;
  type: string;
  payload: Record<string, unknown>;
  attempts: number;
}

export type EventHandler = (item: OutboxItem) => Promise<void>;

export class OutboxWorker {
  private handlers: Map<string, EventHandler[]> = new Map();

  registerHandler(eventType: string, handler: EventHandler) {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  /**
   * Processes an outbox item. Returns updated status and next retry delay if failed.
   */
  async processItem(item: OutboxItem): Promise<{
    status: 'DELIVERED' | 'FAILED' | 'DEAD_LETTER';
    error?: string;
    nextRetryDelayMs?: number;
  }> {
    const handlers = this.handlers.get(item.type) || [];
    if (handlers.length === 0) {
      // No handlers registered: mark delivered as no-op
      return { status: 'DELIVERED' };
    }

    try {
      for (const handler of handlers) {
        await handler(item);
      }
      return { status: 'DELIVERED' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const nextAttempt = item.attempts + 1;

      if (nextAttempt >= MAX_RETRY_ATTEMPTS) {
        return {
          status: 'DEAD_LETTER',
          error: `DLQ: Exceeded max retries (${MAX_RETRY_ATTEMPTS}). Last error: ${errorMsg}`,
        };
      }

      const delayIndex = Math.min(nextAttempt - 1, RETRY_DELAYS_MS.length - 1);
      const nextRetryDelayMs = RETRY_DELAYS_MS[delayIndex] ?? 60000;

      return {
        status: 'FAILED',
        error: errorMsg,
        nextRetryDelayMs,
      };
    }
  }
}
