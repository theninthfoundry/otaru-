import crypto from 'crypto';

const NONCE_TTL_MS = 15 * 60 * 1000;

interface NonceEntry {
  orderId: string;
  createdAt: number;
  consumed: boolean;
}

const nonceStore = new Map<string, NonceEntry>();

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
  if (evictionTimer.unref) evictionTimer.unref();
}

export function issueNonce(orderId: string): string {
  startEviction();
  const nonce = crypto.randomUUID();
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

  if (entry.orderId !== orderId) {
    return { ok: false, reason: 'ORDER_MISMATCH' };
  }

  entry.consumed = true;
  nonceStore.set(nonce, entry);

  return { ok: true, orderId: entry.orderId };
}

export function peekNonce(nonce: string): boolean {
  const entry = nonceStore.get(nonce);
  if (!entry || entry.consumed) return false;
  if (Date.now() - entry.createdAt > NONCE_TTL_MS) return false;
  return true;
}

export function getNonceStoreSize(): number {
  return nonceStore.size;
}
