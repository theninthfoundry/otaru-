import { describe, it, expect } from 'vitest';
import { setMockInventoryStock, getMockInventoryStock } from '@/lib/testing/inventory-lock';
import { simulateConcurrentCheckouts } from '@/lib/testing/load-harness';

describe('Phase 5 — High-Concurrency Drop Load Testing & Contention Suite', () => {
  describe('1. The Last-Item Race Condition', () => {
    it('proves that out of 1,000 concurrent checkouts targeting inventory = 1, exactly 1 succeeds and 999 fail safely', async () => {
      const variantId = 'variant_LIMITED_SELVEDGE_001';
      setMockInventoryStock(variantId, 1);

      const summary = await simulateConcurrentCheckouts(variantId, 1000);

      expect(summary.totalRequests).toBe(1000);
      expect(summary.successCount).toBe(1);
      expect(summary.outOfStockCount).toBe(999);
      expect(summary.errorCount).toBe(0);
      expect(getMockInventoryStock(variantId)).toBe(0);
    });

    it('handles batch inventory allocation correctly for multi-unit drops', async () => {
      const variantId = 'variant_LIMITED_CHORE_002';
      setMockInventoryStock(variantId, 50);

      const summary = await simulateConcurrentCheckouts(variantId, 500);

      expect(summary.totalRequests).toBe(500);
      expect(summary.successCount).toBe(50);
      expect(summary.outOfStockCount).toBe(450);
      expect(getMockInventoryStock(variantId)).toBe(0);
    });
  });
});
