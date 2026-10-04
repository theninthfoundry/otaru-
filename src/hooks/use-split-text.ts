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
    let visualHTML = '';

    if (mode === 'chars') {
      visualHTML = text
        .split('')
        .map(
          (char, i) =>
            `<span class="split-char" aria-hidden="true" data-char-index="${i}" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`,
        )
        .join('');
    } else if (mode === 'words') {
      visualHTML = text
        .split(/\s+/)
        .map(
          (word, i) =>
            `<span class="split-word" aria-hidden="true" data-word-index="${i}" style="display:inline-block">${word}</span>`,
        )
        .join('<span aria-hidden="true" style="display:inline-block">&nbsp;</span>');
    } else if (mode === 'lines') {
      visualHTML = `<span class="split-line" aria-hidden="true" data-line-index="0" style="display:block">${text}</span>`;
    }

    el.innerHTML = `<span class="sr-only">${text}</span><span aria-hidden="true">${visualHTML}</span>`;
  }, [mode]);

  const restore = useCallback(() => {
    const el = ref.current;
    if (el && originalHTML.current) {
      el.innerHTML = originalHTML.current;
    }
  }, []);

  return { ref, split, restore };
}
