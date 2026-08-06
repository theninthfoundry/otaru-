'use client';

import { useEffect, useState } from 'react';

interface MousePosition {
  /** Mouse X position in pixels from left edge */
  x: number;
  /** Mouse Y position in pixels from top edge */
  y: number;
  /** Mouse X normalized to -1..1 (center = 0) */
  normalizedX: number;
  /** Mouse Y normalized to -1..1 (center = 0) */
  normalizedY: number;
}

/**
 * Track mouse position globally. Returns pixel and normalized (-1..1) coordinates.
 * Used for 3D scene interactions, custom cursors, and hover effects.
 *
 * @example
 * const { normalizedX, normalizedY } = useMousePosition();
 * // Use in R3F scene or for CSS transforms
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    let rafId: number;

    function onMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
          normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
        });
      });
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}
