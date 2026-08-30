'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  staggerIndex?: number;
  threshold?: number;
  style?: React.CSSProperties;
}

export function RevealOnScroll({
  children,
  className = '',
  staggerIndex,
  threshold = 0.08,
  style: customStyle,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px 80px 0px' }
    );

    observer.observe(el);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [threshold]);

  const style: React.CSSProperties = {
    ...(staggerIndex !== undefined ? ({ '--i': staggerIndex } as React.CSSProperties) : {}),
    ...customStyle,
  };

  return (
    <div
      ref={ref}
      className={clsx('reveal', isVisible && 'is-visible', className)}
      style={style}
    >
      {children}
    </div>
  );
}
