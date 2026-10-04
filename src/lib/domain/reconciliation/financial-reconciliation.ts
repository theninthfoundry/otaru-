/**
 * OTARU FINANCIAL RECONCILIATION ENGINE
 * Validates the core financial invariant:
 *
 *   ORDER TOTAL == PAYMENT EXPECTED == PAYMENT CAPTURED == LEDGER TOTAL
 *
 * Explicitly models refunds, cancellations, and discrepancies.
 */

export interface OrderFinancialRecord {
  orderId: string;
  orderTotalMinor: number;
  paymentExpectedMinor: number;
  paymentCapturedMinor: number;
  refundedAmountMinor: number;
  ledgerRecordedMinor: number;
  status: 'PAID' | 'REFUNDED' | 'CANCELLED' | 'FAILED';
}

export interface ReconciliationReport {
  isBalanced: boolean;
  orderCount: number;
  totalRevenueMinor: number;
  totalRefundedMinor: number;
  netRevenueMinor: number;
  discrepancies: Array<{
    orderId: string;
    reason: string;
    deltaMinor: number;
  }>;
}

/**
 * Executes a deterministic reconciliation pass across a list of financial records.
 */
export function reconcileFinancialBatch(records: OrderFinancialRecord[]): ReconciliationReport {
  let totalRevenueMinor = 0;
  let totalRefundedMinor = 0;
  const discrepancies: ReconciliationReport['discrepancies'] = [];

  for (const record of records) {
    if (record.status === 'PAID') {
      // Invariant: Order Total == Payment Expected == Payment Captured == Ledger Recorded
      if (
        record.orderTotalMinor !== record.paymentExpectedMinor ||
        record.paymentExpectedMinor !== record.paymentCapturedMinor ||
        record.paymentCapturedMinor !== record.ledgerRecordedMinor
      ) {
        discrepancies.push({
          orderId: record.orderId,
          reason: 'INVARIANT_MISMATCH: Order, payment, and ledger totals disagree.',
          deltaMinor: record.paymentCapturedMinor - record.orderTotalMinor,
        });
      } else {
        totalRevenueMinor += record.paymentCapturedMinor;
      }
    } else if (record.status === 'REFUNDED') {
      if (record.refundedAmountMinor > record.paymentCapturedMinor) {
        discrepancies.push({
          orderId: record.orderId,
          reason: 'REFUND_EXCEEDS_PAYMENT: Refunded amount exceeds captured amount.',
          deltaMinor: record.refundedAmountMinor - record.paymentCapturedMinor,
        });
      } else {
        totalRevenueMinor += record.paymentCapturedMinor;
        totalRefundedMinor += record.refundedAmountMinor;
      }
    }
  }

  const netRevenueMinor = totalRevenueMinor - totalRefundedMinor;

  return {
    isBalanced: discrepancies.length === 0,
    orderCount: records.length,
    totalRevenueMinor,
    totalRefundedMinor,
    netRevenueMinor,
    discrepancies,
  };
}
