import { DomainEvent } from './domain-events';

export interface DeadLetterItem {
  id: string;
  event: DomainEvent;
  error: string;
  failedAt: string;
  attempts: number;
}

const dlqStore: DeadLetterItem[] = [];

export function sendToDeadLetterQueue(event: DomainEvent, error: string, attempts: number): void {
  const dlqItem: DeadLetterItem = {
    id: `dlq_${Math.random().toString(36).substring(2, 9)}`,
    event,
    error,
    failedAt: new Date().toISOString(),
    attempts,
  };
  dlqStore.unshift(dlqItem);
  console.warn(`[DLQ Alert] Event ${event.id} (${event.type}) moved to Dead Letter Queue after ${attempts} attempts: ${error}`);
}

export function getDeadLetterItems(limit = 50): DeadLetterItem[] {
  return dlqStore.slice(0, limit);
}

export function clearDeadLetterQueue(): void {
  dlqStore.length = 0;
}
