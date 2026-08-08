type EndpointType = 'order' | 'verify' | 'refund';

interface Bucket {
  count: number;
  windowStart: number;
}

const ipBuckets = new Map<string, Bucket>();
const emailBuckets = new Map<string, Bucket>();

const IP_LIMITS: Record<EndpointType, { max: number; windowMs: number }> = {
  order:  { max: 5, windowMs: 10 * 60 * 1000 },
  verify: { max: 3, windowMs: 5 * 60 * 1000 },
  refund: { max: 2, windowMs: 60 * 60 * 1000 },
};

const EMAIL_LIMITS: Record<EndpointType, { max: number; windowMs: number }> = {
  order:  { max: 3, windowMs: 10 * 60 * 1000 },
  verify: { max: 5, windowMs: 10 * 60 * 1000 },
  refund: { max: 2, windowMs: 60 * 60 * 1000 },
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
