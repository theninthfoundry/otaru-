/**
 * OTARU IMMUTABLE AUDIT TRAIL
 * Records every privileged administrative or financial action:
 * WHO, WHAT, WHEN, WHERE, TARGET, BEFORE, AFTER, REQUEST ID
 */

export interface AuditRecordInput {
  actorId: string;
  action: string;
  targetType: 'ORDER' | 'PAYMENT' | 'USER' | 'INVENTORY' | 'SYSTEM' | 'REFUND';
  targetId: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  ipAddress?: string;
  requestId?: string;
}

export interface StampedAuditRecord extends AuditRecordInput {
  id: string;
  timestamp: string;
}

export class AuditRecorder {
  private records: StampedAuditRecord[] = [];

  record(input: AuditRecordInput): StampedAuditRecord {
    const stamped: StampedAuditRecord = {
      ...input,
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    this.records.push(stamped);
    return stamped;
  }

  getRecordsForTarget(targetId: string): StampedAuditRecord[] {
    return this.records.filter((r) => r.targetId === targetId);
  }

  getAllRecords(): StampedAuditRecord[] {
    return [...this.records];
  }
}
