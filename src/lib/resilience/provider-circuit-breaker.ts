/**
 * OTARU ARTIFACT OS — Tiered Provider Circuit Breaker & Survival Isolation
 * Isolates third-party service failures and prevents non-critical outages from breaking core commerce.
 */

export type ProviderTier = 'TIER_0_SURVIVAL' | 'TIER_1_COMMERCE' | 'TIER_2_EXPERIENCE' | 'TIER_3_INTELLIGENCE';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface ProviderCircuitConfig {
  providerName: string;
  tier: ProviderTier;
  failureThreshold: number;
  recoveryTimeoutMs: number;
  fallbackStrategy: 'THROW' | 'RETURN_CACHE' | 'QUEUE_OUTBOX' | 'SILENT_NOOP';
}

export class ProviderCircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(public readonly config: ProviderCircuitConfig) {}

  /**
   * Executes a call through the circuit breaker with tier-aware fallbacks.
   */
  public async execute<T>(
    operation: () => Promise<T>,
    fallbackValue?: T
  ): Promise<{ result: T | undefined; circuitState: CircuitState; fromFallback: boolean }> {
    const now = Date.now();

    // Check if open circuit should transition to half-open
    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.config.recoveryTimeoutMs) {
        this.state = 'HALF_OPEN';
      } else {
        // Fast-fail or execute fallback
        return this.handleFallback(fallbackValue);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return { result, circuitState: this.state, fromFallback: false };
    } catch (err: unknown) {
      this.onFailure();
      return this.handleFallback(fallbackValue);
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  private handleFallback<T>(fallbackValue?: T): {
    result: T | undefined;
    circuitState: CircuitState;
    fromFallback: boolean;
  } {
    if (this.config.tier === 'TIER_0_SURVIVAL' && this.config.fallbackStrategy === 'THROW') {
      throw new Error(`Critical Tier 0 Provider [${this.config.providerName}] circuit is OPEN.`);
    }

    return {
      result: fallbackValue,
      circuitState: this.state,
      fromFallback: true,
    };
  }

  public getState(): CircuitState {
    return this.state;
  }
}

// Global Circuit Registry for all external dependencies
export const providerCircuits = {
  shopify: new ProviderCircuitBreaker({
    providerName: 'Shopify',
    tier: 'TIER_1_COMMERCE',
    failureThreshold: 3,
    recoveryTimeoutMs: 15000,
    fallbackStrategy: 'RETURN_CACHE',
  }),
  razorpay: new ProviderCircuitBreaker({
    providerName: 'Razorpay',
    tier: 'TIER_0_SURVIVAL',
    failureThreshold: 5,
    recoveryTimeoutMs: 10000,
    fallbackStrategy: 'THROW',
  }),
  shiprocket: new ProviderCircuitBreaker({
    providerName: 'Shiprocket',
    tier: 'TIER_1_COMMERCE',
    failureThreshold: 4,
    recoveryTimeoutMs: 30000,
    fallbackStrategy: 'QUEUE_OUTBOX',
  }),
  sanity: new ProviderCircuitBreaker({
    providerName: 'Sanity',
    tier: 'TIER_2_EXPERIENCE',
    failureThreshold: 3,
    recoveryTimeoutMs: 20000,
    fallbackStrategy: 'RETURN_CACHE',
  }),
  klaviyo: new ProviderCircuitBreaker({
    providerName: 'Klaviyo',
    tier: 'TIER_3_INTELLIGENCE',
    failureThreshold: 5,
    recoveryTimeoutMs: 60000,
    fallbackStrategy: 'SILENT_NOOP',
  }),
};
