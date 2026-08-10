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
  | 'MembershipCreated';

export type AggregateType = 'Order' | 'Payment' | 'Artifact' | 'Customer' | 'NfcScan';

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  sourceIp?: string;
}

export interface DomainEventEnvelope<T = Record<string, unknown>> {
  eventId: string;
  eventType: DomainEventType;
  version: number;
  occurredAt: string;
  aggregateType: AggregateType;
  aggregateId: string;
  payload: T;
  metadata: EventMetadata;
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
  return {
    eventId: `evt_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
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

// Backward-compatible alias
export type DomainEvent<T = Record<string, unknown>> = DomainEventEnvelope<T>;
