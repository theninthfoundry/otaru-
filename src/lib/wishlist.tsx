'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useCart, CartLineItem } from '@/lib/cart';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  meta: string;
  price: number;
  size?: string;
  category?: string;
  addedAt?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  itemCount: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  moveToCart: (id: string) => void;
  moveCartToWishlist: (lineItem: CartLineItem) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  itemCount: 0,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  moveToCart: () => {},
  moveCartToWishlist: () => {},
  clearWishlist: () => {},
});

const WISHLIST_STORAGE_KEY = 'otaru_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { addToCart, removeFromCart } = useCart();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveWishlist = useCallback((items: WishlistItem[]) => {
    setWishlist(items);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev;
      }
      const updated = [
        ...prev,
        {
          ...item,
          addedAt: item.addedAt || new Date().toISOString(),
        },
      ];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return wishlist.some((item) => item.id === id || item.productId === id);
  }, [wishlist]);

  const moveToCart = useCallback((id: string) => {
    const item = wishlist.find((w) => w.id === id);
    if (item) {
      addToCart({
        id: item.id,
        name: item.name,
        meta: item.meta,
        price: item.price,
        size: item.size || 'M',
        qty: 1,
      });
      removeFromWishlist(id);
    }
  }, [wishlist, addToCart, removeFromWishlist]);

  const moveCartToWishlist = useCallback((lineItem: CartLineItem) => {
    const productId = lineItem.id.split('-')[0] || lineItem.id;
    addToWishlist({
      id: lineItem.id,
      productId,
      name: lineItem.name,
      meta: lineItem.meta,
      price: lineItem.price,
      size: lineItem.size || 'M',
    });
    removeFromCart(lineItem.id);
  }, [addToWishlist, removeFromCart]);

  const clearWishlist = useCallback(() => {
    saveWishlist([]);
  }, [saveWishlist]);

  const itemCount = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        itemCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
        moveCartToWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
