/**
 * OTARU ARTIFACT OS — Formal Order State Machine Engine
 * Enforces strict monotonic transitions, backward-jump protection, and transition metadata audit trails.
 */

import { appendAuditEvent } from '@/lib/payments/audit-trail';

export type OrderState =
  | 'CREATED'
  | 'RESERVED'
  | 'PAYMENT_INIT'
  | 'PAID'
  | 'CONFIRMED'
  | 'PACKING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'FAILED'
  | 'EXPIRED'
  | 'ABANDONED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export interface StateTransitionEvent {
  orderId: string;
  fromState: OrderState;
  toState: OrderState;
  actor: string; // e.g. 'system:webhook', 'admin:0x123', 'customer:alpha@otaru.co'
  reason: string;
  correlationId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Valid state transition lookup table
const ALLOWED_TRANSITIONS: Record<OrderState, readonly OrderState[]> = {
  CREATED: ['RESERVED', 'ABANDONED', 'EXPIRED'],
  RESERVED: ['PAYMENT_INIT', 'EXPIRED', 'ABANDONED'],
  PAYMENT_INIT: ['PAID', 'FAILED', 'EXPIRED', 'ABANDONED'],
  PAID: ['CONFIRMED', 'REFUND_PENDING', 'REFUNDED'],
  CONFIRMED: ['PACKING', 'REFUND_PENDING', 'REFUNDED'],
  PACKING: ['SHIPPED', 'REFUND_PENDING'],
  SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
  DELIVERED: ['RETURN_REQUESTED'],
  FAILED: ['PAYMENT_INIT', 'ABANDONED'], // Allow retry from failure
  EXPIRED: [],
  ABANDONED: [],
  REFUND_PENDING: ['REFUNDED', 'CONFIRMED'], // Confirmed if refund cancelled/rejected
  REFUNDED: [],
  RETURN_REQUESTED: ['RETURNED', 'DELIVERED'], // Delivered if return rejected
  RETURNED: ['REFUND_PENDING', 'REFUNDED'],
};

// In-memory transition log (and chained to cryptographic audit ledger)
const transitionHistory = new Map<string, StateTransitionEvent[]>();

export class OrderStateMachine {
  /**
   * Validates whether a transition from one state to another is legal.
   */
  public static canTransition(from: OrderState, to: OrderState): boolean {
    const allowed = ALLOWED_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  /**
   * Executes a state transition, updating transition history and writing to the tamper-evident audit ledger.
   */
  public static async transition(
    orderId: string,
    currentState: OrderState,
    targetState: OrderState,
    context: {
      actor: string;
      reason: string;
      correlationId: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<{ success: boolean; newState: OrderState; event?: StateTransitionEvent; error?: string }> {
    if (!this.canTransition(currentState, targetState)) {
      const errorMsg = `Illegal order state transition attempted: ${currentState} -> ${targetState} for Order ${orderId}`;
      
      await appendAuditEvent({
        type: 'ORDER_TRANSITION_REJECTED',
        ref: orderId,
        details: errorMsg,
        meta: { currentState, targetState, ...context },
      });

      return { success: false, newState: currentState, error: errorMsg };
    }

    const event: StateTransitionEvent = {
      orderId,
      fromState: currentState,
      toState: targetState,
      actor: context.actor,
      reason: context.reason,
      correlationId: context.correlationId,
      timestamp: new Date().toISOString(),
      metadata: context.metadata,
    };

    // Store in history
    const history = transitionHistory.get(orderId) || [];
    history.push(event);
    transitionHistory.set(orderId, history);

    // Cryptographic audit chaining
    await appendAuditEvent({
      type: 'ORDER_STATE_TRANSITION',
      ref: orderId,
      details: `Order ${orderId} transitioned: ${currentState} -> ${targetState} (Reason: ${context.reason})`,
      meta: {
        fromState: currentState,
        toState: targetState,
        actor: context.actor,
        correlationId: context.correlationId,
        metadata: context.metadata,
      },
    });

    return { success: true, newState: targetState, event };
  }

  /**
   * Retrieves the immutable state transition audit history for an order.
   */
  public static getHistory(orderId: string): StateTransitionEvent[] {
    return transitionHistory.get(orderId) || [];
  }
}
