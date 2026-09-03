import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuditEvents, verifyChainIntegrity } from '@/lib/payments/audit-trail';
import { getNonceStoreSize } from '@/lib/payments/nonce-store';
import { getIdempotencyStoreSize } from '@/lib/payments/idempotency';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_API_SECRET;

  if (!adminSecret || !authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access.' },
      { status: 401 },
    );
  }

  const expectedBuf = Buffer.from(`Bearer ${adminSecret}`);
  const receivedBuf = Buffer.from(authHeader);
  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json(
      { error: 'Forbidden administrative access.' },
      { status: 403 },
    );
  }
  try {
    const events = getAuditEvents(200);
    const chainIntegrity = verifyChainIntegrity();

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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch audit data.' }, { status: 500 });
  }
}
