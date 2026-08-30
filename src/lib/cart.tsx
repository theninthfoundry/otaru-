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

const INITIAL_CART: CartLineItem[] = [
  { id: '042-M', name: 'Kiryū Wrap Trouser', meta: 'Washed silk blend', price: 310, qty: 1, size: 'M' },
  { id: '044-One Size', name: 'Ōmi Hemp Tote', meta: 'Raw hemp canvas', price: 165, qty: 2, size: 'One Size' }
];

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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('otaru_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('otaru_cart', JSON.stringify(items));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [items, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (newItem: Omit<CartLineItem, 'qty'> & { qty?: number }) => {
    const quantity = newItem.qty ?? 1;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...newItem, qty: quantity }];
    });
    openCart();
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartLineItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

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
  return useContext(CartContext);
}
