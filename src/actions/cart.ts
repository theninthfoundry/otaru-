"use server";

import { addCartLine, createCart } from "@/lib/shopify";
import type { CartActionResult } from "@/types/cart";

export async function addToCartAction(
  cartId: string | null,
  merchandiseId: string,
  quantity: number
): Promise<CartActionResult> {
  try {
    const cart = cartId ? await addCartLine(cartId, merchandiseId, quantity) : await createCart();
    return { success: true, cartId: cart.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to add to bag." };
  }
}
