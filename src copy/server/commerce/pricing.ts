import 'server-only';
import { db } from '@/server/db';
import { env } from '@/server/env';

export class CheckoutError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

export const formatINR = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);

export interface CartLineInput {
  variantId: string;
  qty: number;
}

export interface PricedLine {
  variantId: string;
  sku: string;
  title: string;
  size: string;
  qty: number;
  unitPricePaise: number;
  linePaise: number;
}

export interface PricedCart {
  lines: PricedLine[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

/**
 * Server-side pricing. The client sends only (variantId, qty); every price,
 * title and limit comes from the database. Stock is NOT checked here — it is
 * enforced atomically at reservation time (orders.ts) to avoid check-then-act races.
 */
export async function priceCart(input: CartLineInput[]): Promise<PricedCart> {
  const merged = new Map<string, number>();
  for (const l of input) merged.set(l.variantId, (merged.get(l.variantId) ?? 0) + l.qty);

  const ids = [...merged.keys()].sort(); // stable order => stable lock order downstream
  const variants = await db.variant.findMany({ where: { id: { in: ids }, active: true } });
  if (variants.length !== ids.length) {
    throw new CheckoutError('variant_unavailable', 409, 'One or more items are no longer available.');
  }
  const byId = new Map(variants.map((v) => [v.id, v]));

  const lines: PricedLine[] = ids.map((id) => {
    const v = byId.get(id)!;
    const qty = merged.get(id)!;
    if (qty > v.maxPerOrder) {
      throw new CheckoutError('limit_exceeded', 422, `Limit of ${v.maxPerOrder} per order for ${v.title} (${v.size}).`);
    }
    return {
      variantId: v.id,
      sku: v.sku,
      title: v.title,
      size: v.size,
      qty,
      unitPricePaise: v.pricePaise,
      linePaise: v.pricePaise * qty,
    };
  });

  const e = env();
  const subtotalPaise = lines.reduce((s, l) => s + l.linePaise, 0);
  const free = e.FREE_SHIPPING_THRESHOLD_PAISE > 0 && subtotalPaise >= e.FREE_SHIPPING_THRESHOLD_PAISE;
  const shippingPaise = free ? 0 : e.SHIPPING_FLAT_PAISE;
  return { lines, subtotalPaise, shippingPaise, totalPaise: subtotalPaise + shippingPaise };
}
