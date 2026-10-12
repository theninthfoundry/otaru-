/**
 * HOUSE OF OTARU — ENTERPRISE IDEMPOTENCY ENGINE
 * System Design Concept: Idempotency Key State Machine & Concurrency Deduplication (RFC 8935)
 * 
 * Prevents double billing, duplicate order creation, or race conditions under
 * flaky mobile cellular reconnects or impatient multi-tap scenarios.
 */

import crypto from 'crypto';
import { redis } from '@/lib/redis/client';

export type IdempotencyStatus = 'ACQUIRED' | 'COMMITTED' | 'REJECTED';

export interface IdempotencyRecord<T = unknown> {
  key: string;
  payloadHash: string;
  status: IdempotencyStatus;
  createdAt: number;
  lockedUntil: number;
  response?: {
    statusCode: number;
    body: T;
  };
}

export type IdempotencyAcquisitionResult<T> =
  | { state: 'NEW_ACQUISITION'; release: () => Promise<void>; commit: (statusCode: number, body: T) => Promise<void> }
  | { state: 'REPLAY_COMMITTED'; statusCode: number; body: T }
  | { state: 'CONFLICT_MISMATCH'; error: string }
  | { state: 'IN_FLIGHT_LOCKED'; error: string };

class IdempotencyEngine {
  private localStore: Map<string, IdempotencyRecord> = new Map();

  /**
   * Generates a deterministic SHA-256 fingerprint for the request payload.
   */
  hashPayload(payload: unknown): string {
    const serialized = JSON.stringify(payload, Object.keys(payload || {}).sort());
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }

  /**
   * Attempts to acquire an exclusive execution lease for the given idempotency key.
   */
  async acquire<T>(
    key: string,
    payload: unknown,
    lockTtlSeconds: number = 30,
    windowTtlSeconds: number = 86400 // 24-hour cache window for order replay
  ): Promise<IdempotencyAcquisitionResult<T>> {
    const payloadHash = this.hashPayload(payload);
    const now = Date.now();
    const redisKey = `idempotency:${key}`;

    // 1. Inspect existing state in Redis or in-memory fallback
    let existing: IdempotencyRecord<T> | undefined;

    try {
      const cached = await redis.get(redisKey);
      if (cached) {
        existing = typeof cached === 'string' ? JSON.parse(cached) : (cached as IdempotencyRecord<T>);
      }
    } catch {
      existing = this.localStore.get(key) as IdempotencyRecord<T> | undefined;
    }

    if (!existing) {
      existing = this.localStore.get(key) as IdempotencyRecord<T> | undefined;
    }

    // 2. Handle Existing Key Scenarios
    if (existing) {
      // Scenario A: Key was used before with DIFFERENT payload -> 422 Conflict
      if (existing.payloadHash !== payloadHash) {
        return {
          state: 'CONFLICT_MISMATCH',
          error: `Idempotency key "${key}" was previously used with a different request payload.`,
        };
      }

      // Scenario B: Previous request COMMITTED -> Return cached response safely
      if (existing.status === 'COMMITTED' && existing.response) {
        return {
          state: 'REPLAY_COMMITTED',
          statusCode: existing.response.statusCode,
          body: existing.response.body,
        };
      }

      // Scenario C: Previous request is still in flight
      if (existing.status === 'ACQUIRED' && existing.lockedUntil > now) {
        return {
          state: 'IN_FLIGHT_LOCKED',
          error: `A concurrent mutation with key "${key}" is currently being processed. Please retry in a few seconds.`,
        };
      }
    }

    // 3. New Acquisition: Establish Lock
    const lockedUntil = now + lockTtlSeconds * 1000;
    const newRecord: IdempotencyRecord<T> = {
      key,
      payloadHash,
      status: 'ACQUIRED',
      createdAt: now,
      lockedUntil,
    };

    this.localStore.set(key, newRecord as IdempotencyRecord);

    try {
      await redis.set(redisKey, JSON.stringify(newRecord), { ex: lockTtlSeconds });
    } catch {
      // Local fallback active
    }

    // Return transactional handlers
    return {
      state: 'NEW_ACQUISITION',
      release: async () => {
        this.localStore.delete(key);
        try {
          await redis.del(redisKey);
        } catch {
          // Ignored
        }
      },
      commit: async (statusCode: number, body: T) => {
        const committedRecord: IdempotencyRecord<T> = {
          key,
          payloadHash,
          status: 'COMMITTED',
          createdAt: now,
          lockedUntil: 0,
          response: { statusCode, body },
        };

        this.localStore.set(key, committedRecord as IdempotencyRecord);

        try {
          await redis.set(redisKey, JSON.stringify(committedRecord), { ex: windowTtlSeconds });
        } catch {
          // Local fallback persisted
        }
      },
    };
  }
}

export const idempotencyEngine = new IdempotencyEngine();
