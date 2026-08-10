"use server";

import { addCartLine, createCart, getCart, removeCartLine, updateCartLine } from "@/lib/shopify";
import type { Cart } from "@/types/shopify";

interface CartActionResult {
  success: boolean;
  cart?: Cart;
  error?: string;
}

export async function getCartAction(cartId: string): Promise<CartActionResult> {
  try {
    const cart = await getCart(cartId);
    return cart ? { success: true, cart } : { success: false, error: "Cart not found." };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load bag." };
  }
}

export async function addToCartAction(
  cartId: string | null,
  merchandiseId: string,
  quantity: number
): Promise<CartActionResult> {
  try {
    const cart = cartId ? await addCartLine(cartId, merchandiseId, quantity) : await createCart(merchandiseId, quantity);
    return { success: true, cart };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to add to bag." };
  }
}

export async function updateCartLineAction(cartId: string, lineId: string, quantity: number): Promise<CartActionResult> {
  try {
    const cart = await updateCartLine(cartId, lineId, quantity);
    return { success: true, cart };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update bag." };
  }
}

export async function removeCartLineAction(cartId: string, lineId: string): Promise<CartActionResult> {
  try {
    const cart = await removeCartLine(cartId, lineId);
    return { success: true, cart };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to remove item." };
  }
}
