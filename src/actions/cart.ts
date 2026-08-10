'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import {
  createCart,
  addToCart,
  removeFromCart,
  updateCart,
} from '@/lib/shopify/mutations/cart';
import { getCart } from '@/lib/shopify/queries/cart';

const CART_COOKIE = 'otaru-cart-id';

export async function addItem(
  variantId: string,
  quantity: number = 1,
) {
  try {
    const cookieStore = await cookies();
    let cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) {
      const cart = await createCart([{ merchandiseId: variantId, quantity }]);
      cartId = cart.id;
      cookieStore.set(CART_COOKIE, cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    } else {
      await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
    }

    revalidateTag('cart');
  } catch (error) {
    console.warn('[Cart Action] Error in addItem action:', (error as Error).message);
  }
}

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

export async function getCheckoutUrl(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) return null;

    const cart = await getCart(cartId);

    return cart?.checkoutUrl ?? null;
  } catch (error) {
    console.warn('[Cart Action] Error fetching checkout URL:', (error as Error).message);
    return null;
  }
}

export async function getCartAction(cartId: string): Promise<any> {
  try {
    const cart = await getCart(cartId);
    return cart ? { success: true, cart } : { success: false, error: 'Cart not found.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to load bag.' };
  }
}

export async function addToCartAction(
  cartId: string | null,
  merchandiseId: string,
  quantity: number
): Promise<any> {
  try {
    let cart;
    if (!cartId) {
      cart = await createCart([{ merchandiseId: merchandiseId, quantity }]);
    } else {
      await addToCart(cartId, [{ merchandiseId: merchandiseId, quantity }]);
      cart = await getCart(cartId);
    }
    return { success: true, cart };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add to bag.' };
  }
}

export async function updateCartLineAction(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<any> {
  try {
    if (quantity <= 0) {
      await removeFromCart(cartId, [lineId]);
    } else {
      await updateCart(cartId, [{ id: lineId, quantity }]);
    }
    const cart = await getCart(cartId);
    return { success: true, cart };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update bag.' };
  }
}

export async function removeCartLineAction(
  cartId: string,
  lineId: string
): Promise<any> {
  try {
    await removeFromCart(cartId, [lineId]);
    const cart = await getCart(cartId);
    return { success: true, cart };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to remove item.' };
  }
}

