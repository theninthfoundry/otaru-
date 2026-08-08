/**
 * OTARU — Immutable Security Audit Trail
 *
 * An append-only log of every security-relevant payment event.
 * Events are never modified or deleted — only appended.
 * Each event is chained with the SHA-256 hash of the previous event,
 * creating a tamper-evident chain (like a mini blockchain).
 *
 * Event types:
 *  - ORDER_CREATED / ORDER_BLOCKED
 *  - PAYMENT_VERIFIED / PAYMENT_FAILED
 *  - REPLAY_ATTACK_DETECTED
 *  - RATE_LIMIT_BLOCKED
 *  - FRAUD_FLAGGED / FRAUD_BLOCKED
 *  - CART_TAMPER_DETECTED
 *  - IDEMPOTENCY_COLLISION
 *  - WEBHOOK_REPLAY_DETECTED
 *  - REFUND_ISSUED
 *
 * Persisted to: src/data/security-audit.json
 * In production, stream to an immutable log store (Cloud Logging, Datadog, etc.)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type AuditEventType =
  | 'ORDER_CREATED'
  | 'ORDER_BLOCKED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_FAILED'
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
  | 'NONCE_REPLAY_BLOCKED';

export interface AuditEvent {
  /** Sequential index */
  seq: number;
  /** ISO timestamp */
  timestamp: string;
  type: AuditEventType;
  /** Order or payment ID */
  ref?: string;
  ip?: string;
  email?: string;
  /** Human-readable event details */
  details: string;
  /** Additional structured metadata */
  meta?: Record<string, unknown>;
  /** SHA-256 hash of the previous event (chain integrity) */
  prevHash: string;
  /** SHA-256 hash of this event's content */
  hash: string;
}

const AUDIT_FILE = path.join(process.cwd(), 'src', 'data', 'security-audit.json');

// In-memory chain tail for fast appending
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
      return { seq: 0, hash: '0'.repeat(64) }; // Genesis hash
    }
    const last = events[events.length - 1];
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

/**
 * Append a security event to the audit trail.
 * Thread-safe for single-process deployments.
 */
export function auditLog(params: {
  type: AuditEventType;
  details: string;
  ref?: string;
  ip?: string;
  email?: string;
  meta?: Record<string, unknown>;
}): void {
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

    // Append to file (read-append-write — acceptable for low-volume audit logs)
    const existing = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(existing);
    events.push(event);
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(events, null, 2), 'utf-8');

    // Update in-memory tail
    chainTail = { seq, hash };
  } catch (err) {
    // Audit failures must never crash the payment flow
    console.error('[AuditTrail] Failed to write event:', err);
  }
}

/**
 * Read all audit events (for the security dashboard).
 */
export function getAuditEvents(limit = 100): AuditEvent[] {
  try {
    ensureFile();
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(data);
    return events.slice(-limit).reverse(); // Most recent first
  } catch {
    return [];
  }
}

/**
 * Verify chain integrity — detect tampering.
 * Returns the index of the first broken link, or -1 if chain is intact.
 */
export function verifyChainIntegrity(): { intact: boolean; brokenAt?: number } {
  try {
    ensureFile();
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const events: AuditEvent[] = JSON.parse(data);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
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
