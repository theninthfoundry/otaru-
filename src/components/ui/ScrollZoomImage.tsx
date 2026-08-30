'use client';

import React, { useEffect, useRef, useState } from 'react';
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
 * High-performance, 60fps scroll-driven zoom in / zoom out transition.
 * Smoothly scales image content as it enters, passes through, and leaves the viewport.
 */
export function ScrollZoomImage({
  children,
  className = '',
  intensity = 'medium',
  direction = 'out-to-in',
  style: customStyle,
}: ScrollZoomImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(direction === 'out-to-in' ? 1.08 : 0.95);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;

    const updateScaleOnScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if element is anywhere within view (+ 100px buffer)
      if (rect.bottom >= -100 && rect.top <= windowHeight + 100) {
        setIsIntersecting(true);

        // Progress from 0 (just entering bottom) to 1 (leaving top)
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Peak zoom centered around the middle of the viewport (progress = 0.5)
        const distanceFromCenter = Math.abs(clampedProgress - 0.5) * 2; // 0 at center, 1 at edges

        let maxScaleDelta = 0.08;
        if (intensity === 'subtle') maxScaleDelta = 0.04;
        if (intensity === 'cinematic') maxScaleDelta = 0.14;

        if (direction === 'out-to-in') {
          // Zooms from larger scale down to crisp 1.0 at center
          const targetScale = 1.0 + distanceFromCenter * maxScaleDelta;
          setScale(targetScale);
        } else {
          // Zooms from 1.0 to larger at center
          const targetScale = 1.0 + (1 - distanceFromCenter) * maxScaleDelta;
          setScale(targetScale);
        }
      } else {
        setIsIntersecting(false);
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
        className="scroll-zoom-inner"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
