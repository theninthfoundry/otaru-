/**
 * HOUSE OF OTARU — MULTI-TIER RESILIENT FALLBACK ENGINE
 * System Design Concept: Bulkhead Isolation & Graceful Degradation Pattern
 * 
 * Protects critical path transactions (cart pricing, shipping estimator, currency conversion)
 * against 3rd-party latency spikes and upstream API degradations.
 */

import { CircuitBreaker, getCircuitBreaker, CircuitState } from './circuit-breaker';

export interface ServiceMetrics {
  serviceName: string;
  circuitState: CircuitState;
  totalCalls: number;
  successfulCalls: number;
  fallbackCalls: number;
  lastFailureTime?: string;
  averageLatencyMs: number;
}

export class ResilientFallbackEngine {
  private callStats: Map<
    string,
    { total: number; success: number; fallbacks: number; totalLatencyMs: number; lastFailure?: string }
  > = new Map();

  /**
   * Executes a primary asynchronous task through a named Circuit Breaker.
   * If the circuit is OPEN or the call throws, automatically invokes the fallback provider.
   */
  async executeWithFallback<T>(
    serviceName: string,
    primaryTask: () => Promise<T>,
    fallbackProvider: (error: Error) => Promise<T> | T,
    options?: { failureThreshold?: number; resetTimeoutMs?: number; timeoutMs?: number }
  ): Promise<{ data: T; isFallback: boolean; latencyMs: number }> {
    const breaker = getCircuitBreaker(serviceName, {
      failureThreshold: options?.failureThreshold ?? 4,
      resetTimeoutMs: options?.resetTimeoutMs ?? 20000,
    });

    const stats = this.getOrCreateStats(serviceName);
    const start = Date.now();
    stats.total++;

    try {
      // Enforce timeout race if specified
      let taskPromise = primaryTask();
      if (options?.timeoutMs) {
        taskPromise = Promise.race([
          taskPromise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout of ${options.timeoutMs}ms exceeded for ${serviceName}`)), options.timeoutMs)
          ),
        ]);
      }

      const data = await breaker.execute(() => taskPromise);
      const latencyMs = Date.now() - start;
      stats.success++;
      stats.totalLatencyMs += latencyMs;

      return { data, isFallback: false, latencyMs };
    } catch (err) {
      const latencyMs = Date.now() - start;
      stats.fallbacks++;
      stats.lastFailure = new Date().toISOString();
      stats.totalLatencyMs += latencyMs;

      const error = err instanceof Error ? err : new Error(String(err));
      console.warn(`[ResilientFallbackEngine '${serviceName}'] Engaging graceful fallback:`, error.message);

      const fallbackData = await fallbackProvider(error);
      return { data: fallbackData, isFallback: true, latencyMs };
    }
  }

  private getOrCreateStats(serviceName: string) {
    if (!this.callStats.has(serviceName)) {
      this.callStats.set(serviceName, {
        total: 0,
        success: 0,
        fallbacks: 0,
        totalLatencyMs: 0,
      });
    }
    return this.callStats.get(serviceName)!;
  }

  /**
   * Returns observability metrics across all monitored dependencies.
   */
  getDiagnostics(): ServiceMetrics[] {
    const diagnostics: ServiceMetrics[] = [];

    for (const [name, stats] of this.callStats.entries()) {
      const breaker = getCircuitBreaker(name);
      diagnostics.push({
        serviceName: name,
        circuitState: breaker.getState(),
        totalCalls: stats.total,
        successfulCalls: stats.success,
        fallbackCalls: stats.fallbacks,
        lastFailureTime: stats.lastFailure,
        averageLatencyMs: stats.total > 0 ? Math.round(stats.totalLatencyMs / stats.total) : 0,
      });
    }

    return diagnostics;
  }
}

export const resilientFallbackEngine = new ResilientFallbackEngine();
