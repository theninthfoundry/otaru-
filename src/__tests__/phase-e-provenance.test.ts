import { describe, it, expect } from 'vitest';
import {
  generateAtelierKeyPair,
  signProvenanceDeed,
  verifyDeedSignature,
  UnsignedProvenancePayload,
} from '@/lib/domain/provenance/provenance-signer';
import { OwnershipTransferEngine, OwnershipTransferRecord } from '@/lib/domain/provenance/ownership-transfer';
import { RepairRegistry } from '@/lib/domain/provenance/repair-registry';

describe('PHASE E — PROVENANCE, DEED SIGNING & DIGITAL GARMENT ARCHITECTURE', () => {

  // -------------------------------------------------------------------------
  // 1. Asymmetric Ed25519 Cryptographic Provenance Signer
  // -------------------------------------------------------------------------
  describe('E1: Ed25519 Provenance Deed Signer', () => {
    it('signs and cryptographically verifies an archival provenance deed', () => {
      const keys = generateAtelierKeyPair();

      const payload: UnsignedProvenancePayload = {
        serialNumber: 'OTR-2026-000184',
        objectNumber: '041',
        editionPiece: 'Piece 14 of 44',
        batchYear: 2026,
        masterDyer: 'T. Murata',
        masterCutter: 'K. Sato',
        issuedAt: new Date().toISOString(),
        ownerFingerprint: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      };

      const signedDeed = signProvenanceDeed(payload, keys.privateKeyHex, keys.publicKeyHex);

      expect(signedDeed.algorithm).toBe('Ed25519');
      expect(typeof signedDeed.signatureHex).toBe('string');
      expect(signedDeed.signatureHex.length).toBeGreaterThan(60);

      // Offline verification with atelier public key
      const isValid = verifyDeedSignature(signedDeed);
      expect(isValid).toBe(true);
    });

    it('detects and rejects tampered deed content', () => {
      const keys = generateAtelierKeyPair();

      const payload: UnsignedProvenancePayload = {
        serialNumber: 'OTR-2026-000184',
        objectNumber: '041',
        editionPiece: 'Piece 14 of 44',
        batchYear: 2026,
        masterDyer: 'T. Murata',
        masterCutter: 'K. Sato',
        issuedAt: new Date().toISOString(),
        ownerFingerprint: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      };

      const signedDeed = signProvenanceDeed(payload, keys.privateKeyHex, keys.publicKeyHex);

      // Adversary attempts to tamper with edition piece (counterfeit modification)
      const tamperedDeed = {
        ...signedDeed,
        editionPiece: 'Piece 01 of 44', // Forged!
      };

      const isValid = verifyDeedSignature(tamperedDeed);
      expect(isValid).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Chained Ownership Transfer Engine
  // -------------------------------------------------------------------------
  describe('E2: Cryptographic Ownership Transfer Chain', () => {
    it('creates and validates an immutable multi-generational ownership chain', () => {
      const serial = 'OTR-2026-000184';

      // 1. Initial acquisition from atelier
      const genesis = OwnershipTransferEngine.createTransfer(
        serial,
        'user_collector_1',
        'Collector #1 (Sreeshanth, Hyderabad)',
        'INITIAL_ACQUISITION'
      );

      // 2. Transferred 5 years later to secondary collector
      const transfer2 = OwnershipTransferEngine.createTransfer(
        serial,
        'user_collector_2',
        'Collector #42 (Tokyo)',
        'PRIVATE_ARCHIVAL_TRANSFER',
        genesis.toUserId,
        genesis.transferHash
      );

      // 3. Bequeathed to tertiary collector
      const transfer3 = OwnershipTransferEngine.createTransfer(
        serial,
        'user_collector_3',
        'Collector #88 (Kyoto Archive)',
        'ESTATE_INHERITANCE',
        transfer2.toUserId,
        transfer2.transferHash
      );

      const chain: OwnershipTransferRecord[] = [genesis, transfer2, transfer3];

      // Verify complete chain
      expect(OwnershipTransferEngine.verifyChainIntegrity(chain)).toBe(true);
    });

    it('detects break or data tampering in the ownership hash chain', () => {
      const serial = 'OTR-2026-000184';

      const genesis = OwnershipTransferEngine.createTransfer(
        serial,
        'user_1',
        'Collector 1',
        'INITIAL_ACQUISITION'
      );

      const transfer2 = OwnershipTransferEngine.createTransfer(
        serial,
        'user_2',
        'Collector 2',
        'PRIVATE_ARCHIVAL_TRANSFER',
        genesis.toUserId,
        genesis.transferHash
      );

      // Adversary attempts to forge transfer2's recipient
      const tamperedTransfer2 = {
        ...transfer2,
        toUserId: 'user_attacker',
      };

      const brokenChain = [genesis, tamperedTransfer2];
      expect(OwnershipTransferEngine.verifyChainIntegrity(brokenChain)).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Botanical Re-Dyeing & Repair Registry
  // -------------------------------------------------------------------------
  describe('E3: Atelier Re-Dyeing & Repair Registry', () => {
    it('records and retrieves lifetime garment care rituals', () => {
      const registry = new RepairRegistry();
      const serial = 'OTR-2026-000184';

      // 1. Initial 3-year Sukumo botanical re-dye
      const redyeRecord = registry.logService(
        serial,
        'BOTANICAL_INDIGO_REDYE',
        'Takeshi Murata (Master Dyer)',
        '4 dips in fresh Autumn Sukumo vat to enrich worn collar and cuffs.',
        'Tokushima Sukumo Vats'
      );

      // 2. 7-year Sashiko reinforcement
      const sashikoRecord = registry.logService(
        serial,
        'SASHIKO_POCKET_REINFORCEMENT',
        'Kenji Takahashi (Pattern Cutter)',
        'Traditional white Sashiko stitch applied to interior chest pocket.',
        'Canal Warehouse No. 4, Otaru'
      );

      const history = registry.getServiceHistory(serial);
      expect(history.length).toBe(2);
      expect(history[0]!.serviceType).toBe('BOTANICAL_INDIGO_REDYE');
      expect(history[0]!.artisanName).toContain('Takeshi Murata');
      expect(history[1]!.serviceType).toBe('SASHIKO_POCKET_REINFORCEMENT');
      expect(history[1]!.serviceHash.length).toBe(64);
    });
  });
});
