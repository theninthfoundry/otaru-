'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseParallaxOptions {
  /** Parallax speed multiplier. Positive = slower, negative = faster. Default: 0.3 */
  speed?: number;
  /** Clamp the maximum translate in px. Default: 150 */
  clamp?: number;
}

interface UseParallaxReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  /** Current Y offset in pixels */
  offset: number;
  /** CSS transform string ready to use */
  transform: string;
}

/**
 * Scroll-linked parallax hook using vanilla JS for performance.
 * Returns a Y offset that can be applied as a transform.
 *
 * @example
 * const { ref, transform } = useParallax<HTMLDivElement>({ speed: 0.2 });
 * <div ref={ref} style={{ transform }} />
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {},
): UseParallaxReturn<T> {
  const { speed = 0.3, clamp = 150 } = options;
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    let rafId: number;

    function onScroll() {
      rafId = requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Calculate how far the element is from the center of the viewport
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distance = elementCenter - viewportCenter;

        const rawOffset = distance * speed;
        const clampedOffset = Math.max(-clamp, Math.min(clamp, rawOffset));

        setOffset(clampedOffset);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial calculation

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
