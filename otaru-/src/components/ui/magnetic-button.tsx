'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/hooks/use-magnetic';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Attraction radius in px. Default: 50 */
  radius?: number;
  /** Pull strength 0–1. Default: 0.3 */
  strength?: number;
}

/**
 * Button with magnetic cursor-follow effect.
 * The button subtly moves toward the cursor when hovering nearby.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ radius = 50, strength = 0.3, className, children, ...props }, _ref) => {
    const { ref: magneticRef } = useMagnetic<HTMLButtonElement>({
      radius,
      strength,
    });

    return (
      <button
        ref={magneticRef}
        className={cn(
          'inline-flex items-center justify-center font-medium tracking-wide',
          'px-8 py-3.5 bg-otaru-ink text-otaru-chalk text-body-sm',
          'rounded-[2px] will-change-transform',
          'hover:bg-otaru-ink-muted active:bg-otaru-stone-dark',
          'transition-colors duration-subtle ease-settle',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-otaru-ink',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

MagneticButton.displayName = 'MagneticButton';
