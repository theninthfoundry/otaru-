/**
 * OTARU DROP ENGINE STATE MACHINE
 * Governs the lifecycle of limited-edition garment drops:
 * DRAFT -> PREVIEW -> SCHEDULED -> WAITING_ROOM -> LIVE -> SOLD_OUT -> CLOSED -> ARCHIVED
 */

export type DropState =
  | 'DRAFT'
  | 'PREVIEW'
  | 'SCHEDULED'
  | 'WAITING_ROOM'
  | 'LIVE'
  | 'SOLD_OUT'
  | 'CLOSED'
  | 'ARCHIVED';

export class IllegalDropStateTransitionError extends Error {
  constructor(public fromState: DropState, public toState: DropState) {
    super(`Illegal drop transition: Cannot transition from '${fromState}' to '${toState}'.`);
    this.name = 'IllegalDropStateTransitionError';
  }
}

export const ALLOWED_DROP_TRANSITIONS: Record<DropState, DropState[]> = {
  DRAFT: ['PREVIEW', 'SCHEDULED'],
  PREVIEW: ['SCHEDULED', 'DRAFT'],
  SCHEDULED: ['WAITING_ROOM', 'LIVE', 'DRAFT'],
  WAITING_ROOM: ['LIVE', 'SCHEDULED'],
  LIVE: ['SOLD_OUT', 'CLOSED'],
  SOLD_OUT: ['CLOSED', 'ARCHIVED'],
  CLOSED: ['ARCHIVED', 'LIVE'], // LIVE allows reopening if reserved items expire/cancel
  ARCHIVED: [], // Terminal state
};

/**
 * Validates and transitions drop state.
 */
export function transitionDropState(currentState: DropState, nextState: DropState): DropState {
  const allowed = ALLOWED_DROP_TRANSITIONS[currentState] || [];
  if (!allowed.includes(nextState)) {
    throw new IllegalDropStateTransitionError(currentState, nextState);
  }
  return nextState;
}

/**
 * Checks whether an order / acquisition can be initiated given the drop state.
 */
export function isDropPurchasable(state: DropState): boolean {
  return state === 'LIVE';
}
