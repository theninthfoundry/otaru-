'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  /** Speed in pixels per second. Default: 50 */
  speed?: number;
  /** Direction. Default: 'left' */
  direction?: 'left' | 'right';
  /** Pause on hover. Default: true */
  pauseOnHover?: boolean;
  /** Gap between repeated content. Default: '2rem' */
  gap?: string;
  className?: string;
}

/**
 * Infinite horizontal scrolling marquee.
 * Content is duplicated to create a seamless loop.
 * Respects prefers-reduced-motion.
 */
export function Marquee({
  children,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  gap = '2rem',
  className,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Calculate animation duration based on content width
    const contentWidth = el.scrollWidth / 2; // We duplicate content
    const duration = contentWidth / speed;
    el.style.setProperty('--marquee-duration', `${duration}s`);
  }, [speed, children]);

  return (
    <div
      className={cn(
        'overflow-hidden select-none',
        pauseOnHover && 'group',
        className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          'flex w-max',
          'animate-marquee',
          direction === 'right' && 'animate-marquee-reverse',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ gap }}
        aria-hidden="true"
      >
        {/* Original + duplicate for seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
      </div>
    </div>
  );
}
