'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { HeldClothCanvas } from './HeldClothCanvas';
import { PRODUCT_CATALOG } from '@/lib/catalog';

export function HeldHero() {
  const [isSettled, setIsSettled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  // Live inventory piece count calculation
  const liveBatchQuantity = React.useMemo(() => {
    const obj41 = PRODUCT_CATALOG['041'];
    if (!obj41) return 44;
    return obj41.runQuantity ? parseInt(obj41.runQuantity.split(' ')[0], 10) || 44 : 44;
  }, []);

  useEffect(() => {
    // Check if user already saw the entrance sequence this session
    const hasSeenHero = typeof window !== 'undefined' && sessionStorage.getItem('otaru_hero_seen');
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenHero || prefersReducedMotion) {
      setIsSettled(true);
    } else {
      // Trigger entrance sequence timeline (<2.2s total)
      const timer = setTimeout(() => {
        setIsSettled(true);
        sessionStorage.setItem('otaru_hero_seen', '1');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const height = rect.height || window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (height * 0.5)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden bg-[var(--paper)] text-[var(--ink)] select-none"
      aria-label="Hero — Held up to the window"
    >
      {/* Background Cloth Canvas Plane (Backlit indigo weave) */}
      <div
        className="absolute inset-0 z-0 transition-all duration-[1200ms]"
        style={{
          clipPath: isSettled ? 'inset(0% 0%)' : 'inset(50% 0%)',
          transform: `scale(${isSettled ? 1 + scrollProgress * 0.06 : 1.12})`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <HeldClothCanvas scrollProgress={scrollProgress} />
        
        {/* Indigo shadow overlay that rises 0 -> 35% on scroll */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundColor: 'var(--indigo)',
            opacity: scrollProgress * 0.35,
          }}
        />

        {/* Subtle perimeter vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(16, 25, 42, 0.85) 0%, rgba(16, 25, 42, 0.2) 45%, rgba(16, 25, 42, 0.4) 100%)',
          }}
        />
      </div>

      {/* Top Hairline Meta Row */}
      <div className="relative z-10 w-full pt-20">
        <div className="wrap">
          <div
            className="flex items-center justify-between py-3 border-b border-white/15 text-white/70 font-mono text-[10px] tracking-widest uppercase transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transform: isSettled ? 'translateY(0)' : 'translateY(-8px)',
            }}
          >
            <span>Hokkaido 43.19° N</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              Batch 01 · {liveBatchQuantity} pieces live
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Left Content: One Headline, One Sentence, One CTA */}
      <div
        className="relative z-10 wrap pb-12 sm:pb-16 transition-opacity duration-500"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 2),
        }}
      >
        <div className="max-w-[820px]">
          {/* Headline: "The mountain remembers." (Line-by-line mask reveal) */}
          <h1
            className="font-display text-[clamp(2.75rem,7.5vw,7.5rem)] text-[#F4F0E8] leading-[0.98] tracking-[-0.02em] mb-6 overflow-hidden"
          >
            <span className="sr-only">The mountain remembers.</span>
            <span aria-hidden="true">
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-[900ms]"
                  style={{
                    transform: isSettled ? 'translateY(0)' : 'translateY(110%)',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: '400ms',
                  }}
                >
                  The mountain
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-[900ms]"
                  style={{
                    transform: isSettled ? 'translateY(0)' : 'translateY(110%)',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: '520ms',
                  }}
                >
                  remembers.
                </span>
              </span>
            </span>
          </h1>

          {/* Subcopy (Exact max 14 words specification) */}
          <p
            className="text-white/80 text-base sm:text-lg max-w-[46ch] font-body leading-relaxed mb-8 transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transitionDelay: '750ms',
            }}
          >
            Japanese craft sensibility, Indian cloth and hands. Numbered. Never restocked.
          </p>

          {/* Single CTA with drawing underline */}
          <div
            className="transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transitionDelay: '880ms',
            }}
          >
            <Link
              href="/archive"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-[#F4F0E8] py-2 relative"
            >
              <span>Enter the archive</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5 duration-300">
                →
              </span>
              {/* Self-drawing underline */}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 group-hover:bg-white group-hover:h-[1.5px] transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
