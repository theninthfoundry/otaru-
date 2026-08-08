'use client';

import { useCallback, useRef, type RefObject } from 'react';

type SplitMode = 'chars' | 'words' | 'lines';

interface UseSplitTextReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  split: () => void;
  restore: () => void;
}

export function useSplitText<T extends HTMLElement = HTMLHeadingElement>(
  mode: SplitMode = 'words',
): UseSplitTextReturn<T> {
  const ref = useRef<T | null>(null);
  const originalHTML = useRef<string>('');

  const split = useCallback(() => {
    const el = ref.current;
    if (!el) return;

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
