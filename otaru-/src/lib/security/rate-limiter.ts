/**
 * Otaru Security Layer — Edge-compatible Rate Limiter
 * Uses a token-bucket algorithm with memory-efficient lazy cleanup.
 */

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const cache = new Map<string, RateLimitBucket>();

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks if a given IP address has exceeded the rate limit.
 * 
 * @param ip IP address of the requester
 * @param limit Max number of requests allowed in the window
 * @param windowMs Window duration in milliseconds (default: 1 minute)
 */
export function rateLimit(
  ip: string,
  limit = 60,
  windowMs = 60000
): RateLimitResponse {
  const now = Date.now();
  let bucket = cache.get(ip);

  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
  } else {
    // Refill tokens based on time elapsed
    const elapsed = now - bucket.lastRefill;
    const refillRate = limit / windowMs;
    bucket.tokens = Math.min(limit, bucket.tokens + elapsed * refillRate);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    if (bucket.tokens >= limit) {
      cache.delete(ip); // Save memory if fully refilled
    } else {
      cache.set(ip, bucket);
    }
    return {
      success: true,
      limit,
      remaining: Math.floor(bucket.tokens),
      reset: Math.ceil(now + (limit - bucket.tokens) * (windowMs / limit)),
    };
  }

  cache.set(ip, bucket);
  return {
    success: false,
    limit,
    remaining: 0,
    reset: Math.ceil(now + (limit - bucket.tokens) * (windowMs / limit)),
  };
}
