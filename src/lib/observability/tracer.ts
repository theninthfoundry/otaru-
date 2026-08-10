export interface TraceContext {
  correlationId: string;
  requestId?: string;
  orderId?: string;
  eventId?: string;
  causationId?: string;
}

const traceStore = new Map<string, TraceContext>();

export function createTraceContext(params?: Partial<TraceContext>): TraceContext {
  const correlationId =
    params?.correlationId || `corr_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;

  const ctx: TraceContext = {
    correlationId,
    requestId: params?.requestId || `req_${Math.random().toString(36).substring(2, 8)}`,
    orderId: params?.orderId,
    eventId: params?.eventId,
    causationId: params?.causationId,
  };

  traceStore.set(correlationId, ctx);
  return ctx;
}

export function getTraceContext(correlationId?: string): TraceContext | undefined {
  if (!correlationId) return undefined;
  return traceStore.get(correlationId);
}
