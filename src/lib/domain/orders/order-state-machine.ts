/**
 * OTARU ORDER STATE MACHINE
 * Enforces valid forward-only state transitions.
 * Illegal state transitions are rejected with an explicit error.
 */

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'QUALITY_INSPECTED'
  | 'PACKED'
  | 'HANDED_TO_CARRIER'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

// Allowed forward transitions
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PREPARATION', 'CANCELLED'],
  IN_PREPARATION: ['QUALITY_INSPECTED', 'CANCELLED'],
  QUALITY_INSPECTED: ['PACKED', 'CANCELLED'],
  PACKED: ['HANDED_TO_CARRIER', 'CANCELLED'],
  HANDED_TO_CARRIER: ['IN_TRANSIT'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
};

export class IllegalOrderStateTransitionError extends Error {
  constructor(public fromStatus: OrderStatus, public toStatus: OrderStatus) {
    super(`Illegal order state transition: cannot transition from ${fromStatus} to ${toStatus}.`);
    this.name = 'IllegalOrderStateTransitionError';
  }
}

/**
 * Validates and performs an order state transition.
 * Throws IllegalOrderStateTransitionError if the transition is prohibited.
 */
export function transitionOrderStatus(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus
): OrderStatus {
  if (currentStatus === targetStatus) {
    return currentStatus; // Idempotent same-state transition
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new IllegalOrderStateTransitionError(currentStatus, targetStatus);
  }

  return targetStatus;
}
