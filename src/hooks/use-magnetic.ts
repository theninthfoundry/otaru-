'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useMousePosition } from './use-mouse-position';

interface UseMagneticOptions {
  radius?: number;
  strength?: number;
  returnSpeed?: number;
}

interface UseMagneticReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  options: UseMagneticOptions = {},
): UseMagneticReturn<T> {
  const { radius = 40, strength = 0.35, returnSpeed = 0.15 } = options;
  const ref = useRef<T | null>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = mouseX - centerX;
    const distY = mouseY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius + rect.width / 2) {
      const pullX = distX * strength;
      const pullY = distY * strength;
      el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      el.style.transition = `transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    } else {
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.transition = `transform ${returnSpeed}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    }
  }, [mouseX, mouseY, radius, strength, returnSpeed]);

  return { ref };
}
