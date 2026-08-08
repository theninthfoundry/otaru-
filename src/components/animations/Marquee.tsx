'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string;
  className?: string;
}

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

    const contentWidth = el.scrollWidth / 2;
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
