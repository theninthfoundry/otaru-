'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface CartLineItem {
  id: string;
  name: string;
  meta: string;
  price: number;
  qty: number;
  size?: string;
}

interface CartContextType {
  items: CartLineItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartLineItem, 'qty'> & { qty?: number }) => void;
  updateQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Initial cart starts strictly empty for real collectors
const INITIAL_CART: CartLineItem[] = [];

const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  itemCount: 0,
  subtotal: 0,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  addToCart: () => {},
  updateQty: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>(INITIAL_CART);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('otaru_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear out old legacy development mock items if present
        const isLegacyMock =
          Array.isArray(parsed) &&
          parsed.some((item) => item.id === '042-M' || item.name === 'Kiryū Wrap Trouser');

        if (isLegacyMock) {
          localStorage.removeItem('otaru_cart');
          setItems([]);
        } else if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (newItem: Omit<CartLineItem, 'qty'> & { qty?: number }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      let updated: CartLineItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.id === newItem.id
            ? { ...item, qty: item.qty + (newItem.qty ?? 1) }
            : item
        );
      } else {
        updated = [...prev, { ...newItem, qty: newItem.qty ?? 1 }];
      }
      try {
        localStorage.setItem('otaru_cart', JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
    setIsOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartLineItem => item !== null);

      try {
        localStorage.setItem('otaru_cart', JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('otaru_cart', JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem('otaru_cart');
    } catch {
      // Ignore localStorage errors
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
