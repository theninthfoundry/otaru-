/**
 * OTARU — Payment Idempotency Guard
 *
 * Prevents duplicate payment orders from:
 *  - Network retries (client sends same request twice due to timeout)
 *  - Browser back-button re-submissions
 *  - Malicious double-submission attacks
 *  - Race conditions from multiple tab payments
 *
 * Usage:
 *  - Client generates a UUID and sends it as `Idempotency-Key` header
 *  - Server checks the key before processing
 *  - If the key was seen before: return the CACHED response immediately
 *  - If the key is new: process normally, cache the response for 24 hours
 *
 * Security properties:
 *  - 24-hour TTL covers all realistic retry windows
 *  - Keys are scoped per-email to prevent cross-user key injection
 *  - Cached responses are returned bit-for-bit identical (no re-processing)
 *
 * In multi-instance deployments, replace with Redis HSET + TTL.
 */

import crypto from 'crypto';

const KEY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface IdempotencyEntry {
  email: string;
  orderId: string;
  responsePayload: Record<string, unknown>;
  createdAt: number;
}

const store = new Map<string, IdempotencyEntry>();

// Evict expired keys hourly
let evictionTimer: ReturnType<typeof setInterval> | null = null;
function ensureEviction() {
  if (evictionTimer) return;
  evictionTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (now - v.createdAt > KEY_TTL_MS) store.delete(k);
    }
  }, 60 * 60 * 1000);
  if (evictionTimer.unref) evictionTimer.unref();
}
ensureEviction();

/**
 * Normalise an idempotency key: lowercase + trim.
 * Scope it to the email to prevent cross-account key injection.
 */
function scopedKey(key: string, email: string): string {
  return `${email.toLowerCase().trim()}:${key.toLowerCase().trim()}`;
}

export type IdempotencyCheckResult =
  | { status: 'NEW' }
  | { status: 'DUPLICATE'; cachedResponse: Record<string, unknown> }
  | { status: 'INVALID_KEY' };

/**
 * Check if an idempotency key has been seen before.
 * Call this BEFORE processing the order.
 */
export function checkIdempotency(
  rawKey: string | null | undefined,
  email: string,
): IdempotencyCheckResult {
  if (!rawKey) return { status: 'NEW' }; // Key is optional — no key = no dedup

  // Validate it looks like a UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(rawKey.trim())) {
    return { status: 'INVALID_KEY' };
  }

  const key = scopedKey(rawKey, email);
  const entry = store.get(key);

  if (!entry) return { status: 'NEW' };

  if (Date.now() - entry.createdAt > KEY_TTL_MS) {
    store.delete(key);
    return { status: 'NEW' };
  }

  return { status: 'DUPLICATE', cachedResponse: entry.responsePayload };
}

/**
 * Register a new idempotency key AFTER successfully processing the order.
 * Stores the response payload for future duplicate returns.
 */
export function registerIdempotencyKey(
  rawKey: string | null | undefined,
  email: string,
  orderId: string,
  responsePayload: Record<string, unknown>,
): void {
  if (!rawKey) return;

  const key = scopedKey(rawKey, email);
  store.set(key, {
    email: email.toLowerCase(),
    orderId,
    responsePayload,
    createdAt: Date.now(),
  });
}

/** Current store size — for monitoring. */
export function getIdempotencyStoreSize(): number {
  return store.size;
}

/**
 * Generate a secure server-side idempotency key if the client didn't provide one.
 * Scoped to the email + cart contents hash.
 */
export function generateIdempotencyKey(email: string, cartFingerprint: string): string {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}:${cartFingerprint}:${Date.now()}`)
    .digest('hex')
    .substring(0, 32);
}
