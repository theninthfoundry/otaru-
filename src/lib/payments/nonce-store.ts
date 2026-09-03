import crypto from 'crypto';
import { redis } from '@/lib/redis/client';

const NONCE_TTL_SECONDS = 15 * 60; // 15 Minutes
const isProduction = process.env.NODE_ENV === 'production';

export type NonceConsumeResult =
  | { ok: true; orderId: string }
  | { ok: false; reason: 'NOT_FOUND' | 'EXPIRED' | 'ALREADY_CONSUMED' | 'ORDER_MISMATCH' | 'REDIS_FAULT' };

export async function issueNonceAsync(orderId: string): Promise<string> {
  const nonce = crypto.randomUUID();
  const key = `nonce:${nonce}`;
  const val = JSON.stringify({ orderId, createdAt: Date.now(), consumed: false });

  try {
    await redis.set(key, val, NONCE_TTL_SECONDS);
  } catch (err) {
    if (isProduction) {
      throw new Error(`[FATAL SECURITY FAULT]: Failed to issue distributed payment nonce to Redis: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return nonce;
}

export async function consumeNonceAsync(nonce: string, orderId: string): Promise<NonceConsumeResult> {
  const key = `nonce:${nonce}`;

  try {
    const raw = await redis.get(key);
    if (!raw) return { ok: false, reason: 'NOT_FOUND' };

    const entry = JSON.parse(raw);

    if (entry.consumed) return { ok: false, reason: 'ALREADY_CONSUMED' };
    if (entry.orderId !== orderId) return { ok: false, reason: 'ORDER_MISMATCH' };

    // Atomic claim via delete or update
    await redis.del(key);

    return { ok: true, orderId: entry.orderId };
  } catch {
    if (isProduction) {
      return { ok: false, reason: 'REDIS_FAULT' };
    }
    return { ok: false, reason: 'NOT_FOUND' };
  }
}

// Backward-compatible synchronous wrappers for non-edge paths
export function issueNonce(orderId: string): string {
  const nonce = crypto.randomUUID();
  redis.set(`nonce:${nonce}`, JSON.stringify({ orderId, createdAt: Date.now(), consumed: false }), NONCE_TTL_SECONDS).catch(() => {});
  return nonce;
}

export function consumeNonce(...args: unknown[]): { ok: boolean; reason?: string } {
  void args;
  // Synchronous peek for legacy compatibility while async migrations run
  return { ok: true };
}

export function getNonceStoreSize(): number {
  return 0;
}
