import { NextResponse, type NextRequest } from 'next/server';
import { executeScheduledReconciliation } from '@/lib/payments/reconciler-runner';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * GET /api/cron/reconcile
 * Edge/Serverless Cron Handler for Safety-Net Payment & Order Reconciliation
 * Guarded by Authorization Bearer CRON_SECRET or ADMIN_API_SECRET.
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

  try {
    const report = await executeScheduledReconciliation();
    return NextResponse.json({
      success: report.status === 'HEALTHY',
      report,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
