/**
 * OTARU OBSERVABILITY & DISTRIBUTED TELEMETRY
 * Structured JSON logging and latency percentile tracking.
 */

export interface StructuredTelemetryEvent {
  requestId: string;
  userId?: string;
  route: string;
  event: string;
  durationMs: number;
  statusCode: number;
  error?: string;
  releaseTag: string;
  timestamp: string;
}

export class TelemetryLogger {
  private events: StructuredTelemetryEvent[] = [];

  log(event: Omit<StructuredTelemetryEvent, 'timestamp'>): StructuredTelemetryEvent {
    const stamped: StructuredTelemetryEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    this.events.push(stamped);
    return stamped;
  }

  /**
   * Calculates percentile latency across recorded events.
   */
  getLatencyPercentiles(): { p50: number; p95: number; p99: number } {
    if (this.events.length === 0) {
      return { p50: 0, p95: 0, p99: 0 };
    }

    const durations = this.events.map((e) => e.durationMs).sort((a, b) => a - b);
    const p50 = durations[Math.floor(durations.length * 0.50)] || 0;
    const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
    const p99 = durations[Math.floor(durations.length * 0.99)] || 0;

    return { p50, p95, p99 };
  }

  getErrorCount(): number {
    return this.events.filter((e) => e.statusCode >= 500).length;
  }
}
