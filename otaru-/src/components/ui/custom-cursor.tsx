'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '@/hooks/use-cursor';
import { cn } from '@/lib/utils';

const cursorSizes = {
  default: 8,
  hover: 48,
  text: 2,
  view: 64,
  hidden: 0,
};

/**
 * Custom cursor with multiple modes.
 * - Default: small dot
 * - Hover: expanded ring on interactive elements
 * - Text: thin vertical bar on text
 * - View: large circle with "View" label on images/products
 * - Hidden: invisible
 *
 * Only renders on pointer:fine devices (desktop with mouse).
 */
export function CustomCursor() {
  const { cursor, setCursor, resetCursor } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  const size = cursorSizes[cursor.mode];

  useEffect(() => {
    // Only show on pointer:fine devices
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest<HTMLElement>(
        'a, button, [role="button"], [data-cursor]'
      );

      if (interactiveEl) {
        const customMode = interactiveEl.getAttribute('data-cursor');
        const customLabel = interactiveEl.getAttribute('data-cursor-label') || undefined;
        setCursor((customMode as any) || 'hover', customLabel);
      } else {
        resetCursor();
      }
    };

    const handleMouseLeave = () => {
      resetCursor();
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, setCursor, resetCursor]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <motion.div
      ref={cursorRef}
      className={cn(
        'fixed top-0 left-0 z-[9999] pointer-events-none',
        'flex items-center justify-center',
        'mix-blend-difference',
      )}
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        className={cn(
          'rounded-full flex items-center justify-center overflow-hidden',
          cursor.mode === 'default' && 'bg-otaru-chalk',
          cursor.mode === 'hover' && 'border border-otaru-chalk/80 bg-transparent',
          cursor.mode === 'text' && 'bg-otaru-chalk',
          cursor.mode === 'view' && 'border border-otaru-chalk/60 bg-otaru-chalk/10',
        )}
        animate={{
          width: size,
          height: cursor.mode === 'text' ? 24 : size,
          opacity: cursor.mode === 'hidden' ? 0 : 1,
        }}
        transition={{
          width: { type: 'spring', stiffness: 400, damping: 28 },
          height: { type: 'spring', stiffness: 400, damping: 28 },
          opacity: { duration: 0.15 },
        }}
      >
        {cursor.mode === 'view' && cursor.label && (
          <span className="text-[10px] font-medium tracking-wider uppercase text-otaru-chalk px-2 select-none">
            {cursor.label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
