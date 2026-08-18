/**
 * OTARU ARTIFACT OS — Correlation ID & Distributed Tracing Context Engine
 * Propagates correlationId, requestId, and traceId across HTTP, Background Workers, and Audit Logs.
 */

import { randomUUID } from 'crypto';

export interface TraceContext {
  correlationId: string;
  requestId: string;
  traceId: string;
  actorId?: string;
  clientIp?: string;
  timestamp: string;
}

export class TraceContextManager {
  /**
   * Generates or extracts a distributed trace context from inbound HTTP request headers.
   */
  public static fromHeaders(headers: Headers): TraceContext {
    const correlationId =
      headers.get('x-correlation-id') ||
      headers.get('x-request-id') ||
      `otaru_corr_${randomUUID().substring(0, 12)}`;

    const requestId = headers.get('x-request-id') || `req_${randomUUID().substring(0, 8)}`;
    const traceId = headers.get('x-trace-id') || `trace_${randomUUID().replace(/-/g, '')}`;
    const actorId = headers.get('x-actor-id') || undefined;

    return {
      correlationId,
      requestId,
      traceId,
      actorId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a fresh trace context for background jobs or internal workflows.
   */
  public static create(prefix = 'op'): TraceContext {
    return {
      correlationId: `${prefix}_${randomUUID().substring(0, 12)}`,
      requestId: `req_${randomUUID().substring(0, 8)}`,
      traceId: `trace_${randomUUID().replace(/-/g, '')}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Serializes a trace context into outbound HTTP headers.
   */
  public static toHeaders(context: TraceContext): Record<string, string> {
    return {
      'x-correlation-id': context.correlationId,
      'x-request-id': context.requestId,
      'x-trace-id': context.traceId,
      ...(context.actorId ? { 'x-actor-id': context.actorId } : {}),
    };
  }
}
