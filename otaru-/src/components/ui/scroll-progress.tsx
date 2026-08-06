'use client';

import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
}

/**
 * Thin progress bar fixed at top of page showing scroll position.
 * Uses GPU-accelerated scaleX transform.
 */
export function ScrollProgress({ className }: ScrollProgressProps) {
  const progress = useScrollProgress();

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] h-[2px]',
        'pointer-events-none',
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full bg-otaru-ink origin-left will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
