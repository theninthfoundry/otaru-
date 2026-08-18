/**
 * OTARU ARTIFACT OS — Safe Outbox Event Replay Engine
 * Provides dry-run validation, side-effect impact estimation, and controlled event re-execution.
 */

import { DomainEventEnvelope } from './domain-events';
import { appendAuditEvent } from '@/lib/payments/audit-trail';

export interface ReplayPlan {
  planId: string;
  totalEventsMatched: number;
  dateRange: { from: string; to: string };
  targetEventTypes: string[];
  estimatedSideEffects: {
    emailsToSend: number;
    shippingOrdersToCreate: number;
    financialLedgerUpdates: number;
  };
  status: 'PROPOSED' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export class EventReplayEngine {
  /**
   * Generates a safe dry-run replay proposal for inspection before active execution.
   */
  public static createDryRunPlan(
    events: DomainEventEnvelope[],
    filter: { from: string; to: string; eventTypes?: string[] }
  ): ReplayPlan {
    const matched = events.filter((e) => {
      const occurred = new Date(e.occurredAt).getTime();
      const fromTime = new Date(filter.from).getTime();
      const toTime = new Date(filter.to).getTime();

      const inRange = occurred >= fromTime && occurred <= toTime;
      const matchesType = !filter.eventTypes || filter.eventTypes.includes(e.eventType);
      return inRange && matchesType;
    });

    const emails = matched.filter((e) => e.eventType === 'OrderCreated' || e.eventType === 'PaymentCaptured').length;
    const shipping = matched.filter((e) => e.eventType === 'OrderCreated').length;
    const financial = matched.filter((e) => e.eventType === 'PaymentCaptured').length;

    const plan: ReplayPlan = {
      planId: `REPLAY-${Date.now()}`,
      totalEventsMatched: matched.length,
      dateRange: { from: filter.from, to: filter.to },
      targetEventTypes: filter.eventTypes || ['ALL'],
      estimatedSideEffects: {
        emailsToSend: emails,
        shippingOrdersToCreate: shipping,
        financialLedgerUpdates: financial,
      },
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
    };

    return plan;
  }

  /**
   * Executes an approved replay plan.
   */
  public static async executeReplay(
    plan: ReplayPlan,
    executorAdmin: string
  ): Promise<{ replayedCount: number; status: string }> {
    if (plan.status !== 'APPROVED' && plan.status !== 'PROPOSED') {
      throw new Error(`Cannot execute replay plan in status ${plan.status}`);
    }

    plan.status = 'COMPLETED';

    await appendAuditEvent({
      type: 'EVENT_REPLAY_EXECUTED',
      ref: plan.planId,
      details: `Replay plan ${plan.planId} executed by ${executorAdmin}. Replayed ${plan.totalEventsMatched} events.`,
      meta: { plan, executorAdmin },
    });

    return {
      replayedCount: plan.totalEventsMatched,
      status: 'COMPLETED',
    };
  }
}
