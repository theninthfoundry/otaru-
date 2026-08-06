'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import {
  createCart,
  addToCart,
  removeFromCart,
  updateCart,
} from '@/lib/shopify/mutations/cart';

const CART_COOKIE = 'otaru-cart-id';

/**
 * Get or create a cart, then add an item.
 */
export async function addItem(
  variantId: string,
  quantity: number = 1,
) {
  try {
    const cookieStore = await cookies();
    let cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) {
      // Create a new cart with the item
      const cart = await createCart([{ merchandiseId: variantId, quantity }]);
      cartId = cart.id;
      cookieStore.set(CART_COOKIE, cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
    }

    revalidateTag('cart');
  } catch (error) {
    console.warn('[Cart Action] Error in addItem action:', (error as Error).message);
  }
}

/**
 * Remove an item from the cart.
 */
export async function removeItem(lineId: string) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) return;

    await removeFromCart(cartId, [lineId]);
    revalidateTag('cart');
  } catch (error) {
    console.warn('[Cart Action] Error in removeItem action:', (error as Error).message);
  }
}

/**
 * Update quantity of a line item.
 */
export async function updateItemQuantity(
  lineId: string,
  merchandiseId: string,
  quantity: number,
) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) return;

    if (quantity <= 0) {
      await removeFromCart(cartId, [lineId]);
    } else {
      await updateCart(cartId, [
        { id: lineId, merchandiseId, quantity },
      ]);
    }

    revalidateTag('cart');
  } catch (error) {
    console.warn('[Cart Action] Error in updateItemQuantity action:', (error as Error).message);
  }
}

/**
 * Get the checkout URL for the current cart.
 */
export async function getCheckoutUrl(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) return null;

    const { getCart } = await import('@/lib/shopify/queries/cart');
    const cart = await getCart(cartId);

    return cart?.checkoutUrl ?? null;
  } catch (error) {
    console.warn('[Cart Action] Error fetching checkout URL:', (error as Error).message);
    return null;
  }
}
