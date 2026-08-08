/**
 * OTARU — One-Time Payment Nonce Registry
 *
 * Prevents replay attacks on the payment verification endpoint.
 *
 * Each payment order is issued a cryptographically random nonce.
 * The verify endpoint MUST present this nonce. Once consumed, the nonce
 * is permanently invalidated — any subsequent attempt with the same nonce
 * returns NONCE_CONSUMED, even if all other credentials are correct.
 *
 * Security properties:
 *  - 128-bit entropy (UUID v4) — astronomically hard to guess
 *  - 15-minute TTL — nonces expire if the user takes too long
 *  - Single-use: consumed nonces are moved to an invalidated set
 *  - Memory-efficient: TTL-based lazy eviction
 *
 * This module is in-process (Map-based). In a multi-instance deployment,
 * replace with a Redis SET with NX+EX flags for distributed nonce enforcement.
 */

import crypto from 'crypto';

const NONCE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface NonceEntry {
  orderId: string;
  createdAt: number;
  consumed: boolean;
}

// Active nonce registry
const nonceStore = new Map<string, NonceEntry>();

// Eviction runs every 5 minutes
let evictionTimer: ReturnType<typeof setInterval> | null = null;

function startEviction() {
  if (evictionTimer) return;
  evictionTimer = setInterval(() => {
    const now = Date.now();
    for (const [nonce, entry] of nonceStore.entries()) {
      if (now - entry.createdAt > NONCE_TTL_MS * 2) {
        nonceStore.delete(nonce);
      }
    }
  }, 5 * 60 * 1000);
  // Don't prevent process exit
  if (evictionTimer.unref) evictionTimer.unref();
}

/**
 * Generate a new cryptographically random nonce for a payment order.
 * Call this inside the order-create route.
 */
export function issueNonce(orderId: string): string {
  startEviction();
  const nonce = crypto.randomUUID(); // 128-bit cryptographically random UUID
  nonceStore.set(nonce, {
    orderId,
    createdAt: Date.now(),
    consumed: false,
  });
  return nonce;
}

export type NonceConsumeResult =
  | { ok: true; orderId: string }
  | { ok: false; reason: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_CONSUMED' | 'ORDER_MISMATCH' };

/**
 * Attempt to consume a nonce for a given order.
 * This is an atomic read-then-invalidate operation.
 * A nonce can ONLY be consumed once.
 */
export function consumeNonce(nonce: string, orderId: string): NonceConsumeResult {
  const entry = nonceStore.get(nonce);

  if (!entry) {
    return { ok: false, reason: 'NOT_FOUND' };
  }

  if (Date.now() - entry.createdAt > NONCE_TTL_MS) {
    nonceStore.delete(nonce);
    return { ok: false, reason: 'EXPIRED' };
  }

  if (entry.consumed) {
    return { ok: false, reason: 'ALREADY_CONSUMED' };
  }

  // Verify the nonce was issued for this specific order (prevents nonce-swapping attacks)
  if (entry.orderId !== orderId) {
    return { ok: false, reason: 'ORDER_MISMATCH' };
  }

  // Mark as consumed — permanent invalidation
  entry.consumed = true;
  nonceStore.set(nonce, entry);

  return { ok: true, orderId: entry.orderId };
}

/**
 * Check if a nonce exists and is valid without consuming it.
 * Used for pre-flight checks.
 */
export function peekNonce(nonce: string): boolean {
  const entry = nonceStore.get(nonce);
  if (!entry || entry.consumed) return false;
  if (Date.now() - entry.createdAt > NONCE_TTL_MS) return false;
  return true;
}

/** Current nonce store size — for monitoring. */
export function getNonceStoreSize(): number {
  return nonceStore.size;
}
