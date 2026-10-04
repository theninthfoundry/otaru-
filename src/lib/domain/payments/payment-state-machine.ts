/**
 * OTARU PAYMENT STATE MACHINE
 * Enforces authoritative payment state lifecycle transitions.
 * Illegal reversals (e.g. REFUNDED -> CAPTURED, FAILED -> CAPTURED) are rejected.
 */

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'SETTLED'
  | 'FAILED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED';

const ALLOWED_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  CREATED: ['PENDING', 'FAILED'],
  PENDING: ['AUTHORIZED', 'CAPTURED', 'FAILED'],
  AUTHORIZED: ['CAPTURED', 'FAILED'],
  CAPTURED: ['SETTLED', 'REFUND_REQUESTED'],
  SETTLED: ['REFUND_REQUESTED'],
  REFUND_REQUESTED: ['REFUNDED'],
  FAILED: [],
  REFUNDED: [],
};

export class IllegalPaymentStateTransitionError extends Error {
  constructor(public fromStatus: PaymentStatus, public toStatus: PaymentStatus) {
    super(`Illegal payment state transition: cannot transition from ${fromStatus} to ${toStatus}.`);
    this.name = 'IllegalPaymentStateTransitionError';
  }
}

/**
 * Validates and executes a payment state transition.
 */
export function transitionPaymentStatus(
  currentStatus: PaymentStatus,
  targetStatus: PaymentStatus
): PaymentStatus {
  if (currentStatus === targetStatus) {
    return currentStatus; // Idempotent same-state transition
  }

  const allowed = ALLOWED_PAYMENT_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new IllegalPaymentStateTransitionError(currentStatus, targetStatus);
  }

  return targetStatus;
}
