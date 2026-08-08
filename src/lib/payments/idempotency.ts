import crypto from 'crypto';

const KEY_TTL_MS = 24 * 60 * 60 * 1000;

interface IdempotencyEntry {
  email: string;
  orderId: string;
  responsePayload: Record<string, unknown>;
  createdAt: number;
}

const store = new Map<string, IdempotencyEntry>();

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

function scopedKey(key: string, email: string): string {
  return `${email.toLowerCase().trim()}:${key.toLowerCase().trim()}`;
}

export type IdempotencyCheckResult =
  | { status: 'NEW' }
  | { status: 'DUPLICATE'; cachedResponse: Record<string, unknown> }
  | { status: 'INVALID_KEY' };

export function checkIdempotency(
  rawKey: string | null | undefined,
  email: string,
): IdempotencyCheckResult {
  if (!rawKey) return { status: 'NEW' };

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

export function getIdempotencyStoreSize(): number {
  return store.size;
}

export function generateIdempotencyKey(email: string, cartFingerprint: string): string {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}:${cartFingerprint}:${Date.now()}`)
    .digest('hex')
    .substring(0, 32);
}
