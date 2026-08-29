/**
 * Cart domain types.
 * -----------------------------------------------------------------
 * `CartLine.unitPriceCents` and `subtotalCents` are always the value
 * the SERVER computed, not anything the client sent — see cart-context.tsx
 * and app/api/cart/route.ts. The client only ever displays these numbers;
 * it never derives them from a client-held price.
 */

export type CartLine = {
  lineId: string; // server-generated, stable across quantity updates
  artifactId: string;
  variantId: string | null; // size/colorway, if the artifact has variants
  name: string;
  variantLabel: string | null; // e.g. "Size M"
  quantity: number;
  unitPriceCents: number; // authoritative price at time of add, in the cart's currency
  imageLabel: string; // placeholder label until real art is wired in
  maxQuantity: number; // server's current stock ceiling for this line, for the stepper
};

export type Cart = {
  id: string;
  currency: string; // ISO 4217, e.g. "USD"
  lines: CartLine[];
  subtotalCents: number; // sum of line totals, computed server-side
  updatedAt: string; // ISO timestamp
};

export type CartMutationResult =
  | { ok: true; cart: Cart }
  | { ok: false; error: string; cart: Cart | null }; // cart included when we can still show a valid last-known state
