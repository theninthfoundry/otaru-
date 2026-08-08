'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Artifact } from '@/lib/shopify/types';

interface WishlistContextType {
  wishlist: Artifact[];
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (artifact: Artifact) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = 'otaru-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Artifact[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch {
        // Ignore localStorage quota errors
      }
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id || item.handle === id);
  };

  const toggleWishlist = (artifact: Artifact) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === artifact.id);
      if (exists) {
        return prev.filter((item) => item.id !== artifact.id);
      } else {
        return [artifact, ...prev];
      }
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id && item.handle !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
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
