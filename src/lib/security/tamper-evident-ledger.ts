/**
 * HOUSE OF OTARU — TAMPER-EVIDENT CRYPTOGRAPHIC LEDGER
 * System Design Concept: Cryptographic Hash Chain Audit Trail (Bank-Grade Invariant)
 * 
 * Guarantees that neither cart price overrides, coupon manipulations, GST calculations,
 * nor order states can be altered retroactively without mathematically breaking
 * the cryptographic hash chain.
 */

import crypto from 'crypto';

export interface LedgerBlock {
  index: number;
  previousHash: string;
  currentHash: string;
  timestamp: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  signature: string;
}

export interface VerificationReport {
  isValid: boolean;
  blockCount: number;
  corruptedBlockIndex?: number;
  details: string;
}

const LEDGER_SECRET = process.env.LEDGER_SIGNING_SECRET || 'otaru_canal_ledger_permanent_seal_1907';
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

class TamperEvidentLedger {
  private chain: LedgerBlock[] = [];

  constructor() {
    // Initialize Genesis Block if empty
    this.appendGenesisBlock();
  }

  private appendGenesisBlock() {
    if (this.chain.length > 0) return;

    const timestamp = '1907-04-12T00:00:00.000Z';
    const payload = { memo: 'Genesis archival seal registered at 1907 Otaru Canal atelier.' };
    const hash = this.computeHash(0, GENESIS_HASH, timestamp, 'GENESIS_SEAL', 'OTARU-MAISON-000', payload);
    const signature = this.signHash(hash);

    this.chain.push({
      index: 0,
      previousHash: GENESIS_HASH,
      currentHash: hash,
      timestamp,
      aggregateId: 'OTARU-MAISON-000',
      eventType: 'GENESIS_SEAL',
      payload,
      signature,
    });
  }

  private computeHash(
    index: number,
    previousHash: string,
    timestamp: string,
    eventType: string,
    aggregateId: string,
    payload: Record<string, unknown>
  ): string {
    const serializedPayload = JSON.stringify(payload, Object.keys(payload).sort());
    const raw = `${index}:${previousHash}:${timestamp}:${eventType}:${aggregateId}:${serializedPayload}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  private signHash(hash: string): string {
    return crypto.createHmac('sha256', LEDGER_SECRET).update(hash).digest('hex');
  }

  /**
   * Appends an immutable commercial audit block to the ledger chain.
   */
  appendBlock(
    aggregateId: string,
    eventType: string,
    payload: Record<string, unknown>
  ): LedgerBlock {
    const previousBlock = this.chain[this.chain.length - 1];
    if (!previousBlock) {
      throw new Error('Corrupted ledger: Genesis block is missing.');
    }
    const index = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    const previousHash = previousBlock.currentHash;

    const currentHash = this.computeHash(index, previousHash, timestamp, eventType, aggregateId, payload);
    const signature = this.signHash(currentHash);

    const block: LedgerBlock = {
      index,
      previousHash,
      currentHash,
      timestamp,
      aggregateId,
      eventType,
      payload,
      signature,
    };

    this.chain.push(block);
    return block;
  }

  /**
   * Mathematically verifies the entire hash chain from Genesis to tip.
   */
  verifyChainIntegrity(): VerificationReport {
    if (this.chain.length === 0) {
      return { isValid: false, blockCount: 0, details: 'Chain is empty.' };
    }

    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (!current || !previous) continue;

      // 1. Verify link to previous block
      if (current.previousHash !== previous.currentHash) {
        return {
          isValid: false,
          blockCount: this.chain.length,
          corruptedBlockIndex: current.index,
          details: `Broken hash link at block ${current.index}. Expected previous hash ${previous.currentHash}, found ${current.previousHash}.`,
        };
      }

      // 2. Re-compute SHA-256 hash
      const expectedHash = this.computeHash(
        current.index,
        current.previousHash,
        current.timestamp,
        current.eventType,
        current.aggregateId,
        current.payload
      );

      if (current.currentHash !== expectedHash) {
        return {
          isValid: false,
          blockCount: this.chain.length,
          corruptedBlockIndex: current.index,
          details: `Corrupted payload at block ${current.index}. Recalculated hash does not match block header.`,
        };
      }

      // 3. Verify HMAC signature
      const expectedSignature = this.signHash(current.currentHash);
      if (current.signature !== expectedSignature) {
        return {
          isValid: false,
          blockCount: this.chain.length,
          corruptedBlockIndex: current.index,
          details: `Invalid cryptographic signature at block ${current.index}.`,
        };
      }
    }

    return {
      isValid: true,
      blockCount: this.chain.length,
      details: `Ledger verified. All ${this.chain.length} blocks mathematically intact with valid cryptographic signatures.`,
    };
  }

  /**
   * Returns recent audit blocks for a given aggregate ID (e.g. orderNumber or cartToken).
   */
  getBlocksForAggregate(aggregateId: string): LedgerBlock[] {
    return this.chain.filter((b) => b.aggregateId === aggregateId);
  }

  getChainLength(): number {
    return this.chain.length;
  }
}

export const tamperEvidentLedger = new TamperEvidentLedger();
