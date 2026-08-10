"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface WishlistContextValue {
  handles: string[];
  toggle: (handle: string) => void;
  has: (handle: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "otaru:wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setHandles(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  function toggle(handle: string) {
    setHandles((prev) => {
      const next = prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <WishlistContext.Provider value={{ handles, toggle, has: (h) => handles.includes(h) }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
