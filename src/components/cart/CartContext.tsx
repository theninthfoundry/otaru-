"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Cart } from "@/types/shopify";
import { mockCreateCart } from "@/lib/mock-data";
import { addToCartAction } from "@/actions/cart";

interface CartContextValue {
  cart: Cart;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  isPending: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => mockCreateCart());
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isPending, setPending] = useState(false);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      setPending(true);
      try {
        const result = await addToCartAction(cart.id, merchandiseId, quantity);
        if (result.success) {
          // Optimistic local update — swap for real cart re-fetch once
          // Shopify credentials are live and addCartLine returns full cart state.
          setCart((prev) => ({ ...prev, totalQuantity: prev.totalQuantity + quantity }));
          setDrawerOpen(true);
        }
      } finally {
        setPending(false);
      }
    },
    [cart.id]
  );

  const value = useMemo(
    () => ({
      cart,
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      isPending,
    }),
    [cart, isDrawerOpen, addItem, isPending]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
