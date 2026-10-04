/**
 * OTARU INVENTORY CONCURRENCY GUARD
 * Enforces atomic reservation guarantees under high-concurrency drop conditions.
 * Prevents overselling when hundreds of collectors attempt to acquire the same limited garment.
 */

export interface ReservationAttempt {
  variantId: string;
  cartId: string;
  quantity: number;
}

export interface ReservationResult {
  success: boolean;
  reservationId?: string;
  remainingStock: number;
  reason?: 'INSUFFICIENT_STOCK' | 'INVALID_QUANTITY';
}

export class AtomicInventoryManager {
  private stockMap: Map<string, number> = new Map();
  private locks: Map<string, Promise<void>> = new Map();

  constructor(initialStock: Record<string, number> = {}) {
    for (const [variantId, count] of Object.entries(initialStock)) {
      this.stockMap.set(variantId, count);
    }
  }

  /**
   * Acquires a mutex lock for a specific variant to serialize reservations.
   * Mirrors Redis atomic SETNX / PostgreSQL SELECT FOR UPDATE row-level lock.
   */
  private async acquireLock(variantId: string): Promise<() => void> {
    while (this.locks.has(variantId)) {
      await this.locks.get(variantId);
    }

    let releaseLock!: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = () => {
        this.locks.delete(variantId);
        resolve();
      };
    });

    this.locks.set(variantId, lockPromise);
    return releaseLock;
  }

  /**
   * Executes an atomic reservation.
   * Guarantees that available stock never goes below zero.
   */
  async reserve(attempt: ReservationAttempt): Promise<ReservationResult> {
    if (attempt.quantity <= 0) {
      return { success: false, remainingStock: 0, reason: 'INVALID_QUANTITY' };
    }

    const unlock = await this.acquireLock(attempt.variantId);
    try {
      const currentStock = this.stockMap.get(attempt.variantId) ?? 0;

      if (currentStock < attempt.quantity) {
        return {
          success: false,
          remainingStock: currentStock,
          reason: 'INSUFFICIENT_STOCK',
        };
      }

      const updatedStock = currentStock - attempt.quantity;
      this.stockMap.set(attempt.variantId, updatedStock);

      return {
        success: true,
        reservationId: `res_${attempt.cartId}_${Date.now()}`,
        remainingStock: updatedStock,
      };
    } finally {
      unlock();
    }
  }

  getStock(variantId: string): number {
    return this.stockMap.get(variantId) ?? 0;
  }
}
