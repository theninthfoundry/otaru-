/**
 * OTARU INVENTORY LEDGER
 * Double-entry movement system. Stock is not a raw integer, but the net sum
 * of all auditable movements:
 *
 *   Available = (RECEIVED + RETURNED) - (SOLD + RESERVED + DAMAGED)
 */

export type MovementType =
  | 'RECEIVED'
  | 'RESERVED'
  | 'RELEASED'
  | 'SOLD'
  | 'RETURNED'
  | 'DAMAGED';

export interface MovementRecord {
  id: string;
  type: MovementType;
  quantity: number;
  referenceId?: string; // cartId, orderId, returnId
  notes?: string;
  createdAt: string;
}

export interface InventoryLedgerSummary {
  receivedCount: number;
  reservedCount: number;
  releasedCount: number;
  soldCount: number;
  returnedCount: number;
  damagedCount: number;
  availableCount: number;
  onHandCount: number;
}

/**
 * Computes live available inventory from a stream of historical movements.
 */
export function computeInventoryBalances(movements: MovementRecord[]): InventoryLedgerSummary {
  let receivedCount = 0;
  let reservedCount = 0;
  let releasedCount = 0;
  let soldCount = 0;
  let returnedCount = 0;
  let damagedCount = 0;

  for (const m of movements) {
    switch (m.type) {
      case 'RECEIVED':
        receivedCount += m.quantity;
        break;
      case 'RESERVED':
        reservedCount += m.quantity;
        break;
      case 'RELEASED':
        releasedCount += m.quantity;
        break;
      case 'SOLD':
        soldCount += m.quantity;
        break;
      case 'RETURNED':
        returnedCount += m.quantity;
        break;
      case 'DAMAGED':
        damagedCount += m.quantity;
        break;
    }
  }

  // Active reservations = reserved - released - sold
  const activeReservations = Math.max(0, reservedCount - releasedCount - soldCount);
  
  // Total physical units in warehouse on hand = received + returned - sold - damaged
  const onHandCount = Math.max(0, (receivedCount + returnedCount) - (soldCount + damagedCount));
  
  // Units freely available for immediate customer purchase = onHand - activeReservations
  const availableCount = Math.max(0, onHandCount - activeReservations);

  return {
    receivedCount,
    reservedCount,
    releasedCount,
    soldCount,
    returnedCount,
    damagedCount,
    availableCount,
    onHandCount,
  };
}
