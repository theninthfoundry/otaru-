import { prisma } from '@/lib/db/prisma';
import { queueClient } from './client';
import { DomainEventEnvelope, DomainEventType, AggregateType } from './domain-events';

export async function processPendingOutboxEvents(
  batchSize = 20,
  workerId = `worker_${Math.random().toString(36).substring(2, 7)}`,
): Promise<number> {
  if (!process.env.DATABASE_URL) return 0;

  try {
    const lockExpiry = new Date(Date.now() - 5 * 60 * 1000); // 5 minute lock TTL timeout

    // Atomic claim logic: find PENDING events or stale PROCESSING events
    const claimableEvents = await prisma.outboxEvent.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          { status: 'PROCESSING', lockedAt: { lt: lockExpiry } },
        ],
      },
      take: batchSize,
      orderBy: { createdAt: 'asc' },
    });

    if (claimableEvents.length === 0) return 0;

    let processedCount = 0;

    for (const record of claimableEvents) {
      // Atomic status claim transition PENDING/STALE -> PROCESSING
      const claimed = await prisma.outboxEvent.updateMany({
        where: {
          id: record.id,
          OR: [
            { status: 'PENDING' },
            { status: 'PROCESSING', lockedAt: { lt: lockExpiry } },
          ],
        },
        data: {
          status: 'PROCESSING',
          lockedAt: new Date(),
          lockedBy: workerId,
          attempts: { increment: 1 },
        },
      });

      // If another concurrent worker claimed it first, skip
      if (claimed.count === 0) continue;

      try {
        const domainEvt: DomainEventEnvelope = {
          eventId: record.eventId,
          eventType: record.type as DomainEventType,
          version: 1,
          occurredAt: record.createdAt.toISOString(),
          aggregateType: (record.aggregateType as AggregateType) ?? 'Order',
          aggregateId: record.aggregateId ?? record.eventId,
          payload: (record.payload as Record<string, unknown>) ?? {},
          metadata: {},
        };

        await queueClient.enqueue(domainEvt);

        await prisma.outboxEvent.update({
          where: { id: record.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            lockedBy: null,
          },
        });

        processedCount++;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        await prisma.outboxEvent.update({
          where: { id: record.id },
          data: {
            status: record.attempts >= 5 ? 'FAILED' : 'PENDING',
            lastError: errorMsg,
            lockedBy: null,
          },
        });
      }
    }

    return processedCount;
  } catch (err: unknown) {
    console.error('[Outbox Publisher Error]:', err);
    return 0;
  }
}
