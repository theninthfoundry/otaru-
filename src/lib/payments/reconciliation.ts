import { prisma } from '@/lib/db/prisma';
import { auditLog } from './audit-trail';
import { logger } from '@/lib/security/logger';

export interface ReconciliationMismatch {
  id: string;
  type:
    | 'MISMATCH_CAPTURED_UNCONFIRMED'
    | 'MISMATCH_ORDER_UNPAID'
    | 'MISMATCH_INVENTORY_OVERSELL'
    | 'MISMATCH_OUTBOX_STUCK';
  details: string;
  severity: 'HIGH' | 'CRITICAL';
  refId: string;
}

export interface ReconciliationReport {
  timestamp: string;
  scannedPayments: number;
  scannedOrders: number;
  mismatchesFound: number;
  mismatches: ReconciliationMismatch[];
  status: 'HEALTHY' | 'MISMATCH_DETECTED';
}

/**
 * Otaru Safety-Net Reconciliation Engine
 * Periodically cross-audits external gateway payments against internal database truth.
 */
export async function runPaymentReconciliation(): Promise<ReconciliationReport> {
  const mismatches: ReconciliationMismatch[] = [];

  // 1. Audit Captured Payments vs Confirmed Orders
  const capturedPayments = await prisma.payment.findMany({
    where: { status: 'CAPTURED' },
    include: { order: true },
  });

  for (const payment of capturedPayments) {
    if (!payment.order || payment.order.status !== 'CONFIRMED') {
      const mismatch: ReconciliationMismatch = {
        id: `recon_${payment.id}`,
        type: 'MISMATCH_CAPTURED_UNCONFIRMED',
        details: `Payment ${payment.id} is CAPTURED but associated Order ${payment.orderId} is ${payment.order?.status ?? 'MISSING'}.`,
        severity: 'CRITICAL',
        refId: payment.id,
      };
      mismatches.push(mismatch);
      auditLog({
        type: 'RECONCILIATION_MISMATCH',
        details: mismatch.details,
        ref: payment.id,
        meta: { type: mismatch.type },
      });
    }
  }

  // 2. Audit Confirmed Orders vs Paid Ledger
  const confirmedOrders = await prisma.order.findMany({
    where: { status: 'CONFIRMED' },
    include: { payments: true },
  });

  for (const order of confirmedOrders) {
    const hasCapturedPayment = order.payments.some((p) => p.status === 'CAPTURED');
    if (!hasCapturedPayment) {
      const mismatch: ReconciliationMismatch = {
        id: `recon_order_${order.id}`,
        type: 'MISMATCH_ORDER_UNPAID',
        details: `Order ${order.id} is marked CONFIRMED but has zero CAPTURED payment records in ledger.`,
        severity: 'CRITICAL',
        refId: order.id,
      };
      mismatches.push(mismatch);
      auditLog({
        type: 'RECONCILIATION_MISMATCH',
        details: mismatch.details,
        ref: order.id,
        meta: { type: mismatch.type },
      });
    }
  }

  // 3. Audit Stuck Processing Outbox Events (>5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const stuckOutboxEvents = await prisma.outboxEvent.findMany({
    where: {
      status: 'PROCESSING',
      updatedAt: { lt: fiveMinutesAgo },
    },
  });

  for (const event of stuckOutboxEvents) {
    const mismatch: ReconciliationMismatch = {
      id: `recon_outbox_${event.id}`,
      type: 'MISMATCH_OUTBOX_STUCK',
      details: `OutboxEvent ${event.id} (${event.eventType}) stuck in PROCESSING state since ${event.updatedAt.toISOString()}.`,
      severity: 'HIGH',
      refId: event.id,
    };
    mismatches.push(mismatch);
  }

  const report: ReconciliationReport = {
    timestamp: new Date().toISOString(),
    scannedPayments: capturedPayments.length,
    scannedOrders: confirmedOrders.length,
    mismatchesFound: mismatches.length,
    mismatches,
    status: mismatches.length === 0 ? 'HEALTHY' : 'MISMATCH_DETECTED',
  };

  if (mismatches.length > 0) {
    logger.warn(`[RECONCILIATION ENGINE] Detected ${mismatches.length} state mismatches!`);
  } else {
    logger.info(`[RECONCILIATION ENGINE] Scan completed successfully. System state is HEALTHY.`);
  }

  return report;
}
