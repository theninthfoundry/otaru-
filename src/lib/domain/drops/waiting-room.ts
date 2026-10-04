/**
 * OTARU EDGE ADMISSION WAITING ROOM
 * Rate-limits and sequences concurrent traffic during high-demand limited drops.
 * Protects PostgreSQL & Redis inventory locks from connection exhaustion.
 */

import crypto from 'crypto';

export interface AdmissionTokenPayload {
  dropId: string;
  userId: string;
  queuePosition: number;
  admittedAt: number;
  expiresAt: number;
}

export interface SignedAdmissionToken extends AdmissionTokenPayload {
  signature: string;
}

export const ADMISSION_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes to complete checkout

export class WaitingRoomManager {
  private queue: string[] = []; // Array of userIds
  private secretKey: string;

  constructor(secretKey: string = 'otaru_drop_waiting_room_secret') {
    this.secretKey = secretKey;
  }

  /**
   * Enqueues a collector into the waiting room.
   * Returns current queue position (1-indexed).
   */
  joinQueue(userId: string): { position: number; estimatedWaitSeconds: number } {
    const existingIndex = this.queue.indexOf(userId);
    if (existingIndex !== -1) {
      return {
        position: existingIndex + 1,
        estimatedWaitSeconds: Math.ceil((existingIndex + 1) * 1.5),
      };
    }

    this.queue.push(userId);
    const position = this.queue.length;
    return {
      position,
      estimatedWaitSeconds: Math.ceil(position * 1.5),
    };
  }

  /**
   * Admits the next N collectors from the queue, generating signed admission tokens.
   */
  admitBatch(dropId: string, batchSize: number): SignedAdmissionToken[] {
    const admittedUserIds = this.queue.splice(0, batchSize);
    const now = Date.now();

    return admittedUserIds.map((userId, idx) => {
      const payload: AdmissionTokenPayload = {
        dropId,
        userId,
        queuePosition: idx + 1,
        admittedAt: now,
        expiresAt: now + ADMISSION_TOKEN_TTL_MS,
      };

      const signature = this.signPayload(payload);
      return { ...payload, signature };
    });
  }

  /**
   * Signs an admission payload with HMAC SHA-256.
   */
  private signPayload(payload: AdmissionTokenPayload): string {
    const raw = `${payload.dropId}:${payload.userId}:${payload.queuePosition}:${payload.admittedAt}:${payload.expiresAt}`;
    return crypto.createHmac('sha256', this.secretKey).update(raw).digest('hex');
  }

  /**
   * Verifies that an admission token is genuine, unexpired, and untampered.
   */
  verifyToken(token: SignedAdmissionToken): boolean {
    if (!token || typeof token.signature !== 'string') {
      return false;
    }

    if (!token.expiresAt || Date.now() > token.expiresAt) {
      return false; // Token expired
    }

    const expectedSignature = this.signPayload(token);
    const sigBuffer = Buffer.from(token.signature, 'utf8');
    const expBuffer = Buffer.from(expectedSignature, 'utf8');

    if (sigBuffer.length !== expBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expBuffer);
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}
