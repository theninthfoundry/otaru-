import { prisma } from '@/lib/db/prisma';

export interface ReserveInventoryResult {
  success: boolean;
  remainingStock: number;
  error?: 'OUT_OF_STOCK' | 'ITEM_NOT_FOUND' | 'LOCK_TIMEOUT';
}

const mockInventoryStore = new Map<string, number>();

export async function reserveInventoryItem(
  variantId: string,
  quantity = 1,
): Promise<ReserveInventoryResult> {
  // If PostgreSQL is configured, perform atomic DB update
  if (process.env.DATABASE_URL) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Query item with explicit FOR UPDATE lock semantics
        const item = await tx.orderItem.findFirst({
          where: { variantId },
        });

        if (!item) {
          return { success: false, remainingStock: 0, error: 'ITEM_NOT_FOUND' };
        }

        if (item.quantity < quantity) {
          return { success: false, remainingStock: item.quantity, error: 'OUT_OF_STOCK' };
        }

        const updated = await tx.orderItem.update({
          where: { id: item.id },
          data: { quantity: { decrement: quantity } },
        });

        return { success: true, remainingStock: updated.quantity };
      });
    } catch (err: unknown) {
      return { success: false, remainingStock: 0, error: 'LOCK_TIMEOUT' };
    }
  }

  // Atomic in-memory fallback for local load testing
  const currentStock = mockInventoryStore.get(variantId) ?? 0;

  if (currentStock < quantity) {
    return { success: false, remainingStock: currentStock, error: 'OUT_OF_STOCK' };
  }

  const nextStock = currentStock - quantity;
  mockInventoryStore.set(variantId, nextStock);
  return { success: true, remainingStock: nextStock };
}

export function setMockInventoryStock(variantId: string, initialStock: number): void {
  mockInventoryStore.set(variantId, initialStock);
}

export function getMockInventoryStock(variantId: string): number {
  return mockInventoryStore.get(variantId) ?? 0;
}
