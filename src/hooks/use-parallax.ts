'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseParallaxOptions {
  speed?: number;
  clamp?: number;
}

interface UseParallaxReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  offset: number;
  transform: string;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {},
): UseParallaxReturn<T> {
  const { speed = 0.3, clamp = 150 } = options;
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    let rafId: number;

    function onScroll() {
      rafId = requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distance = elementCenter - viewportCenter;

        const rawOffset = distance * speed;
        const clampedOffset = Math.max(-clamp, Math.min(clamp, rawOffset));

        setOffset(clampedOffset);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, clamp]);

  return {
    ref,
    offset,
    transform: `translate3d(0, ${offset}px, 0)`,
  };
}
