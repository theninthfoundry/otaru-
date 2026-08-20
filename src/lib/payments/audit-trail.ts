import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';

export type AuditEventType =
  | 'ORDER_CREATED'
  | 'ORDER_BLOCKED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_CAPTURED'
  | 'PAYMENT_FULLY_REFUNDED'
  | 'PAYMENT_PARTIALLY_REFUNDED'
  | 'REFUND_INVARIANT_BREACH_PREVENTED'
  | 'REPLAY_ATTACK_DETECTED'
  | 'RATE_LIMIT_BLOCKED'
  | 'FRAUD_FLAGGED'
  | 'FRAUD_BLOCKED'
  | 'CART_TAMPER_DETECTED'
  | 'IDEMPOTENCY_COLLISION'
  | 'WEBHOOK_REPLAY_DETECTED'
  | 'WEBHOOK_RECEIVED'
  | 'REFUND_ISSUED'
  | 'SCHEMA_VALIDATION_FAILED'
  | 'NONCE_CONSUMED'
  | 'NONCE_REPLAY_BLOCKED'
  | 'RECONCILIATION_MISMATCH'
  | 'PROVENANCE_TRANSFER_INITIATED'
  | 'PROVENANCE_TRANSFER_CLAIMED'
  | 'CONCIERGE_INQUIRY_SUBMITTED'
  | (string & {});

export interface AuditEvent {
  seq: number;
  timestamp: string;
  type: AuditEventType;
  ref?: string;
  ip?: string;
  email?: string;
  details: string;
  meta?: Record<string, unknown>;
  prevHash: string;
  hash: string;
}

const AUDIT_FILE = path.join(process.cwd(), 'src', 'data', 'security-audit.json');

let chainTail: { seq: number; hash: string } | null = null;

function ensureFile() {
  const dir = path.dirname(AUDIT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(AUDIT_FILE)) fs.writeFileSync(AUDIT_FILE, '[]', 'utf-8');
}

function getChainTail(): { seq: number; hash: string } {
  if (chainTail) return chainTail;
  try {
    ensureFile();
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(data);
    if (events.length === 0) {
      return { seq: 0, hash: '0'.repeat(64) };
    }
    const last = events[events.length - 1];
    if (!last) {
      return { seq: 0, hash: '0'.repeat(64) };
    }
    return { seq: last.seq, hash: last.hash };
  } catch {
    return { seq: 0, hash: '0'.repeat(64) };
  }
}

function computeEventHash(event: Omit<AuditEvent, 'hash'>): string {
  const content = JSON.stringify({
    seq: event.seq,
    timestamp: event.timestamp,
    type: event.type,
    ref: event.ref,
    ip: event.ip,
    email: event.email,
    details: event.details,
    meta: event.meta,
    prevHash: event.prevHash,
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function auditLog(params: {
  type: AuditEventType;
  details: string;
  ref?: string;
  ip?: string;
  email?: string;
  meta?: Record<string, unknown>;
}): AuditEvent {
  try {
    ensureFile();
    const tail = getChainTail();
    const seq = tail.seq + 1;
    const timestamp = new Date().toISOString();

    const eventWithoutHash: Omit<AuditEvent, 'hash'> = {
      seq,
      timestamp,
      type: params.type,
      ref: params.ref,
      ip: params.ip,
      email: params.email,
      details: params.details,
      meta: params.meta,
      prevHash: tail.hash,
    };

    const hash = computeEventHash(eventWithoutHash);
    const event: AuditEvent = { ...eventWithoutHash, hash };

    const existing = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(existing);
    events.push(event);
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(events, null, 2), 'utf-8');

    chainTail = { seq, hash };

    if (process.env.DATABASE_URL && prisma?.auditEvent) {
      prisma.auditEvent.create({
        data: {
          type: String(params.type),
          ref: params.ref,
          ip: params.ip,
          email: params.email,
          details: params.details,
          meta: (params.meta as any) ?? undefined,
          prevHash: tail.hash,
          hash,
        },
      }).catch(err => console.warn('[Prisma Audit Dual-Write Warning]:', err.message));
    }

    return event;
  } catch (err) {
    console.error('[AuditTrail] Failed to write event:', err);
    return {
      seq: 0,
      timestamp: new Date().toISOString(),
      type: params.type,
      details: params.details,
      prevHash: '0'.repeat(64),
      hash: '0'.repeat(64),
    };
  }
}

export async function appendAuditEvent(params: {
  type: AuditEventType;
  details: string;
  ref?: string;
  ip?: string;
  email?: string;
  meta?: Record<string, unknown>;
}): Promise<AuditEvent> {
  return auditLog(params);
}

export function getAuditEvents(limit = 100): AuditEvent[] {
  try {
    ensureFile();
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(data);
    return events.slice(-limit).reverse();
  } catch {
    return [];
  }
}

export function verifyChainIntegrity(): { intact: boolean; brokenAt?: number } {
  try {
    ensureFile();
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(data);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (!event) continue;
      const { hash, ...rest } = event;
      const recomputed = computeEventHash(rest);
      if (recomputed !== hash) {
        return { intact: false, brokenAt: i };
      }
    }
    return { intact: true };
  } catch {
    return { intact: false };
  }
}
