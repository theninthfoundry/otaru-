import { NextResponse, type NextRequest } from 'next/server';
import { runOutboxWorker } from '@/lib/queue/worker';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds maximum execution

/**
 * GET /api/cron/outbox
 * Edge/Serverless Cron Handler for Draining Transactional Outbox Events
 * Guarded by Authorization Bearer CRON_SECRET header or internal invocation.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_API_SECRET;

  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized cron invocation', code: 'UNAUTHORIZED_CRON' },
        { status: 401 }
      );
    }
  }

  const workerResult = await runOutboxWorker(30);

  return NextResponse.json({
    success: workerResult.status !== 'ERROR',
    worker: workerResult,
  });
}
