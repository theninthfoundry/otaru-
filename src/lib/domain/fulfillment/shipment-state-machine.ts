/**
 * OTARU SHIPMENT STATE MACHINE
 * Formal lifecycle of garment transit from the atelier to the collector.
 */

export type ShipmentStatus =
  | 'READY_FOR_FULFILLMENT'
  | 'LABEL_PENDING'
  | 'LABEL_CREATED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RTO'
  | 'LOST'
  | 'DAMAGED'
  | 'CANCELLED';

const ALLOWED_SHIPMENT_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  READY_FOR_FULFILLMENT: ['LABEL_PENDING', 'CANCELLED'],
  LABEL_PENDING: ['LABEL_CREATED', 'FAILED', 'CANCELLED'],
  LABEL_CREATED: ['PICKUP_SCHEDULED', 'CANCELLED'],
  PICKUP_SCHEDULED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'DAMAGED', 'LOST'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'RTO', 'DAMAGED', 'LOST'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED', 'RTO'],
  DELIVERED: [],
  FAILED: ['PICKUP_SCHEDULED', 'RTO', 'CANCELLED'],
  RTO: ['DELIVERED'], // Delivered back to atelier
  LOST: [],
  DAMAGED: [],
  CANCELLED: [],
};

export class IllegalShipmentStateTransitionError extends Error {
  constructor(public fromStatus: ShipmentStatus, public toStatus: ShipmentStatus) {
    super(`Illegal shipment transition: cannot transition from ${fromStatus} to ${toStatus}.`);
    this.name = 'IllegalShipmentStateTransitionError';
  }
}

export function transitionShipmentStatus(
  currentStatus: ShipmentStatus,
  targetStatus: ShipmentStatus
): ShipmentStatus {
  if (currentStatus === targetStatus) return currentStatus;

  const allowed = ALLOWED_SHIPMENT_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new IllegalShipmentStateTransitionError(currentStatus, targetStatus);
  }

  return targetStatus;
}
