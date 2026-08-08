'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useOptimistic,
  type ReactNode,
} from 'react';
import type { Cart, CartLine } from '@/lib/shopify/types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartLine }
  | { type: 'REMOVE_ITEM'; payload: { lineId: string } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { lineId: string; quantity: number };
    }
  | { type: 'SET_CART'; payload: Cart | null };

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (line: CartLine) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  setCart: (cart: Cart | null) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  if (!state && action.type !== 'SET_CART') return state;

  switch (action.type) {
    case 'SET_CART':
      return action.payload;

    case 'ADD_ITEM': {
      if (!state) return state;
      const existingLineIndex = state.lines.findIndex(
        (l) => l.merchandise.id === action.payload.merchandise.id,
      );

      let newLines: CartLine[];
      if (existingLineIndex >= 0) {
        newLines = state.lines.map((line, i) =>
          i === existingLineIndex
            ? { ...line, quantity: line.quantity + action.payload.quantity }
            : line,
        );
      } else {
        newLines = [...state.lines, action.payload];
      }

      return {
        ...state,
        lines: newLines,
        totalQuantity: newLines.reduce((sum, l) => sum + l.quantity, 0),
      };
    }

    case 'REMOVE_ITEM': {
      if (!state) return state;
      const filteredLines = state.lines.filter(
        (l) => l.id !== action.payload.lineId,
      );
      return {
        ...state,
        lines: filteredLines,
        totalQuantity: filteredLines.reduce((sum, l) => sum + l.quantity, 0),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (!state) return state;
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: 'REMOVE_ITEM',
          payload: { lineId: action.payload.lineId },
        });
      }
      const updatedLines = state.lines.map((line) =>
        line.id === action.payload.lineId
          ? { ...line, quantity: action.payload.quantity }
          : line,
      );
      return {
        ...state,
        lines: updatedLines,
        totalQuantity: updatedLines.reduce((sum, l) => sum + l.quantity, 0),
      };
    }

    default:
      return state;
  }
}

export function CartContextProvider({
  children,
  initialCart,
}: {
  children: ReactNode;
  initialCart?: Cart | null;
}) {
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart ?? null,
    cartReducer,
  );

  const addItem = useCallback(
    (line: CartLine) => {
      updateOptimisticCart({ type: 'ADD_ITEM', payload: line });
    },
    [updateOptimisticCart],
  );

  const removeItem = useCallback(
    (lineId: string) => {
      updateOptimisticCart({
        type: 'REMOVE_ITEM',
        payload: { lineId },
      });
    },
    [updateOptimisticCart],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      updateOptimisticCart({
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity },
      });
    },
    [updateOptimisticCart],
  );

  const setCart = useCallback(
    (cart: Cart | null) => {
      updateOptimisticCart({ type: 'SET_CART', payload: cart });
    },
    [updateOptimisticCart],
  );

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      isLoading: false,
      addItem,
      removeItem,
      updateQuantity,
      setCart,
    }),
    [optimisticCart, addItem, removeItem, updateQuantity, setCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
