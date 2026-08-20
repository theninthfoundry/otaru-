import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';

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

export type AsyncIdempotencyResult =
  | { isDuplicate: false; isLocked: false; status: 'NEW'; response?: undefined }
  | { isDuplicate: true; isLocked: false; status: 'DUPLICATE'; cachedResponse: Record<string, unknown>; response: { status: number; body: Record<string, unknown> } }
  | { isDuplicate: false; isLocked: true; status: 'LOCKED'; response?: undefined }
  | { isDuplicate: false; isLocked: false; status: 'INVALID_KEY'; response?: undefined };

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

  return {
    status: 'DUPLICATE',
    cachedResponse: entry.responsePayload,
  };
}

export async function checkIdempotencyAsync(
  rawKey: string | null | undefined,
  email: string,
): Promise<AsyncIdempotencyResult> {
  const syncResult = checkIdempotency(rawKey, email);
  if (syncResult.status === 'DUPLICATE') {
    return {
      isDuplicate: true,
      isLocked: false,
      status: 'DUPLICATE',
      cachedResponse: syncResult.cachedResponse,
      response: { status: 200, body: syncResult.cachedResponse },
    };
  }
  if (syncResult.status === 'INVALID_KEY') {
    return { isDuplicate: false, isLocked: false, status: 'INVALID_KEY' };
  }

  if (rawKey && process.env.DATABASE_URL && prisma?.idempotencyRecord) {
    try {
      const key = scopedKey(rawKey, email);
      const dbRecord = await prisma.idempotencyRecord.findUnique({
        where: { key },
      });
      if (dbRecord && dbRecord.responseBody) {
        const cached = dbRecord.responseBody as Record<string, unknown>;
        return {
          isDuplicate: true,
          isLocked: false,
          status: 'DUPLICATE',
          cachedResponse: cached,
          response: { status: dbRecord.responseStatus || 200, body: cached },
        };
      }
    } catch (err: unknown) {
      console.warn('[Idempotency Async Warning]:', err);
    }
  }

  return { isDuplicate: false, isLocked: false, status: 'NEW' };
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

  if (process.env.DATABASE_URL && prisma?.idempotencyRecord) {
    const expiresAt = new Date(Date.now() + KEY_TTL_MS);
    prisma.idempotencyRecord.upsert({
      where: { key },
      create: {
        key,
        email: email.toLowerCase(),
        orderId,
        status: 'COMPLETED',
        responseBody: responsePayload as any,
        responseStatus: 200,
        expiresAt,
      },
      update: {
        responseBody: responsePayload as any,
        status: 'COMPLETED',
      },
    }).catch(err => console.warn('[Prisma Idempotency Dual-Write Warning]:', err.message));
  }
}

export function getIdempotencyStoreSize(): number {
  return store.size;
}

export function generateIdempotencyKey(email: string, cartFingerprint: string): string {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}:${cartFingerprint}:${Date.now()}`)
    .digest('hex');
}
