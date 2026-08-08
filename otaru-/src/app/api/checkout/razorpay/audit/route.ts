import { NextResponse } from 'next/server';
import { getAuditEvents, verifyChainIntegrity } from '@/lib/payments/audit-trail';
import { getNonceStoreSize } from '@/lib/payments/nonce-store';
import { getIdempotencyStoreSize } from '@/lib/payments/idempotency';

export async function GET() {
  try {
    const events = getAuditEvents(200);
    const chainIntegrity = verifyChainIntegrity();

    // Compute threat summary
    const blocked = events.filter(e =>
      ['RATE_LIMIT_BLOCKED', 'FRAUD_BLOCKED', 'ORDER_BLOCKED', 'WEBHOOK_REPLAY_DETECTED', 'REPLAY_ATTACK_DETECTED'].includes(e.type)
    ).length;
    const flagged = events.filter(e => e.type === 'FRAUD_FLAGGED').length;
    const idempotencyCollisions = events.filter(e => e.type === 'IDEMPOTENCY_COLLISION').length;
    const replayAttempts = events.filter(e =>
      ['REPLAY_ATTACK_DETECTED', 'NONCE_REPLAY_BLOCKED'].includes(e.type)
    ).length;
    const schemaFailures = events.filter(e => e.type === 'SCHEMA_VALIDATION_FAILED').length;

    return NextResponse.json({
      events,
      chainIntegrity,
      summary: {
        total: events.length,
        blocked,
        flagged,
        idempotencyCollisions,
        replayAttempts,
        schemaFailures,
        activeNonces: getNonceStoreSize(),
        activeIdempotencyKeys: getIdempotencyStoreSize(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch audit data.' }, { status: 500 });
  }
}
