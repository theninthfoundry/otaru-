/**
 * OTARU TRANSACTIONAL OUTBOX SERVICE
 * Enqueues domain events within database transactions to ensure guaranteed delivery.
 */

import { AnyDomainEvent } from '@/lib/domain/events/domain-events';

export interface OutboxRecord {
  id: string;
  eventId: string;
  type: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'DELIVERED' | 'FAILED' | 'DEAD_LETTER';
  attempts: number;
  lastError?: string;
  createdAt: string;
}

export class OutboxService {
  /**
   * Formats a domain event into an outbox persistence record.
   * Can be passed directly to `prisma.outboxEvent.create({ data: ... })`.
   */
  static formatForPersistence(event: AnyDomainEvent) {
    return {
      eventId: event.id,
      type: event.type,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.payload as unknown as Record<string, unknown>,
      status: 'PENDING' as const,
      attempts: 0,
      createdAt: new Date(event.timestamp),
    };
  }
}
