'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { CartContextProvider } from './cart-context';
import type { Cart } from '@/lib/shopify/types';
import { reshapeCart } from '@/lib/shopify/mappers';
import { getCart } from '@/lib/shopify/queries/cart';

const CART_ID_KEY = 'otaru-cart-id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [initialCart, setInitialCart] = useState<Cart | null>(null);

  useEffect(() => {
    async function loadCart() {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;

      try {
        const rawCart = await getCart(cartId);
        if (rawCart) {
          setInitialCart(reshapeCart(rawCart));
        } else {
          localStorage.removeItem(CART_ID_KEY);
        }
      } catch {
        localStorage.removeItem(CART_ID_KEY);
      }
    }

    loadCart();
  }, []);

  return (
    <CartContextProvider initialCart={initialCart}>
      {children}
    </CartContextProvider>
  );
}

export function saveCartId(cartId: string) {
  localStorage.setItem(CART_ID_KEY, cartId);
}

export function clearCartId() {
  localStorage.removeItem(CART_ID_KEY);
}
