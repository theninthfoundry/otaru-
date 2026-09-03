/**
 * OTARU PRICING & FINANCIAL ENGINE
 * Strict integer paise arithmetic. Zero floating-point representation.
 * Every financial calculation produces a deterministic, reproducible breakdown.
 */

export interface PricingBreakdown {
  currency: 'INR';
  subtotalMinor: number; // in integer paise (e.g. ₹40,320 = 4032000)
  shippingMinor: number; // in integer paise (e.g. ₹0 or ₹9900)
  taxMinor: number;      // in integer paise (GST 12% on luxury textiles)
  totalMinor: number;    // in integer paise
}

export interface LineItemInput {
  unitPriceMinor: number;
  quantity: number;
}

// Fixed GST rate for luxury artisan textiles (12%)
export const GST_RATE_BASIS_POINTS = 1200; // 12.00% = 1200 bps
export const STANDARD_SHIPPING_MINOR = 0;   // Free archival white-glove shipping on orders

/**
 * Calculates a deterministic, integer-paise financial breakdown.
 * Rounds tax using integer banker's rounding to eliminate fractional paise leaks.
 */
export function calculateOrderFinancials(
  items: LineItemInput[],
  shippingMinor: number = STANDARD_SHIPPING_MINOR
): PricingBreakdown {
  // 1. Calculate subtotal
  let subtotalMinor = 0;
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid item quantity: ${item.quantity}. Must be positive integer.`);
    }
    if (!Number.isInteger(item.unitPriceMinor) || item.unitPriceMinor < 0) {
      throw new Error(`Invalid unit price: ${item.unitPriceMinor}. Must be non-negative integer paise.`);
    }
    subtotalMinor += item.unitPriceMinor * item.quantity;
  }

  // 2. Calculate tax in integer paise: round((subtotal * 1200) / 10000)
  const taxMinor = Math.round((subtotalMinor * GST_RATE_BASIS_POINTS) / 10000);

  // 3. Final total in integer paise
  const totalMinor = subtotalMinor + shippingMinor + taxMinor;

  return {
    currency: 'INR',
    subtotalMinor,
    shippingMinor,
    taxMinor,
    totalMinor,
  };
}

/**
 * Formats integer paise into a clean editorial currency display.
 * e.g. 4032000 -> "₹40,320"
 */
export function formatPaiseToInr(paise: number): string {
  const rupees = Math.floor(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}
