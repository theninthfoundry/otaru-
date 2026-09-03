'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollTextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote' | 'span';
  style?: React.CSSProperties;
  highlightGold?: boolean;
}

/**
 * ScrollTextReveal
 * Luxury editorial scroll-responsive text transition.
 * Words illuminate and scale into crisp focus in direct response to the collector's scroll position.
 */
export function ScrollTextReveal({
  text,
  className = '',
  as: Component = 'p',
  style: customStyle,
  highlightGold = false,
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when top is at 85% of viewport, finish when top reaches 35% of viewport
      const startTrigger = windowHeight * 0.85;
      const endTrigger = windowHeight * 0.35;

      const current = rect.top;
      const progress = (startTrigger - current) / (startTrigger - endTrigger);
      const clamped = Math.max(0, Math.min(1, progress));

      setScrollProgress(clamped);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const words = text.split(' ');

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Component
      ref={containerRef as any}
      className={`scroll-text-reveal ${className}`}
      style={{
        display: 'inline-block',
        ...customStyle,
      }}
    >
      {words.map((word, idx) => {
        // Stagger each word across the scroll progress range
        const wordStart = idx / words.length;
        const wordEnd = (idx + 1) / words.length;
        const wordProgress = Math.max(
          0,
          Math.min(1, (scrollProgress - wordStart) / (wordEnd - wordStart || 1))
        );

        const opacity = 0.18 + wordProgress * 0.82;
        const translateY = (1 - wordProgress) * 12; // 12px -> 0px
        const scale = 0.95 + wordProgress * 0.05; // 0.95 -> 1.0

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              opacity,
              transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
              color: highlightGold && wordProgress > 0.85 ? '#e2c285' : 'inherit',
              transition: 'color 0.4s ease',
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
}
