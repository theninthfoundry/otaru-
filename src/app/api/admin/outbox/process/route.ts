import { NextResponse } from 'next/server';
import { processPendingOutboxEvents } from '@/lib/queue/outbox-publisher';
import { logger } from '@/lib/security/logger';

export const dynamic = 'force-dynamic';

/**
 * Outbox Processor Endpoint
 * Invocable by Vercel Cron or administrative dispatchers.
 * Requires Authorization: Bearer <CRON_SECRET | ADMIN_API_SECRET>
 */
export async function GET(request: Request) {
  return handleProcess(request);
}

export async function POST(request: Request) {
  return handleProcess(request);
}

async function handleProcess(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  const isProduction = process.env.NODE_ENV === 'production';
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_API_SECRET;

  const isAuthorized =
    (!isProduction && !adminSecret && !cronSecret) ||
    Boolean(token && ((cronSecret && token === cronSecret) || (adminSecret && token === adminSecret)));

  if (!isAuthorized) {
    logger.warn('[Outbox Worker] Unauthorized outbox trigger attempt');
    return NextResponse.json(
      { error: 'Unauthorized outbox trigger.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    const processed = await processPendingOutboxEvents(25);
    logger.info(`[Outbox Worker] Processed ${processed} domain outbox events`);
    return NextResponse.json(
      {
        success: true,
        processed,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    logger.error('[Outbox Worker Error] Failed processing outbox:', err);
    return NextResponse.json(
      { error: 'Outbox processing failed.', code: 'OUTBOX_ERROR' },
      { status: 500 }
    );
  }
}
