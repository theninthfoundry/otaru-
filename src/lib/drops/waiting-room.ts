/**
 * OTARU ARTIFACT OS — Virtual Waiting Room & Drop Admission Controller
 * Rate-controls customer ingress during high-concurrency releases to protect upstream services.
 */

import { randomUUID } from 'crypto';

export interface AdmissionPass {
  passToken: string;
  patronId: string;
  dropId: string;
  queuePosition: number;
  admittedAt: string;
  expiresAt: string;
}

export interface WaitingRoomStatus {
  totalInQueue: number;
  totalAdmitted: number;
  currentRatePerMinute: number;
  estimatedWaitSeconds: number;
}

const queuePool = new Map<string, { patronId: string; dropId: string; enqueuedAt: number }>();
const admittedPasses = new Map<string, AdmissionPass>();

export class VirtualWaitingRoom {
  /**
   * Enqueues a patron into the virtual waiting room for a drop.
   */
  public static enqueue(patronId: string, dropId: string): { position: number; estimatedWaitSeconds: number } {
    const key = `${dropId}:${patronId}`;
    if (!queuePool.has(key)) {
      queuePool.set(key, { patronId, dropId, enqueuedAt: Date.now() });
    }

    const position = Array.from(queuePool.keys()).indexOf(key) + 1;
    const estimatedWaitSeconds = Math.ceil(position / 10) * 15; // 10 patrons every 15 seconds

    return { position, estimatedWaitSeconds };
  }

  /**
   * Admits a batch of patrons from the queue and issues cryptographic checkout passes.
   */
  public static admitBatch(dropId: string, batchSize = 25, passValidSeconds = 300): AdmissionPass[] {
    const now = new Date();
    const admitted: AdmissionPass[] = [];

    const dropQueue = Array.from(queuePool.entries()).filter(([_, item]) => item.dropId === dropId);
    const toAdmit = dropQueue.slice(0, batchSize);

    for (let i = 0; i < toAdmit.length; i++) {
      const [key, item] = toAdmit[i];
      queuePool.delete(key);

      const passToken = `PASS-${randomUUID().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
      const expiresAt = new Date(now.getTime() + passValidSeconds * 1000).toISOString();

      const pass: AdmissionPass = {
        passToken,
        patronId: item.patronId,
        dropId: item.dropId,
        queuePosition: i + 1,
        admittedAt: now.toISOString(),
        expiresAt,
      };

      admittedPasses.set(passToken, pass);
      admitted.push(pass);
    }

    return admitted;
  }

  /**
   * Validates an admission pass presented at the checkout gate.
   */
  public static validatePass(passToken: string, dropId: string): { valid: boolean; pass?: AdmissionPass; error?: string } {
    const pass = admittedPasses.get(passToken);
    if (!pass || pass.dropId !== dropId) {
      return { valid: false, error: 'Invalid or unrecognized waiting room admission pass.' };
    }

    if (new Date() > new Date(pass.expiresAt)) {
      admittedPasses.delete(passToken);
      return { valid: false, error: 'Admission pass has expired. Please re-enter the waiting room.' };
    }

    return { valid: true, pass };
  }

  public static getStatus(dropId: string): WaitingRoomStatus {
    const totalInQueue = Array.from(queuePool.values()).filter((i) => i.dropId === dropId).length;
    const totalAdmitted = Array.from(admittedPasses.values()).filter((p) => p.dropId === dropId).length;

    return {
      totalInQueue,
      totalAdmitted,
      currentRatePerMinute: 60,
      estimatedWaitSeconds: Math.ceil(totalInQueue / 10) * 15,
    };
  }
}
