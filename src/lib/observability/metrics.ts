export interface MetricCounter {
  name: string;
  count: number;
  tags?: Record<string, string>;
}

export interface MetricHistogram {
  name: string;
  values: number[];
}

class MetricsRegistry {
  private counters = new Map<string, number>();
  private histograms = new Map<string, number[]>();

  incrementCounter(name: string, value = 1) {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);
  }

  recordHistogram(name: string, durationMs: number) {
    const list = this.histograms.get(name) || [];
    list.push(durationMs);
    if (list.length > 1000) list.shift(); // Keep last 1000 observations
    this.histograms.set(name, list);
  }

  getQuantiles(name: string): { p50: number; p95: number; p99: number; count: number } {
    const values = (this.histograms.get(name) || []).slice().sort((a, b) => a - b);
    if (values.length === 0) return { p50: 0, p95: 0, p99: 0, count: 0 };

    const p50 = values[Math.floor(values.length * 0.5)] ?? 0;
    const p95 = values[Math.floor(values.length * 0.95)] ?? 0;
    const p99 = values[Math.floor(values.length * 0.99)] ?? 0;
    return { p50, p95, p99, count: values.length };
  }

  exportMetricsPayload() {
    const result: Record<string, unknown> = {};

    for (const [k, v] of this.counters.entries()) {
      result[k] = v;
    }

    for (const [k] of this.histograms.entries()) {
      result[`${k}_histogram`] = this.getQuantiles(k);
    }

    return {
      timestamp: new Date().toISOString(),
      metrics: result,
    };
  }
}

export const metrics = new MetricsRegistry();
