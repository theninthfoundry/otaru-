'use client';

import { useEffect, useRef, useState } from 'react';

interface UseSectionObserverOptions {
  /** IDs of sections to observe */
  sectionIds: string[];
  /** Intersection threshold. Default: 0.3 */
  threshold?: number;
  /** Root margin. Default: '0px 0px -40% 0px' */
  rootMargin?: string;
}

/**
 * Track which section is currently in viewport.
 * Useful for sticky navigation highlights and reading progress.
 *
 * @example
 * const activeId = useSectionObserver({ sectionIds: ['hero', 'about', 'contact'] });
 * // activeId === 'about' when that section is most visible
 */
export function useSectionObserver(options: UseSectionObserverOptions): string | null {
  const { sectionIds, threshold = 0.3, rootMargin = '0px 0px -40% 0px' } = options;
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { threshold, rootMargin },
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [sectionIds, threshold, rootMargin]);

  return activeId;
}
