'use client';

import { useCallback, useRef, type RefObject } from 'react';

type SplitMode = 'chars' | 'words' | 'lines';

interface UseSplitTextReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  /** Call to split the text content into spans */
  split: () => void;
  /** Call to restore the original text content */
  restore: () => void;
}

/**
 * Split text content into individually-animatable spans.
 * Wraps each char, word, or line in a `<span>` with data attributes
 * for GSAP or Framer Motion stagger animations.
 *
 * @example
 * const { ref, split } = useSplitText<HTMLHeadingElement>('words');
 * useEffect(() => { split(); }, [split]);
 *
 * // Each word becomes: <span class="split-word" data-word-index="0">Hello</span>
 */
export function useSplitText<T extends HTMLElement = HTMLHeadingElement>(
  mode: SplitMode = 'words',
): UseSplitTextReturn<T> {
  const ref = useRef<T | null>(null);
  const originalHTML = useRef<string>('');

  const split = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Store original for restoration
    if (!originalHTML.current) {
      originalHTML.current = el.innerHTML;
    }

    const text = el.textContent || '';

    if (mode === 'chars') {
      el.innerHTML = text
        .split('')
        .map(
          (char, i) =>
            `<span class="split-char" data-char-index="${i}" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`,
        )
        .join('');
    } else if (mode === 'words') {
      el.innerHTML = text
        .split(/\s+/)
        .map(
          (word, i) =>
            `<span class="split-word" data-word-index="${i}" style="display:inline-block">${word}</span>`,
        )
        .join('<span style="display:inline-block">&nbsp;</span>');
    } else if (mode === 'lines') {
      // For lines we wrap the whole content — actual line detection
      // requires layout measurement which is complex.
      // This provides a simple wrapper for single-line-per-element patterns.
      el.innerHTML = `<span class="split-line" data-line-index="0" style="display:block">${text}</span>`;
    }
  }, [mode]);

  const restore = useCallback(() => {
    const el = ref.current;
    if (el && originalHTML.current) {
      el.innerHTML = originalHTML.current;
    }
  }, []);

  return { ref, split, restore };
}
