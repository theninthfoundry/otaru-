export type OrderState =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURN_REQUESTED';

export type PaymentState =
  | 'CREATED'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type InventoryState = 'AVAILABLE' | 'RESERVED' | 'SOLD';

const VALID_ORDER_TRANSITIONS: Record<OrderState, OrderState[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'CANCELLED', 'RETURN_REQUESTED'],
  SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
  DELIVERED: ['RETURN_REQUESTED'],
  CANCELLED: [],
  REFUNDED: [],
  RETURN_REQUESTED: ['REFUNDED'],
};

const VALID_PAYMENT_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
  CREATED: ['AUTHORIZED', 'CAPTURED', 'FAILED'],
  AUTHORIZED: ['CAPTURED', 'FAILED', 'REFUNDED'],
  CAPTURED: ['REFUNDED', 'PARTIALLY_REFUNDED'],
  FAILED: [],
  REFUNDED: [],
  PARTIALLY_REFUNDED: ['REFUNDED'],
};

const VALID_INVENTORY_TRANSITIONS: Record<InventoryState, InventoryState[]> = {
  AVAILABLE: ['RESERVED', 'SOLD'],
  RESERVED: ['SOLD', 'AVAILABLE'], // AVAILABLE on timeout/failure release
  SOLD: ['AVAILABLE'], // AVAILABLE on return
};

export class InvalidStateTransitionError extends Error {
  constructor(domain: string, from: string, to: string) {
    super(`[State Machine Error]: Invalid ${domain} transition from '${from}' to '${to}'.`);
    this.name = 'InvalidStateTransitionError';
  }
}

export function transitionOrderState(current: OrderState, target: OrderState): OrderState {
  const allowed = VALID_ORDER_TRANSITIONS[current] || [];
  if (!allowed.includes(target)) {
    throw new InvalidStateTransitionError('Order', current, target);
  }
  return target;
}

export function transitionPaymentState(current: PaymentState, target: PaymentState): PaymentState {
  const allowed = VALID_PAYMENT_TRANSITIONS[current] || [];
  if (!allowed.includes(target)) {
    throw new InvalidStateTransitionError('Payment', current, target);
  }
  return target;
}

export function transitionInventoryState(current: InventoryState, target: InventoryState): InventoryState {
  const allowed = VALID_INVENTORY_TRANSITIONS[current] || [];
  if (!allowed.includes(target)) {
    throw new InvalidStateTransitionError('Inventory', current, target);
  }
  return target;
}
