import { describe, it, expect } from 'vitest';
import { transitionOrderState, transitionPaymentState, transitionInventoryState, InvalidStateTransitionError } from '@/lib/commerce/state-machine';
import { executeDropRehearsal } from '@/lib/testing/drop-rehearsal';
import { runProductionVerification } from '@/lib/testing/production-verifier';

describe('Production Readiness & Drop Rehearsal Gate', () => {
  describe('1. Explicit Commerce State Machine Transitions', () => {
    it('allows valid order state transitions (PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED)', () => {
      expect(transitionOrderState('PENDING', 'CONFIRMED')).toBe('CONFIRMED');
      expect(transitionOrderState('CONFIRMED', 'PROCESSING')).toBe('PROCESSING');
      expect(transitionOrderState('PROCESSING', 'SHIPPED')).toBe('SHIPPED');
      expect(transitionOrderState('SHIPPED', 'DELIVERED')).toBe('DELIVERED');
    });

    it('rejects invalid order state transitions (DELIVERED -> PENDING)', () => {
      expect(() => transitionOrderState('DELIVERED', 'PENDING')).toThrow(InvalidStateTransitionError);
    });

    it('allows valid inventory state transitions (AVAILABLE -> RESERVED -> SOLD)', () => {
      expect(transitionInventoryState('AVAILABLE', 'RESERVED')).toBe('RESERVED');
      expect(transitionInventoryState('RESERVED', 'SOLD')).toBe('SOLD');
      expect(transitionInventoryState('RESERVED', 'AVAILABLE')).toBe('AVAILABLE');
    });
  });

  describe('2. Drop Rehearsal Engine Execution', () => {
    it('executes 1,000-user drop simulation without overselling inventory', async () => {
      const metrics = await executeDropRehearsal({
        dropSlug: 'chapter-004-selvage',
        initialStock: 10,
        simulatedVisitors: 1000,
      });

      expect(metrics.totalVisitors).toBe(1000);
      expect(metrics.successfulPayments).toBe(10);
      expect(metrics.oversoldInventoryCount).toBe(0);
      expect(metrics.duplicateOrdersCount).toBe(0);
    });
  });

  describe('3. Production Launch Gate Verification (npm run production:verify)', () => {
    it('asserts 10 zero-tolerance production invariants and returns PASS', async () => {
      const report = await runProductionVerification();

      expect(report.isReady).toBe(true);
      expect(report.criticalFailures).toBe(0);
      expect(report.invariants.oversoldInventory).toBe('PASS');
      expect(report.invariants.duplicateOrders).toBe('PASS');
      expect(report.invariants.auditChainCorruption).toBe('PASS');
    });
  });
});
