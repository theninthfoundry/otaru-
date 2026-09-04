'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface ScrollZoomImageProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'cinematic';
  direction?: 'in-to-out' | 'out-to-in';
  style?: React.CSSProperties;
}

/**
 * ScrollZoomImage
 * High-performance, 60fps direct-DOM scroll-driven zoom.
 * Smoothly scales image content as it enters, passes through, and leaves the viewport
 * without React state re-render jitter or CSS transition lag.
 */
export function ScrollZoomImage({
  children,
  className = '',
  intensity = 'medium',
  direction = 'out-to-in',
  style: customStyle,
}: ScrollZoomImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    let ticking = false;

    const updateScaleOnScroll = () => {
      if (!el || !inner) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if element is anywhere within view (+ 80px buffer)
      if (rect.bottom >= -80 && rect.top <= windowHeight + 80) {
        // Progress from 0 (just entering bottom) to 1 (leaving top)
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Peak zoom centered around the middle of the viewport (progress = 0.5)
        const distanceFromCenter = Math.abs(clampedProgress - 0.5) * 2; // 0 at center, 1 at edges

        let maxScaleDelta = 0.08;
        if (intensity === 'subtle') maxScaleDelta = 0.04;
        if (intensity === 'cinematic') maxScaleDelta = 0.12;

        let targetScale: number;
        if (direction === 'out-to-in') {
          // Zooms from larger scale down to crisp 1.0 at center
          targetScale = 1.0 + distanceFromCenter * maxScaleDelta;
        } else {
          // Zooms from 1.0 to larger at center
          targetScale = 1.0 + (1 - distanceFromCenter) * maxScaleDelta;
        }

        inner.style.transform = `scale(${targetScale.toFixed(4)})`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScaleOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScaleOnScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [intensity, direction]);

  return (
    <div
      ref={containerRef}
      className={clsx('scroll-zoom-container', className)}
      style={{
        overflow: 'hidden',
        position: 'relative',
        ...customStyle,
      }}
    >
      <div
        ref={innerRef}
        className="scroll-zoom-inner"
        style={{
          transform: direction === 'out-to-in' ? 'scale(1.06)' : 'scale(1.0)',
          willChange: 'transform',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
