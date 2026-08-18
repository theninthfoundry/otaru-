/**
 * OTARU — Dedicated Transactional Outbox Background Worker
 * Handles outbox polling, event consumer execution, retry scheduling, and dead-letter routing.
 */

import { processPendingOutboxEvents } from './outbox-publisher';
import { deadLetterQueue } from './dead-letter';
import { prisma } from '@/lib/db/prisma';

export interface WorkerRunResult {
  timestamp: string;
  workerId: string;
  processedCount: number;
  deadLetterCount: number;
  durationMs: number;
  status: 'SUCCESS' | 'NOOP' | 'ERROR';
  error?: string;
}

/**
 * Runs a single outbox drainage cycle.
 */
export async function runOutboxWorker(
  batchSize = 25,
  workerId = `cron_${Math.random().toString(36).substring(2, 8)}`
): Promise<WorkerRunResult> {
  const startTime = Date.now();

  try {
    const processedCount = await processPendingOutboxEvents(batchSize, workerId);

    // Check if any permanently failed events need dead-letter recording
    let deadLetterCount = 0;
    if (process.env.DATABASE_URL) {
      const failedEvents = await prisma.outboxEvent.findMany({
        where: { status: 'FAILED' },
        take: 10,
      });

      for (const failed of failedEvents) {
        deadLetterQueue.push({
          eventId: failed.eventId,
          eventType: failed.type as any,
          version: 1,
          occurredAt: failed.createdAt.toISOString(),
          aggregateType: (failed.aggregateType as any) || 'Order',
          aggregateId: failed.aggregateId || failed.eventId,
          payload: failed.payload as any,
          metadata: { failureReason: failed.lastError },
        });
        deadLetterCount++;
      }
    }

    const durationMs = Date.now() - startTime;

    return {
      timestamp: new Date().toISOString(),
      workerId,
      processedCount,
      deadLetterCount,
      durationMs,
      status: processedCount > 0 ? 'SUCCESS' : 'NOOP',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      timestamp: new Date().toISOString(),
      workerId,
      processedCount: 0,
      deadLetterCount: 0,
      durationMs: Date.now() - startTime,
      status: 'ERROR',
      error: errorMsg,
    };
  }
}
