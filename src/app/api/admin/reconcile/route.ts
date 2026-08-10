import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { runPaymentReconciliation } from '@/lib/payments/reconciliation';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';

export async function POST(request: Request) {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  const adminSecret = process.env.ADMIN_API_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  // Strict Admin Authorization Check
  if (isProduction && (!adminSecret || authHeader !== `Bearer ${adminSecret}`)) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access.', code: 'UNAUTHORIZED_ADMIN' },
      { status: 401 },
    );
  }

  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    '127.0.0.1';

  try {
    logger.info(`[Admin Reconcile API] Execution triggered from IP: ${ip}`);
    const report = await runPaymentReconciliation();

    auditLog({
      type: 'ORDER_CREATED', // Record operational action
      details: `Admin reconciliation scan completed. Status: ${report.status}. Mismatches: ${report.mismatchesFound}`,
      ip,
      meta: { status: report.status, mismatchesFound: report.mismatchesFound },
    });

    return NextResponse.json(report, { status: 200 });
  } catch (error: unknown) {
    logger.error('[Admin Reconcile API] Exception executing reconciliation scan:', error);
    return NextResponse.json(
      { error: 'Reconciliation scan failed.', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
