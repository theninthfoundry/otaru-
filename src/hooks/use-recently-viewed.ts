'use client';

import { useEffect, useState } from 'react';

const RECENTLY_VIEWED_KEY = 'otaru-recently-viewed';
const MAX_ITEMS = 6;

export function useRecentlyViewed(currentHandle?: string) {
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const parsed: string[] = stored ? JSON.parse(stored) : [];

      if (currentHandle) {
        const filtered = parsed.filter((h) => h !== currentHandle);
        const updated = [currentHandle, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
        setHandles(filtered);
      } else {
        setHandles(parsed);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [currentHandle]);

  return handles;
}
