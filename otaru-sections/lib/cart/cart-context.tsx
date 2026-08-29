"use client";

/**
 * CartProvider / useCart
 * -----------------------------------------------------------------
 * The rule this file exists to enforce: the client never computes a
 * price, subtotal, or stock ceiling. Every mutation posts an *intent*
 * (artifactId, variantId, quantity) to the server; the server looks up
 * the real price and stock, recomputes the whole cart, and returns it.
 * We apply an optimistic patch immediately for responsiveness, then
 * overwrite it with whatever the server actually returned — including
 * rolling the optimistic change back if the request fails (e.g. the
 * item just sold out).
 *
 * Wrap your root layout:
 *   <CartProvider>{children}</CartProvider>
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Cart, CartLine } from "@/lib/types/cart";

type State = {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "LOADING" }
  | { type: "SET_CART"; cart: Cart }
  | { type: "ERROR"; error: string }
  | { type: "OPTIMISTIC_PATCH"; lines: CartLine[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "SET_CART":
      return { cart: action.cart, isLoading: false, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "OPTIMISTIC_PATCH":
      return state.cart
        ? { ...state, cart: { ...state.cart, lines: action.lines } }
        : state;
    default:
      return state;
  }
}

type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addItem: (artifactId: string, variantId: string | null, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function postCartAction(body: unknown): Promise<Cart> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Something went wrong with your cart.");
  }
  return data.cart as Cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { cart: null, isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (!cancelled) dispatch({ type: "SET_CART", cart: data.cart as Cart });
      } catch {
        if (!cancelled) dispatch({ type: "ERROR", error: "Couldn't load your cart." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>(async (artifactId, variantId, quantity = 1) => {
    try {
      const cart = await postCartAction({ action: "add", artifactId, variantId, quantity });
      dispatch({ type: "SET_CART", cart });
    } catch (e) {
      dispatch({ type: "ERROR", error: e instanceof Error ? e.message : "Couldn't add that to your cart." });
    }
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    async (lineId, quantity) => {
      const previousLines = state.cart?.lines ?? [];
      // Optimistic patch — clamp against the server's last-known ceiling
      // so the stepper can't visually promise stock we don't have.
      const optimistic = previousLines.map((line) =>
        line.lineId === lineId ? { ...line, quantity: Math.min(quantity, line.maxQuantity) } : line
      );
      dispatch({ type: "OPTIMISTIC_PATCH", lines: optimistic });

      try {
        const cart = await postCartAction({ action: "update", lineId, quantity });
        dispatch({ type: "SET_CART", cart });
      } catch (e) {
        dispatch({ type: "OPTIMISTIC_PATCH", lines: previousLines }); // roll back
        dispatch({ type: "ERROR", error: e instanceof Error ? e.message : "Couldn't update that quantity." });
      }
    },
    [state.cart]
  );

  const removeLine = useCallback<CartContextValue["removeLine"]>(
    async (lineId) => {
      const previousLines = state.cart?.lines ?? [];
      dispatch({ type: "OPTIMISTIC_PATCH", lines: previousLines.filter((l) => l.lineId !== lineId) });
      try {
        const cart = await postCartAction({ action: "remove", lineId });
        dispatch({ type: "SET_CART", cart });
      } catch (e) {
        dispatch({ type: "OPTIMISTIC_PATCH", lines: previousLines }); // roll back
        dispatch({ type: "ERROR", error: e instanceof Error ? e.message : "Couldn't remove that item." });
      }
    },
    [state.cart]
  );

  const itemCount = useMemo(
    () => state.cart?.lines.reduce((sum, l) => sum + l.quantity, 0) ?? 0,
    [state.cart]
  );

  const value: CartContextValue = {
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    itemCount,
    addItem,
    updateQuantity,
    removeLine,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
