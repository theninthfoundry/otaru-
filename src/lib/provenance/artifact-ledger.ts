/**
 * OTARU ARTIFACT OS — Physical-Digital Provenance Ledger
 * Cryptographically links serialized physical garment milestones (weaving, dyeing, cutting, assembly, NFC binding, vault release).
 */

import { createHash } from 'crypto';
import { appendAuditEvent } from '@/lib/payments/audit-trail';

export type ProvenanceMilestone =
  | 'RAW_FIBER_HARVESTED'
  | 'YARN_SPUN'
  | 'TEXTILE_WOVEN'
  | 'INDIGO_DYE_DIPPED'
  | 'PATTERN_CUT'
  | 'HAND_STITCHED'
  | 'HARDWARE_ATTACHED'
  | 'ARTIFACT_CREATED'
  | 'QUALITY_INSPECTED'
  | 'NFC_SEAL_BOUND'
  | 'VAULT_STORED'
  | 'RELEASED_TO_DROP'
  | 'PURCHASED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'OWNERSHIP_TRANSFERRED';

export interface ArtifactTimelineEntry {
  entryId: string;
  serialNumber: string;
  milestone: ProvenanceMilestone;
  actor: string;
  location: string;
  timestamp: string;
  details: string;
  metadata?: Record<string, unknown>;
  prevHash: string;
  entryHash: string;
}

// In-memory persistent timeline ledger (dual-written to Audit Trail and DB)
const artifactLedgers = new Map<string, ArtifactTimelineEntry[]>();

export class ArtifactLedger {
  /**
   * Appends a verifiable manufacturing/ownership milestone to a garment's timeline.
   */
  public static async recordMilestone(
    serialNumber: string,
    milestone: ProvenanceMilestone,
    params: {
      actor: string;
      location?: string;
      details: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<ArtifactTimelineEntry> {
    const history = artifactLedgers.get(serialNumber) || [];
    const lastEntry = history.length > 0 ? history[history.length - 1] : undefined;
    const prevHash = lastEntry ? lastEntry.entryHash : 'GENESIS_00000000000000000000000000000000';
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
      if (!current) continue;
      const expectedPrevHash = i === 0 ? 'GENESIS_00000000000000000000000000000000' : (history[i - 1]?.entryHash ?? '');

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
