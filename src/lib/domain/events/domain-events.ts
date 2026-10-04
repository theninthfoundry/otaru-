/**
 * OTARU CANONICAL DOMAIN EVENTS
 * Every significant business mutation produces an immutable, strongly-typed domain event.
 * Events are written within the same database transaction as the business mutation.
 */

export type DomainEventType =
  | 'OrderCreated'
  | 'PaymentCreated'
  | 'PaymentCaptured'
  | 'PaymentFailed'
  | 'InventoryReserved'
  | 'InventoryReleased'
  | 'OrderPaid'
  | 'QualityInspectionCompleted'
  | 'ShipmentCreated'
  | 'ShipmentDispatched'
  | 'ShipmentDelivered'
  | 'ReturnRequested'
  | 'RefundCreated'
  | 'GarmentIssued'
  | 'OwnershipTransferred';

export interface BaseDomainEvent<TType extends DomainEventType, TPayload> {
  id: string;
  type: TType;
  aggregateType: 'ORDER' | 'PAYMENT' | 'INVENTORY' | 'SHIPMENT' | 'GARMENT' | 'RETURN';
  aggregateId: string;
  payload: TPayload;
  timestamp: string;
  actorId?: string;
}

// Event-specific payloads
export type OrderCreatedEvent = BaseDomainEvent<'OrderCreated', {
  orderNumber: string;
  customerEmail: string;
  totalMinor: number;
  currency: string;
  itemCount: number;
}>;

export type OrderPaidEvent = BaseDomainEvent<'OrderPaid', {
  orderNumber: string;
  customerEmail: string;
  paymentId: string;
  amountMinor: number;
  paidAt: string;
}>;

export type PaymentCapturedEvent = BaseDomainEvent<'PaymentCaptured', {
  paymentId: string;
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  amountMinor: number;
}>;

export type InventoryReservedEvent = BaseDomainEvent<'InventoryReserved', {
  variantId: string;
  quantity: number;
  cartId: string;
  expiresAt: string;
}>;

export type GarmentIssuedEvent = BaseDomainEvent<'GarmentIssued', {
  serialNumber: string; // "OTR-2026-000184"
  productName: string;
  editionPiece: string;
  ownerEmail: string;
  authenticityHash: string;
}>;

export type ShipmentDispatchedEvent = BaseDomainEvent<'ShipmentDispatched', {
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  dispatchedAt: string;
}>;

export type ShipmentDeliveredEvent = BaseDomainEvent<'ShipmentDelivered', {
  orderNumber: string;
  deliveredAt: string;
}>;

export type AnyDomainEvent =
  | OrderCreatedEvent
  | OrderPaidEvent
  | PaymentCapturedEvent
  | InventoryReservedEvent
  | GarmentIssuedEvent
  | ShipmentDispatchedEvent
  | ShipmentDeliveredEvent
  | BaseDomainEvent<DomainEventType, Record<string, unknown>>;
