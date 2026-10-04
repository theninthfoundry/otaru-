/**
 * OTARU CHECKOUT SNAPSHOT SERVICE
 * Freezes the commercial state of an order at the instant checkout initiates.
 * Guarantees that catalog price changes or promotions never mutate an in-flight checkout.
 */

import { PricingBreakdown } from '../catalog/pricing-engine';

export interface SnapshotItem {
  productId: string;
  variantSku: string;
  name: string;
  size: string;
  unitPriceMinor: number;
  quantity: number;
  totalPriceMinor: number;
}

export interface DeliveryAddressSnapshot {
  recipientName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface CheckoutSnapshot {
  idempotencyKey: string;
  timestamp: string;
  customerEmail: string;
  financials: PricingBreakdown;
  items: SnapshotItem[];
  deliveryAddress?: DeliveryAddressSnapshot;
  clientMetadata?: Record<string, unknown>;
}

/**
 * Creates an immutable snapshot payload ready for database persistence.
 */
export function createCheckoutSnapshot(
  idempotencyKey: string,
  customerEmail: string,
  items: SnapshotItem[],
  financials: PricingBreakdown,
  deliveryAddress?: DeliveryAddressSnapshot,
  clientMetadata?: Record<string, unknown>
): CheckoutSnapshot {
  return {
    idempotencyKey,
    timestamp: new Date().toISOString(),
    customerEmail,
    financials,
    items,
    deliveryAddress,
    clientMetadata,
  };
}

/**
 * Verifies that a persisted snapshot matches expected mathematical invariants.
 */
export function validateSnapshotIntegrity(snapshot: CheckoutSnapshot): boolean {
  let calculatedSubtotal = 0;
  for (const item of snapshot.items) {
    if (item.totalPriceMinor !== item.unitPriceMinor * item.quantity) {
      return false;
    }
    calculatedSubtotal += item.totalPriceMinor;
  }

  if (calculatedSubtotal !== snapshot.financials.subtotalMinor) {
    return false;
  }

  const expectedTotal =
    snapshot.financials.subtotalMinor +
    snapshot.financials.shippingMinor +
    snapshot.financials.taxMinor;

  return expectedTotal === snapshot.financials.totalMinor;
}
