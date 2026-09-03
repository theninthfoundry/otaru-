/**
 * OTARU PROVENANCE DEED CRYPTOGRAPHIC SIGNER
 * Implements Ed25519 asymmetric signature generation and verification.
 * Every Deed of Authenticity is signed by the Otaru Atelier private key,
 * allowing collectors and appraisers worldwide to verify authenticity offline.
 */

import crypto from 'crypto';

export interface UnsignedProvenancePayload {
  serialNumber: string;       // "OTR-2026-000184"
  objectNumber: string;       // "041"
  editionPiece: string;       // "Piece 14 of 44"
  batchYear: number;          // 2026
  masterDyer: string;         // "T. Murata"
  masterCutter: string;       // "K. Sato"
  issuedAt: string;           // ISO timestamp
  ownerFingerprint: string;   // SHA-256 of collector identifier
}

export interface SignedProvenanceDeed extends UnsignedProvenancePayload {
  signatureHex: string;       // Ed25519 signature
  publicKeyHex: string;       // Otaru Atelier public verification key
  algorithm: 'Ed25519';
}

/**
 * Generates an Ed25519 keypair for the atelier or testing.
 */
export function generateAtelierKeyPair(): { privateKeyHex: string; publicKeyHex: string } {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519', {
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
    publicKeyEncoding: { type: 'spki', format: 'der' },
  });

  return {
    privateKeyHex: privateKey.toString('hex'),
    publicKeyHex: publicKey.toString('hex'),
  };
}

/**
 * Canonically serializes a provenance payload into a deterministic string for signing.
 */
export function canonicalizeDeedPayload(payload: UnsignedProvenancePayload): Buffer {
  const canonicalString = [
    `SERIAL:${payload.serialNumber}`,
    `OBJECT:${payload.objectNumber}`,
    `EDITION:${payload.editionPiece}`,
    `YEAR:${payload.batchYear}`,
    `DYER:${payload.masterDyer}`,
    `CUTTER:${payload.masterCutter}`,
    `ISSUED:${payload.issuedAt}`,
    `OWNER:${payload.ownerFingerprint}`,
  ].join('\n');

  return Buffer.from(canonicalString, 'utf8');
}

/**
 * Signs a provenance deed using the atelier's private Ed25519 key.
 */
export function signProvenanceDeed(
  payload: UnsignedProvenancePayload,
  privateKeyDerHex: string,
  publicKeyDerHex: string
): SignedProvenanceDeed {
  const data = canonicalizeDeedPayload(payload);
  const privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKeyDerHex, 'hex'),
    format: 'der',
    type: 'pkcs8',
  });

  const signature = crypto.sign(null, data, privateKey);

  return {
    ...payload,
    signatureHex: signature.toString('hex'),
    publicKeyHex: publicKeyDerHex,
    algorithm: 'Ed25519',
  };
}

/**
 * Verifies an Ed25519 signed deed against the atelier public key.
 */
export function verifyDeedSignature(deed: SignedProvenanceDeed): boolean {
  try {
    const data = canonicalizeDeedPayload(deed);
    const publicKey = crypto.createPublicKey({
      key: Buffer.from(deed.publicKeyHex, 'hex'),
      format: 'der',
      type: 'spki',
    });

    const signature = Buffer.from(deed.signatureHex, 'hex');
    return crypto.verify(null, data, publicKey, signature);
  } catch {
    return false;
  }
}
