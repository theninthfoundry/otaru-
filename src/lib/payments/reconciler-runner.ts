/**
 * OTARU — Automated Safety-Net Reconciliation Runner
 * Executes periodic cross-audits and generates forensic compliance records.
 */

import { runPaymentReconciliation, type ReconciliationReport } from './reconciliation';
import { appendAuditEvent } from './audit-trail';

export async function executeScheduledReconciliation(): Promise<ReconciliationReport> {
  const report = await runPaymentReconciliation();

  // Seal reconciliation result into the cryptographic audit chain
  await appendAuditEvent({
    type: 'AUTOMATED_RECONCILIATION_RUN',
    ref: `recon_${Date.now()}`,
    details: `Reconciliation audit finished: ${report.status}. Scanned ${report.scannedPayments} payments, ${report.scannedOrders} orders. Mismatches: ${report.mismatchesFound}`,
    meta: {
      status: report.status,
      mismatchesFound: report.mismatchesFound,
      scannedPayments: report.scannedPayments,
      scannedOrders: report.scannedOrders,
    },
  });

  return report;
}
