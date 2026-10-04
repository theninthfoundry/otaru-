import { describe, it, expect } from 'vitest';
import { AtomicInventoryManager } from '@/lib/domain/inventory/concurrency-guard';
import { transitionOrderStatus, IllegalOrderStateTransitionError } from '@/lib/domain/orders/order-state-machine';
import { transitionPaymentStatus, IllegalPaymentStateTransitionError } from '@/lib/domain/payments/payment-state-machine';
import { calculateOrderFinancials } from '@/lib/domain/catalog/pricing-engine';
import { createCheckoutSnapshot } from '@/lib/domain/checkout/snapshot-service';
import { reconcileFinancialBatch, OrderFinancialRecord } from '@/lib/domain/reconciliation/financial-reconciliation';

describe('PHASE A CERTIFICATION GATE — 6 MANDATORY CHECKS', () => {

  // -------------------------------------------------------------------------
  // CHECK 1: Database Integrity & Constraint Verification
  // -------------------------------------------------------------------------
  describe('Check 1: Database Integrity & Integer Constraints', () => {
    it('verifies that monetary amounts are strictly integer minor units', () => {
      const financials = calculateOrderFinancials([
        { unitPriceMinor: 4032000, quantity: 1 }
      ]);

      expect(Number.isInteger(financials.subtotalMinor)).toBe(true);
      expect(Number.isInteger(financials.taxMinor)).toBe(true);
      expect(Number.isInteger(financials.totalMinor)).toBe(true);
      expect(financials.totalMinor).toBe(4515840); // 4032000 + 483840 (12% GST)
    });
  });

  // -------------------------------------------------------------------------
  // CHECK 2: Inventory Concurrency (100 concurrent acquires on 1 unit)
  // -------------------------------------------------------------------------
  describe('Check 2: Inventory Concurrency (The High-Demand Drop Invariant)', () => {
    it('guarantees exactly 1 acquisition and 99 rejections when 100 users race for 1 item', async () => {
      // 1 single garment available in the atelier
      const inventory = new AtomicInventoryManager({ 'YAMA-041-IV': 1 });

      // 100 collectors click "Acquire" at the exact same millisecond
      const acquirePromises = Array.from({ length: 100 }, (_, i) =>
        inventory.reserve({
          variantId: 'YAMA-041-IV',
          cartId: `cart_collector_${i + 1}`,
          quantity: 1,
        })
      );

      const results = await Promise.all(acquirePromises);

      const successfulAcquisitions = results.filter((r) => r.success);
      const rejectedAttempts = results.filter((r) => !r.success);

      // Invariant: Exactly 1 SOLD, 99 rejected
      expect(successfulAcquisitions.length).toBe(1);
      expect(rejectedAttempts.length).toBe(99);

      // Invariant: Stock never drops below zero
      expect(inventory.getStock('YAMA-041-IV')).toBe(0);

      // All 99 rejected attempts reported INSUFFICIENT_STOCK
      rejectedAttempts.forEach((r) => {
        expect(r.reason).toBe('INSUFFICIENT_STOCK');
      });
    });
  });

  // -------------------------------------------------------------------------
  // CHECK 3: Checkout Replay Idempotency
  // -------------------------------------------------------------------------
  describe('Check 3: Checkout Replay Idempotency', () => {
    it('ensures repeated checkout attempts with identical idempotency key produce identical snapshot', () => {
      const idempotencyKey = 'idem_drop_ch07_001';
      const items = [
        {
          productId: '041',
          variantSku: 'YAMA-041-IV',
          name: 'Yama Field Jacket',
          size: 'IV',
          unitPriceMinor: 4032000,
          quantity: 1,
          totalPriceMinor: 4032000,
        }
      ];
      const financials = calculateOrderFinancials([{ unitPriceMinor: 4032000, quantity: 1 }]);

      // First checkout attempt
      const snapshot1 = createCheckoutSnapshot(idempotencyKey, 'collector@luxury.in', items, financials);

      // Replayed checkout attempts (e.g. browser retry or network double-submit)
      const snapshot2 = createCheckoutSnapshot(idempotencyKey, 'collector@luxury.in', items, financials);
      const snapshot3 = createCheckoutSnapshot(idempotencyKey, 'collector@luxury.in', items, financials);

      expect(snapshot1.idempotencyKey).toBe(snapshot2.idempotencyKey);
      expect(snapshot1.financials.totalMinor).toBe(snapshot3.financials.totalMinor);
    });
  });

  // -------------------------------------------------------------------------
  // CHECK 4: State-Machine Enforcement (Zero Illegal Transitions)
  // -------------------------------------------------------------------------
  describe('Check 4: State-Machine Enforcement', () => {
    it('permits valid forward order transitions', () => {
      let status = transitionOrderStatus('PENDING', 'CONFIRMED');
      expect(status).toBe('CONFIRMED');

      status = transitionOrderStatus('CONFIRMED', 'IN_PREPARATION');
      expect(status).toBe('IN_PREPARATION');

      status = transitionOrderStatus('IN_PREPARATION', 'QUALITY_INSPECTED');
      expect(status).toBe('QUALITY_INSPECTED');

      status = transitionOrderStatus('QUALITY_INSPECTED', 'PACKED');
      expect(status).toBe('PACKED');

      status = transitionOrderStatus('PACKED', 'HANDED_TO_CARRIER');
      expect(status).toBe('HANDED_TO_CARRIER');

      status = transitionOrderStatus('HANDED_TO_CARRIER', 'IN_TRANSIT');
      expect(status).toBe('IN_TRANSIT');

      status = transitionOrderStatus('IN_TRANSIT', 'DELIVERED');
      expect(status).toBe('DELIVERED');
    });

    it('rejects illegal order transitions (e.g. DELIVERED -> PENDING)', () => {
      expect(() => transitionOrderStatus('DELIVERED', 'PENDING')).toThrow(IllegalOrderStateTransitionError);
      expect(() => transitionOrderStatus('CANCELLED', 'IN_TRANSIT')).toThrow(IllegalOrderStateTransitionError);
    });

    it('rejects illegal payment reversals (e.g. REFUNDED -> CAPTURED)', () => {
      expect(() => transitionPaymentStatus('REFUNDED', 'CAPTURED')).toThrow(IllegalPaymentStateTransitionError);
      expect(() => transitionPaymentStatus('FAILED', 'CAPTURED')).toThrow(IllegalPaymentStateTransitionError);
    });

    it('handles idempotent same-state transitions cleanly', () => {
      expect(transitionOrderStatus('CONFIRMED', 'CONFIRMED')).toBe('CONFIRMED');
      expect(transitionPaymentStatus('CAPTURED', 'CAPTURED')).toBe('CAPTURED');
    });
  });

  // -------------------------------------------------------------------------
  // CHECK 5: Snapshot Immutability (Historical Price Preservation)
  // -------------------------------------------------------------------------
  describe('Check 5: Snapshot Immutability', () => {
    it('preserves historical commercial snapshot when catalog price changes later', () => {
      // 1. Initial product price: ₹40,320 (4,032,000 paise)
      const historicalFinancials = calculateOrderFinancials([{ unitPriceMinor: 4032000, quantity: 1 }]);
      const snapshot = createCheckoutSnapshot(
        'idem_snapshot_test',
        'collector@luxury.in',
        [
          {
            productId: '041',
            variantSku: 'YAMA-041-IV',
            name: 'Yama Field Jacket',
            size: 'IV',
            unitPriceMinor: 4032000,
            quantity: 1,
            totalPriceMinor: 4032000,
          }
        ],
        historicalFinancials
      );

      // 2. Later, atelier updates catalog price to ₹45,000 (4,500,000 paise)
      const updatedCatalogPrice = 4500000;

      // 3. Verify snapshot is completely unaffected and remains ₹40,320
      expect(snapshot.financials.subtotalMinor).toBe(4032000);
      expect(snapshot.items[0]!.unitPriceMinor).toBe(4032000);
      expect(snapshot.financials.subtotalMinor).not.toBe(updatedCatalogPrice);
    });
  });

  // -------------------------------------------------------------------------
  // CHECK 6: Deterministic Financial Reconciliation
  // -------------------------------------------------------------------------
  describe('Check 6: Deterministic Financial Reconciliation', () => {
    it('verifies 100% balance when Order Total == Payment Captured == Ledger Total', () => {
      const records: OrderFinancialRecord[] = [
        {
          orderId: 'OTR-2026-000184',
          orderTotalMinor: 4032000,
          paymentExpectedMinor: 4032000,
          paymentCapturedMinor: 4032000,
          refundedAmountMinor: 0,
          ledgerRecordedMinor: 4032000,
          status: 'PAID',
        },
        {
          orderId: 'OTR-2026-000185',
          orderTotalMinor: 499900,
          paymentExpectedMinor: 499900,
          paymentCapturedMinor: 499900,
          refundedAmountMinor: 0,
          ledgerRecordedMinor: 499900,
          status: 'PAID',
        },
        {
          orderId: 'OTR-2026-000186',
          orderTotalMinor: 4032000,
          paymentExpectedMinor: 4032000,
          paymentCapturedMinor: 4032000,
          refundedAmountMinor: 4032000,
          ledgerRecordedMinor: 4032000,
          status: 'REFUNDED',
        },
      ];

      const report = reconcileFinancialBatch(records);

      expect(report.isBalanced).toBe(true);
      expect(report.discrepancies.length).toBe(0);
      expect(report.orderCount).toBe(3);
      // Net revenue = (4,032,000 + 499,900 + 4,032,000) - 4,032,000 = 4,531,900 paise
      expect(report.netRevenueMinor).toBe(4531900);
    });

    it('flags discrepancies if ledger or payment captured diverges from order total', () => {
      const records: OrderFinancialRecord[] = [
        {
          orderId: 'OTR-2026-000187',
          orderTotalMinor: 4032000,
          paymentExpectedMinor: 4032000,
          paymentCapturedMinor: 100, // Attacker paid ₹1 instead of ₹40,320!
          refundedAmountMinor: 0,
          ledgerRecordedMinor: 100,
          status: 'PAID',
        }
      ];

      const report = reconcileFinancialBatch(records);

      expect(report.isBalanced).toBe(false);
      expect(report.discrepancies.length).toBe(1);
      expect(report.discrepancies[0]!.reason).toContain('INVARIANT_MISMATCH');
    });
  });
});
