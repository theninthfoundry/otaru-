'use client';

import { useEffect, useState } from 'react';

/**
 * Track page scroll progress as a 0–1 value.
 * Useful for scroll progress bars and scroll-linked animations.
 *
 * @example
 * const progress = useScrollProgress();
 * <div style={{ width: `${progress * 100}%` }} />
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    function onScroll() {
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress(Math.min(1, Math.max(0, scrollProgress)));
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
