/**
 * OTARU DIGITAL PROVENANCE & PHYSICAL GARMENT IDENTITY
 * Product ≠ SKU ≠ Garment
 *
 * Formats unique individual serials: OTR-YYYY-XXXXXX
 * e.g. OTR-2026-000184
 * Connects physical textile to the permanent digital archive deed.
 */

import crypto from 'crypto';

export interface GarmentDeedData {
  serialNumber: string;       // "OTR-2026-000184"
  productName: string;        // "Yama Field Jacket"
  objectNumber: string;       // "041"
  editionPiece: string;       // "Piece 14 of 44"
  batchYear: number;          // 2026
  dyeMaster: string;          // "T. Murata (Tokushima)"
  patternCutter: string;      // "K. Sato (Otaru)"
  loomSpec: string;           // "Toyoda G3 Vintage Shuttle (1968)"
  ownerEmail?: string;
  issuedAt: string;
}

/**
 * Formats a sequential garment index into the canonical archival serial.
 */
export function formatGarmentSerial(year: number, sequenceIndex: number): string {
  const padded = String(sequenceIndex).padStart(6, '0');
  return `OTR-${year}-${padded}`;
}

/**
 * Generates a SHA-256 cryptographic authenticity hash for a garment deed.
 */
export function generateProvenanceHash(deed: GarmentDeedData, secretSalt: string): string {
  const payload = [
    deed.serialNumber,
    deed.objectNumber,
    deed.editionPiece,
    deed.batchYear,
    deed.dyeMaster,
    deed.loomSpec,
    deed.issuedAt,
    secretSalt,
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Generates the canonical URL that physical QR / NFC garment tags link to.
 */
export function getGarmentVerificationUrl(serialNumber: string, baseUrl: string = 'https://otaru.in'): string {
  return `${baseUrl}/verify/${encodeURIComponent(serialNumber)}`;
}
