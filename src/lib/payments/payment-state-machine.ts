/**
 * OTARU ARTIFACT OS — Payment Lifecycle State Machine
 * Guarantees zero double-captures, deterministic refunds, and financial invariant checks.
 */

import { appendAuditEvent } from './audit-trail';

export type PaymentState =
  | 'INITIALIZED'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'SETTLED'
  | 'REFUND_REQUESTED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'FAILED'
  | 'VOIDED';

export interface PaymentLedgerRecord {
  paymentId: string;
  orderId: string;
  gateway: string;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amountMinor: number;
  refundedMinor: number;
  currency: string;
  state: PaymentState;
  createdAt: string;
  updatedAt: string;
}

const paymentRegistry = new Map<string, PaymentLedgerRecord>();

const ALLOWED_PAYMENT_TRANSITIONS: Record<PaymentState, readonly PaymentState[]> = {
  INITIALIZED: ['AUTHORIZED', 'CAPTURED', 'FAILED', 'VOIDED'],
  AUTHORIZED: ['CAPTURED', 'VOIDED', 'FAILED'],
  CAPTURED: ['SETTLED', 'REFUND_REQUESTED', 'PARTIALLY_REFUNDED', 'REFUNDED'],
  SETTLED: ['REFUND_REQUESTED', 'PARTIALLY_REFUNDED', 'REFUNDED'],
  REFUND_REQUESTED: ['PARTIALLY_REFUNDED', 'REFUNDED', 'CAPTURED', 'SETTLED'], // Fallback if refund fails
  PARTIALLY_REFUNDED: ['PARTIALLY_REFUNDED', 'REFUNDED'],
  REFUNDED: [],
  FAILED: [],
  VOIDED: [],
};

export class PaymentStateMachine {
  /**
   * Initializes a new payment record in the ledger.
   */
  public static createPayment(
    paymentId: string,
    orderId: string,
    gateway: string,
    gatewayOrderId: string,
    amountMinor: number,
    currency = 'USD'
  ): PaymentLedgerRecord {
    if (amountMinor <= 0) {
      throw new Error(`Financial invariant violation: Payment amount must be > 0. Got: ${amountMinor}`);
    }

    const record: PaymentLedgerRecord = {
      paymentId,
      orderId,
      gateway,
      gatewayOrderId,
      amountMinor,
      refundedMinor: 0,
      currency,
      state: 'INITIALIZED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    paymentRegistry.set(paymentId, record);
    return record;
  }

  /**
   * Captures an authorized or initialized payment.
   */
  public static async capture(
    paymentId: string,
    gatewayPaymentId: string,
    correlationId: string
  ): Promise<{ success: boolean; record?: PaymentLedgerRecord; error?: string }> {
    const record = paymentRegistry.get(paymentId);
    if (!record) return { success: false, error: `Payment ${paymentId} not found` };

    const allowed = ALLOWED_PAYMENT_TRANSITIONS[record.state];
    if (!allowed.includes('CAPTURED')) {
      return {
        success: false,
        error: `Cannot CAPTURE payment in state ${record.state}`,
      };
    }

    record.state = 'CAPTURED';
    record.gatewayPaymentId = gatewayPaymentId;
    record.updatedAt = new Date().toISOString();

    await appendAuditEvent({
      type: 'PAYMENT_CAPTURED',
      ref: paymentId,
      details: `Payment ${paymentId} CAPTURED (${record.amountMinor} ${record.currency})`,
      meta: { paymentId, gatewayPaymentId, correlationId, amountMinor: record.amountMinor },
    });

    return { success: true, record };
  }

  /**
   * Processes a refund with strict invariant that total refunds can never exceed captured amount.
   */
  public static async refund(
    paymentId: string,
    refundAmountMinor: number,
    reason: string,
    correlationId: string
  ): Promise<{ success: boolean; record?: PaymentLedgerRecord; error?: string }> {
    const record = paymentRegistry.get(paymentId);
    if (!record) return { success: false, error: `Payment ${paymentId} not found` };

    if (record.state !== 'CAPTURED' && record.state !== 'SETTLED' && record.state !== 'PARTIALLY_REFUNDED') {
      return { success: false, error: `Cannot refund payment in state ${record.state}` };
    }

    const newRefundTotal = record.refundedMinor + refundAmountMinor;
    if (newRefundTotal > record.amountMinor) {
      const errorMsg = `Financial Invariant Violation: Refund total (${newRefundTotal}) would exceed captured amount (${record.amountMinor})`;
      
      await appendAuditEvent({
        type: 'REFUND_INVARIANT_BREACH_PREVENTED',
        ref: paymentId,
        details: errorMsg,
        meta: { paymentId, attemptedRefund: refundAmountMinor, currentRefunded: record.refundedMinor, totalAmount: record.amountMinor },
      });

      return { success: false, error: errorMsg };
    }

    record.refundedMinor = newRefundTotal;
    record.state = newRefundTotal === record.amountMinor ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    record.updatedAt = new Date().toISOString();

    await appendAuditEvent({
      type: record.state === 'REFUNDED' ? 'PAYMENT_FULLY_REFUNDED' : 'PAYMENT_PARTIALLY_REFUNDED',
      ref: paymentId,
      details: `Refund of ${refundAmountMinor} ${record.currency} executed. Total refunded: ${newRefundTotal}/${record.amountMinor}. Reason: ${reason}`,
      meta: { paymentId, refundAmountMinor, totalRefunded: newRefundTotal, correlationId },
    });

    return { success: true, record };
  }

  public static getPayment(paymentId: string): PaymentLedgerRecord | null {
    return paymentRegistry.get(paymentId) || null;
  }
}
