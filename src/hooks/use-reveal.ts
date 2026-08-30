'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
}

interface UseRevealReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isRevealed: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
): UseRevealReturn<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    once = true,
    delay = 0,
  } = options;

  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          if (delay > 0) {
            const timer = setTimeout(() => setIsRevealed(true), delay);
            return () => clearTimeout(timer);
          }
          setIsRevealed(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay]);

  return { ref, isRevealed };
}
