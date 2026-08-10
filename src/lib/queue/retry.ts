export type ErrorCategory = 'PERMANENT' | 'TEMPORARY' | 'RATE_LIMIT';

export interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  backoffFactor: number;
}

export function classifyError(statusCode?: number, errorMessage?: string): ErrorCategory {
  if (!statusCode && !errorMessage) return 'TEMPORARY';

  if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
    return 'PERMANENT';
  }

  if (statusCode === 429) {
    return 'RATE_LIMIT';
  }

  return 'TEMPORARY';
}

export function calculateBackoffMs(attempt: number, policy: RetryPolicy): number {
  const baseDelay = policy.initialDelayMs * Math.pow(policy.backoffFactor, attempt - 1);
  const jitter = Math.random() * 0.2 * baseDelay; // 20% random jitter
  return Math.round(baseDelay + jitter);
}
