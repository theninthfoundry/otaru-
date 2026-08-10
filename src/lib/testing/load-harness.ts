import { reserveInventoryItem } from './inventory-lock';

export interface LoadTestSummary {
  totalRequests: number;
  successCount: number;
  outOfStockCount: number;
  errorCount: number;
  durationMs: number;
}

export async function simulateConcurrentCheckouts(
  variantId: string,
  virtualUsers = 100,
): Promise<LoadTestSummary> {
  const startTime = Date.now();

  const requests = Array.from({ length: virtualUsers }).map(async () => {
    try {
      const res = await reserveInventoryItem(variantId, 1);
      return res;
    } catch {
      return { success: false, remainingStock: 0, error: 'LOCK_TIMEOUT' as const };
    }
  });

  const results = await Promise.all(requests);
  const durationMs = Date.now() - startTime;

  let successCount = 0;
  let outOfStockCount = 0;
  let errorCount = 0;

  for (const r of results) {
    if (r.success) {
      successCount++;
    } else if (r.error === 'OUT_OF_STOCK') {
      outOfStockCount++;
    } else {
      errorCount++;
    }
  }

  return {
    totalRequests: virtualUsers,
    successCount,
    outOfStockCount,
    errorCount,
    durationMs,
  };
}
