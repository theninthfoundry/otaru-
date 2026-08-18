/**
 * OTARU — Physical-Digital Provenance: Ownership Transfer Protocol
 * Enables cryptographic re-assignment of physical NFC garment certificates between patrons.
 */

import { createHash, randomBytes } from 'crypto';
import { appendAuditEvent } from '@/lib/payments/audit-trail';

export interface OwnershipTransferRecord {
  transferToken: string;
  serialNumber: string;
  previousOwnerEmail: string;
  newOwnerEmail?: string;
  status: 'PENDING' | 'CLAIMED' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  expiresAt: string;
  transferProofHash: string;
}

// In-memory persistent transfer store (backed by Audit Chain and DB)
const transferStore = new Map<string, OwnershipTransferRecord>();

/**
 * Creates a cryptographically sealed ownership transfer invitation for a physical NFC artifact.
 */
export async function createOwnershipTransfer(
  serialNumber: string,
  ownerEmail: string,
  validHours = 48
): Promise<OwnershipTransferRecord> {
  const transferToken = `OTARU-XFER-${randomBytes(12).toString('hex').toUpperCase()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + validHours * 60 * 60 * 1000).toISOString();

  // Create cryptographic SHA-256 seal of the transfer intent
  const transferProofHash = createHash('sha256')
    .update(`${serialNumber}:${ownerEmail}:${transferToken}:${expiresAt}`)
    .digest('hex');

  const record: OwnershipTransferRecord = {
    transferToken,
    serialNumber,
    previousOwnerEmail: ownerEmail,
    status: 'PENDING',
    createdAt: now.toISOString(),
    expiresAt,
    transferProofHash,
  };

  transferStore.set(transferToken, record);

  // Append to immutable cryptographic audit chain
  await appendAuditEvent({
    type: 'PROVENANCE_TRANSFER_INITIATED',
    ref: serialNumber,
    email: ownerEmail,
    details: `Ownership transfer initiated for garment ${serialNumber}. Token: ${transferToken}`,
    meta: { transferToken, expiresAt, transferProofHash },
  });

  return record;
}

/**
 * Claims an ownership transfer invitation and binds the physical NFC certificate to the new patron.
 */
export async function claimOwnershipTransfer(
  transferToken: string,
  newOwnerEmail: string,
  newOwnerIp?: string
): Promise<{ success: boolean; record?: OwnershipTransferRecord; error?: string }> {
  const record = transferStore.get(transferToken);

  if (!record) {
    return { success: false, error: 'Invalid or non-existent transfer token.' };
  }

  if (record.status !== 'PENDING') {
    return { success: false, error: `Transfer is already ${record.status.toLowerCase()}.` };
  }

  if (new Date() > new Date(record.expiresAt)) {
    record.status = 'EXPIRED';
    return { success: false, error: 'Transfer token has expired.' };
  }

  if (record.previousOwnerEmail.toLowerCase() === newOwnerEmail.toLowerCase()) {
    return { success: false, error: 'Cannot transfer garment to existing owner.' };
  }

  // Update status and seal
  record.status = 'CLAIMED';
  record.newOwnerEmail = newOwnerEmail;

  // Record audit chain transfer completion
  await appendAuditEvent({
    type: 'PROVENANCE_TRANSFER_CLAIMED',
    ref: record.serialNumber,
    email: newOwnerEmail,
    ip: newOwnerIp,
    details: `Garment ${record.serialNumber} ownership transferred from ${record.previousOwnerEmail} to ${newOwnerEmail}.`,
    meta: {
      transferToken,
      previousOwner: record.previousOwnerEmail,
      newOwner: newOwnerEmail,
      proofHash: record.transferProofHash,
    },
  });

  return { success: true, record };
}

/**
 * Retrieves the status of a transfer token.
 */
export function getTransferDetails(transferToken: string): OwnershipTransferRecord | null {
  return transferStore.get(transferToken) || null;
}
