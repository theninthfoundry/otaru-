/**
 * OTARU ARCHIVAL OWNERSHIP TRANSFER ENGINE
 * Chains ownership events into an immutable cryptographic provenance ledger.
 * The garment carries its lineage across multiple owners over decades.
 */

import crypto from 'crypto';

export type TransferReason =
  | 'INITIAL_ACQUISITION'
  | 'PRIVATE_ARCHIVAL_TRANSFER'
  | 'ESTATE_INHERITANCE'
  | 'ATELIER_BUYBACK';

export interface OwnershipTransferRecord {
  id: string;
  garmentSerial: string;      // "OTR-2026-000184"
  fromUserId?: string;        // Null for initial acquisition from atelier
  toUserId: string;
  toUserAlias: string;        // "Collector #42 (Tokyo)"
  reason: TransferReason;
  timestamp: string;
  previousHash: string;       // Cryptographic link to prior ownership record
  transferHash: string;       // SHA-256 seal of this transfer
}

export class OwnershipTransferEngine {
  /**
   * Computes the cryptographic transfer hash chaining to the previous owner.
   */
  static computeTransferHash(
    garmentSerial: string,
    fromUserId: string | undefined,
    toUserId: string,
    reason: TransferReason,
    timestamp: string,
    previousHash: string
  ): string {
    const payload = [
      garmentSerial,
      fromUserId || 'ATELIER_ORIGIN',
      toUserId,
      reason,
      timestamp,
      previousHash,
    ].join('::');

    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Creates a verified ownership transfer record.
   */
  static createTransfer(
    garmentSerial: string,
    toUserId: string,
    toUserAlias: string,
    reason: TransferReason,
    fromUserId?: string,
    previousHash: string = '0'.repeat(64) // Genesis hash
  ): OwnershipTransferRecord {
    const timestamp = new Date().toISOString();
    const transferHash = this.computeTransferHash(
      garmentSerial,
      fromUserId,
      toUserId,
      reason,
      timestamp,
      previousHash
    );

    return {
      id: `xfer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      garmentSerial,
      fromUserId,
      toUserId,
      toUserAlias,
      reason,
      timestamp,
      previousHash,
      transferHash,
    };
  }

  /**
   * Validates the cryptographic integrity of an entire ownership chain.
   */
  static verifyChainIntegrity(chain: OwnershipTransferRecord[]): boolean {
    if (chain.length === 0) return true;

    for (let i = 0; i < chain.length; i++) {
      const record = chain[i]!;
      const expectedPrevHash = i === 0 ? '0'.repeat(64) : chain[i - 1]!.transferHash;

      if (record.previousHash !== expectedPrevHash) {
        return false; // Broken hash chain link!
      }

      const recalculated = this.computeTransferHash(
        record.garmentSerial,
        record.fromUserId,
        record.toUserId,
        record.reason,
        record.timestamp,
        record.previousHash
      );

      if (recalculated !== record.transferHash) {
        return false; // Tampered record data!
      }
    }

    return true;
  }
}
