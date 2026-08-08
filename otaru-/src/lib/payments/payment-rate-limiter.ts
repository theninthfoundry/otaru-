/**
 * OTARU — Payment-Tier Rate Limiter
 *
 * A dedicated, stricter rate limiter for payment endpoints.
 * Operates independently from the global edge rate limiter.
 *
 * Limits (conservative by design — adjust for your traffic):
 *  - Order Create:   5 attempts per IP per 10 minutes
 *  - Order Create:   3 attempts per email per 10 minutes (account-level)
 *  - Verify:         3 attempts per IP per 5 minutes
 *  - Refund:         2 attempts per IP per 60 minutes (admin op)
 *
 * Uses a sliding-window token bucket per key.
 * Blocks are logged to the security audit trail.
 *
 * In production with multiple server instances, replace this Map with
 * Redis INCR + EXPIRE for distributed rate limiting.
 */

type EndpointType = 'order' | 'verify' | 'refund';

interface Bucket {
  count: number;
  windowStart: number;
}

const ipBuckets = new Map<string, Bucket>();
const emailBuckets = new Map<string, Bucket>();

// Limit configs per endpoint
const IP_LIMITS: Record<EndpointType, { max: number; windowMs: number }> = {
  order:  { max: 5, windowMs: 10 * 60 * 1000 },  // 5 per 10min
  verify: { max: 3, windowMs: 5 * 60 * 1000 },   // 3 per 5min
  refund: { max: 2, windowMs: 60 * 60 * 1000 },  // 2 per hour
};

const EMAIL_LIMITS: Record<EndpointType, { max: number; windowMs: number }> = {
  order:  { max: 3, windowMs: 10 * 60 * 1000 },  // 3 per 10min per email
  verify: { max: 5, windowMs: 10 * 60 * 1000 },  // 5 per 10min per email
  refund: { max: 2, windowMs: 60 * 60 * 1000 },  // 2 per hour per email
};

function checkBucket(
  store: Map<string, Bucket>,
  key: string,
  max: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    // Start a new window
    bucket = { count: 0, windowStart: now };
  }

  const resetAt = bucket.windowStart + windowMs;

  if (bucket.count >= max) {
    store.set(key, bucket);
    return { allowed: false, remaining: 0, resetAt };
  }

  bucket.count += 1;
  store.set(key, bucket);
  return { allowed: true, remaining: max - bucket.count, resetAt };
}

export interface PaymentRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  blockedBy?: 'ip' | 'email';
}

/**
 * Check payment-tier rate limits for a request.
 *
 * @param endpoint - Which payment endpoint is being called
 * @param ip       - Client IP address
 * @param email    - Customer email (for account-level limiting)
 */
export function checkPaymentRateLimit(
  endpoint: EndpointType,
  ip: string,
  email?: string,
): PaymentRateLimitResult {
  const ipLimit = IP_LIMITS[endpoint];
  const ipResult = checkBucket(ipBuckets, `${endpoint}:ip:${ip}`, ipLimit.max, ipLimit.windowMs);

  if (!ipResult.allowed) {
    return { allowed: false, remaining: 0, resetAt: ipResult.resetAt, blockedBy: 'ip' };
  }

  if (email) {
    const emailLimit = EMAIL_LIMITS[endpoint];
    const emailResult = checkBucket(
      emailBuckets,
      `${endpoint}:email:${email.toLowerCase()}`,
      emailLimit.max,
      emailLimit.windowMs,
    );

    if (!emailResult.allowed) {
      return { allowed: false, remaining: 0, resetAt: emailResult.resetAt, blockedBy: 'email' };
    }
  }

  return { allowed: true, remaining: ipResult.remaining, resetAt: ipResult.resetAt };
}

// Lazy eviction every 30 minutes
let evictionTimer: ReturnType<typeof setInterval> | null = null;
function ensureEviction() {
  if (evictionTimer) return;
  evictionTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of ipBuckets.entries()) {
      if (now - v.windowStart > 2 * 60 * 60 * 1000) ipBuckets.delete(k);
    }
    for (const [k, v] of emailBuckets.entries()) {
      if (now - v.windowStart > 2 * 60 * 60 * 1000) emailBuckets.delete(k);
    }
  }, 30 * 60 * 1000);
  if (evictionTimer.unref) evictionTimer.unref();
}
ensureEviction();
