export type DomainEventType =
  | 'ArtifactPurchased'
  | 'OrderCreated'
  | 'PaymentAuthorized'
  | 'PaymentCaptured'
  | 'PaymentFailed'
  | 'ShipmentRequested'
  | 'ShipmentDispatched'
  | 'ShipmentDelivered'
  | 'NfcVerified'
  | 'CustomerSubscribed'
  | 'MembershipCreated'
  | (string & {});

export type AggregateType = 'Order' | 'Payment' | 'Artifact' | 'Customer' | 'NfcScan' | (string & {});

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  sourceIp?: string;
  failureReason?: string | null;
  provider?: string;
  [key: string]: unknown;
}

export interface DomainEventEnvelope<T = Record<string, unknown>> {
  id: string; // Alias for eventId
  eventId: string;
  type: DomainEventType; // Alias for eventType
  eventType: DomainEventType;
  version: number;
  occurredAt: string;
  aggregateType: AggregateType;
  aggregateId: string;
  payload: T;
  metadata: EventMetadata;
}

export function createDomainEvent<T = Record<string, unknown>>(
  type: DomainEventType,
  payload: T,
  aggregateId?: string,
  aggregateType: AggregateType = 'Order'
): DomainEventEnvelope<T> {
  const eventId = `evt_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  return {
    id: eventId,
    eventId,
    type,
    eventType: type,
    version: 1,
    occurredAt: new Date().toISOString(),
    aggregateType,
    aggregateId: aggregateId || eventId,
    payload,
    metadata: {},
  };
}

export function createDomainEventEnvelope<T = Record<string, unknown>>(params: {
  eventType: DomainEventType;
  aggregateType: AggregateType;
  aggregateId: string;
  payload: T;
  correlationId?: string;
  causationId?: string;
  sourceIp?: string;
}): DomainEventEnvelope<T> {
  const eventId = `evt_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  return {
    id: eventId,
    eventId,
    type: params.eventType,
    eventType: params.eventType,
    version: 1,
    occurredAt: new Date().toISOString(),
    aggregateType: params.aggregateType,
    aggregateId: params.aggregateId,
    payload: params.payload,
    metadata: {
      correlationId: params.correlationId,
      causationId: params.causationId,
      sourceIp: params.sourceIp,
    },
  };
}

export type DomainEvent<T = Record<string, unknown>> = DomainEventEnvelope<T>;
