/**
 * OTARU ARTIFACT OS — 16-State Permanent Artifact Provenance Ledger
 * Maintains an immutable append-only cryptographic timeline of physical garment custody and milestones.
 */

import { createHash } from 'crypto';
import { appendAuditEvent } from '@/lib/payments/audit-trail';

export type ArtifactMilestoneType =
  | 'ARTIFACT_CREATED'
  | 'MATERIAL_REGISTERED'
  | 'MANUFACTURING_STARTED'
  | 'MANUFACTURING_COMPLETED'
  | 'QUALITY_CHECKED'
  | 'NFC_BOUND'
  | 'CERTIFICATE_ISSUED'
  | 'LISTED'
  | 'RESERVED'
  | 'SOLD'
  | 'DELIVERED'
  | 'OWNERSHIP_TRANSFERRED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'RESOLD'
  | 'ARCHIVED';

export interface ArtifactTimelineEntry {
  entryId: string;
  serialNumber: string;
  milestone: ArtifactMilestoneType;
  actor: string; // e.g. "atelier:master_tailor_04", "system:order_orchestrator", "patron:owner@otaru.co"
  location: string; // e.g. "Kojima, Okayama Prefecture, Japan"
  timestamp: string;
  details: string;
  metadata?: Record<string, unknown>;
  prevHash: string;
  entryHash: string;
}

const artifactLedgers = new Map<string, ArtifactTimelineEntry[]>();

export class ArtifactLedger {
  /**
   * Appends an immutable milestone event to the physical garment's timeline.
   */
  public static async recordMilestone(
    serialNumber: string,
    milestone: ArtifactMilestoneType,
    params: {
      actor: string;
      location?: string;
      details: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<ArtifactTimelineEntry> {
    const history = artifactLedgers.get(serialNumber) || [];
    const prevHash = history.length > 0 ? history[history.length - 1].entryHash : 'GENESIS_00000000000000000000000000000000';
    const timestamp = new Date().toISOString();
    const location = params.location || 'Otaru Central Atelier';
    const entryId = `MIL-${serialNumber}-${history.length + 1}`;

    // Compute cryptographic SHA-256 hash
    const entryHash = createHash('sha256')
      .update(`${prevHash}:${serialNumber}:${milestone}:${params.actor}:${timestamp}:${params.details}`)
      .digest('hex');

    const entry: ArtifactTimelineEntry = {
      entryId,
      serialNumber,
      milestone,
      actor: params.actor,
      location,
      timestamp,
      details: params.details,
      metadata: params.metadata,
      prevHash,
      entryHash,
    };

    history.push(entry);
    artifactLedgers.set(serialNumber, history);

    // Write to system audit chain
    await appendAuditEvent({
      type: `ARTIFACT_MILESTONE_${milestone}`,
      ref: serialNumber,
      details: `[${milestone}] ${params.details} (Actor: ${params.actor} @ ${location})`,
      meta: { serialNumber, entryId, entryHash, prevHash, ...params.metadata },
    });

    return entry;
  }

  /**
   * Retrieves the full provenance timeline for a physical garment.
   */
  public static getTimeline(serialNumber: string): ArtifactTimelineEntry[] {
    return artifactLedgers.get(serialNumber) || [];
  }

  /**
   * Verifies the cryptographic chain integrity of a garment's timeline.
   */
  public static verifyTimelineIntegrity(serialNumber: string): { isValid: boolean; verifiedEntries: number; brokenIndex?: number } {
    const history = artifactLedgers.get(serialNumber) || [];
    if (history.length === 0) return { isValid: true, verifiedEntries: 0 };

    for (let i = 0; i < history.length; i++) {
      const current = history[i];
      const expectedPrevHash = i === 0 ? 'GENESIS_00000000000000000000000000000000' : history[i - 1].entryHash;

      if (current.prevHash !== expectedPrevHash) {
        return { isValid: false, verifiedEntries: i, brokenIndex: i };
      }

      const calculatedHash = createHash('sha256')
        .update(`${current.prevHash}:${current.serialNumber}:${current.milestone}:${current.actor}:${current.timestamp}:${current.details}`)
        .digest('hex');

      if (current.entryHash !== calculatedHash) {
        return { isValid: false, verifiedEntries: i, brokenIndex: i };
      }
    }

    return { isValid: true, verifiedEntries: history.length };
  }
}
