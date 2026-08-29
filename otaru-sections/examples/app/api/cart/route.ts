import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import type { Cart, CartLine } from "@/lib/types/cart";

/**
 * POST /api/cart
 * -----------------------------------------------------------------
 * Security shape this route is built around (directive sections 8 & 13):
 *   - The request body only ever carries an *intent* — artifactId,
 *     variantId, lineId, quantity. It never carries a price.
 *   - `getArtifactPriceAndStock()` is the single source of truth for
 *     price/stock. Swap its body for your real Prisma/Shopify lookup —
 *     do not accept a price from the client anywhere in this file.
 *   - The cart is identified by an httpOnly cookie, not a client-
 *     supplied cart id, so one session can't read or mutate another's cart.
 *   - Every mutation recomputes `subtotalCents` from the stored lines
 *     server-side after the edit — never incrementally trust a
 *     previously-cached subtotal.
 *
 * TODO before shipping:
 *   - Replace the in-memory `CARTS` map with your real store (DB row,
 *     Redis, or Shopify's own cart/checkout object) — this in-memory
 *     version resets on every server restart and won't work across
 *     multiple server instances.
 *   - Rate-limit this route; it's a mutation endpoint hit on every
 *     click of a quantity stepper.
 *   - Re-validate stock again at checkout initiation, not just here —
 *     stock can change between "added to cart" and "paid."
 */

const CART_COOKIE = "otaru_cart_id";

// --- Mock catalog lookup — replace with your real data layer --------------
async function getArtifactPriceAndStock(
  artifactId: string,
  variantId: string | null
): Promise<{ name: string; variantLabel: string | null; unitPriceCents: number; stock: number } | null> {
  const MOCK_CATALOG: Record<string, { name: string; unitPriceCents: number; stock: number }> = {
    "yama-field-jacket": { name: "Yama Field Jacket", unitPriceCents: 48000, stock: 6 },
    "kiryu-wrap-trouser": { name: "Kiryū Wrap Trouser", unitPriceCents: 31000, stock: 11 },
    "biratori-overshirt": { name: "Biratori Overshirt", unitPriceCents: 39500, stock: 0 }, // sold out
  };
  const item = MOCK_CATALOG[artifactId];
  if (!item) return null;
  return { ...item, variantLabel: variantId };
}

// --- Mock cart store — replace with your real persistence -----------------
const CARTS = new Map<string, Cart>();

function emptyCart(id: string): Cart {
  return { id, currency: "USD", lines: [], subtotalCents: 0, updatedAt: new Date().toISOString() };
}

function recompute(cart: Cart): Cart {
  return {
    ...cart,
    subtotalCents: cart.lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0),
    updatedAt: new Date().toISOString(),
  };
}

async function getOrCreateCartId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(CART_COOKIE, id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return id;
}

export async function GET() {
  const cartId = await getOrCreateCartId();
  const cart = CARTS.get(cartId) ?? emptyCart(cartId);
  return NextResponse.json({ ok: true, cart });
}

export async function POST(req: NextRequest) {
  const cartId = await getOrCreateCartId();
  let cart = CARTS.get(cartId) ?? emptyCart(cartId);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request.", cart }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || !("action" in body)) {
    return NextResponse.json({ ok: false, error: "Malformed request.", cart }, { status: 400 });
  }
  const { action } = body as { action: unknown };

  try {
    if (action === "add") {
      const { artifactId, variantId, quantity } = body as {
        artifactId?: unknown;
        variantId?: unknown;
        quantity?: unknown;
      };
      if (typeof artifactId !== "string" || (typeof quantity !== "number" && quantity !== undefined)) {
        return NextResponse.json({ ok: false, error: "Invalid item.", cart }, { status: 400 });
      }
      const qty = Math.max(1, Math.min(10, Number(quantity ?? 1))); // hard ceiling regardless of client input
      const item = await getArtifactPriceAndStock(artifactId, (variantId as string) ?? null);
      if (!item) return NextResponse.json({ ok: false, error: "That artifact no longer exists.", cart }, { status: 404 });
      if (item.stock <= 0) return NextResponse.json({ ok: false, error: "That artifact is sold out.", cart }, { status: 409 });

      const existingLine = cart.lines.find(
        (l) => l.artifactId === artifactId && l.variantId === ((variantId as string) ?? null)
      );
      if (existingLine) {
        existingLine.quantity = Math.min(existingLine.quantity + qty, item.stock);
        existingLine.maxQuantity = item.stock;
      } else {
        const newLine: CartLine = {
          lineId: randomUUID(),
          artifactId,
          variantId: (variantId as string) ?? null,
          name: item.name,
          variantLabel: item.variantLabel,
          quantity: Math.min(qty, item.stock),
          unitPriceCents: item.unitPriceCents, // server price — never from the request body
          imageLabel: item.name,
          maxQuantity: item.stock,
        };
        cart.lines.push(newLine);
      }
    } else if (action === "update") {
      const { lineId, quantity } = body as { lineId?: unknown; quantity?: unknown };
      if (typeof lineId !== "string" || typeof quantity !== "number") {
        return NextResponse.json({ ok: false, error: "Invalid update.", cart }, { status: 400 });
      }
      const line = cart.lines.find((l) => l.lineId === lineId);
      if (!line) return NextResponse.json({ ok: false, error: "That line isn't in your cart.", cart }, { status: 404 });

      if (quantity <= 0) {
        cart.lines = cart.lines.filter((l) => l.lineId !== lineId);
      } else {
        // Re-check stock at update time too — it may have changed since the item was added.
        const fresh = await getArtifactPriceAndStock(line.artifactId, line.variantId);
        const ceiling = fresh?.stock ?? line.maxQuantity;
        line.quantity = Math.max(1, Math.min(quantity, ceiling));
        line.maxQuantity = ceiling;
      }
    } else if (action === "remove") {
      const { lineId } = body as { lineId?: unknown };
      if (typeof lineId !== "string") {
        return NextResponse.json({ ok: false, error: "Invalid item.", cart }, { status: 400 });
      }
      cart.lines = cart.lines.filter((l) => l.lineId !== lineId);
    } else {
      return NextResponse.json({ ok: false, error: "Unknown cart action.", cart }, { status: 400 });
    }

    cart = recompute(cart);
    CARTS.set(cartId, cart);
    return NextResponse.json({ ok: true, cart });
  } catch {
    // Never leak internals (stack traces, query fragments) in the response — directive section 13.
    return NextResponse.json({ ok: false, error: "Something went wrong updating your cart.", cart }, { status: 500 });
  }
}
