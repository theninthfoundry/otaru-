"use client";

import { create } from "zustand";
import type { Cart } from "@/types/shopify";
import { mockCreateCart } from "@/lib/shopify/mocks";
import { addToCartAction, getCartAction, removeCartLineAction, updateCartLineAction } from "@/actions/cart";

const CART_ID_STORAGE_KEY = "otaru:cart-id";

interface CartStore {
  cart: Cart;
  isDrawerOpen: boolean;
  isPending: boolean;
  error: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  hydrate: () => Promise<void>;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

/**
 * Cart state lives in zustand rather than React Context so it can be read
 * outside the component tree (e.g. from a future analytics layer) and so
 * updates don't re-render the whole provider subtree. The Shopify cart ID
 * persists in localStorage — swap for a signed cookie if SSR-rendered cart
 * counts become necessary.
 */
export const useCartStore = create<CartStore>((set, get) => ({
  cart: mockCreateCart(),
  isDrawerOpen: false,
  isPending: false,
  error: null,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  hydrate: async () => {
    if (typeof window === "undefined") return;
    const storedId = window.localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!storedId) return;

    const result = await getCartAction(storedId);
    if (result.success && result.cart) {
      set({ cart: result.cart });
    } else {
      window.localStorage.removeItem(CART_ID_STORAGE_KEY);
    }
  },

  addItem: async (merchandiseId, quantity = 1) => {
    set({ isPending: true, error: null });
    const { cart } = get();
    const result = await addToCartAction(cart.id.startsWith("gid://mock") ? null : cart.id, merchandiseId, quantity);

    if (result.success && result.cart) {
      window.localStorage.setItem(CART_ID_STORAGE_KEY, result.cart.id);
      set({ cart: result.cart, isDrawerOpen: true, isPending: false });
    } else {
      set({ error: result.error ?? "Failed to add to bag.", isPending: false });
    }
  },

  updateItem: async (lineId, quantity) => {
    set({ isPending: true, error: null });
    const { cart } = get();
    const result = await updateCartLineAction(cart.id, lineId, quantity);
    if (result.success && result.cart) {
      set({ cart: result.cart, isPending: false });
    } else {
      set({ error: result.error ?? "Failed to update bag.", isPending: false });
    }
  },

  removeItem: async (lineId) => {
    set({ isPending: true, error: null });
    const { cart } = get();
    const result = await removeCartLineAction(cart.id, lineId);
    if (result.success && result.cart) {
      set({ cart: result.cart, isPending: false });
    } else {
      set({ error: result.error ?? "Failed to remove item.", isPending: false });
    }
  },
}));
