'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeldClothCanvas } from './HeldClothCanvas';

/**
 * Cinematic Hero — ATMOSPHERE stage
 * 
 * The first page of an art book, not an information panel.
 * Cloth surface → title reveal → subcopy → CTAs
 * Entry sequence < 2.0s, never blocking, reduced-motion compliant.
 */
export function HeldHero() {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const hasSeenHero =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('otaru_hero_seen');
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenHero || prefersReducedMotion) {
      setIsSettled(true);
    } else {
      const timer = setTimeout(() => {
        setIsSettled(true);
        try {
          sessionStorage.setItem('otaru_hero_seen', '1');
        } catch {
          // ignore storage errors
        }
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col justify-end overflow-hidden bg-[var(--ink)] text-[#F4F0E8] select-none"
      aria-label="Hero — The mountain remembers"
    >
      {/* Background Cloth Canvas — living material surface */}
      <div
        className="absolute inset-0 z-0 transition-all duration-[1400ms]"
        style={{
          clipPath: isSettled ? 'inset(0% 0%)' : 'inset(40% 0%)',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <HeldClothCanvas scrollProgress={0} />

        {/* Layered vignette: bottom heavy for text legibility, subtle top darkening */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(to top, rgba(11, 17, 27, 0.92) 0%, rgba(11, 17, 27, 0.4) 40%, rgba(11, 17, 27, 0.15) 65%, rgba(11, 17, 27, 0.3) 100%)',
            ].join(', '),
          }}
        />
      </div>

      {/* Main Hero Content — desire, not information */}
      <div className="relative z-10 wrap pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-[820px]">

          {/* Headline with line-mask entrance */}
          <h1
            className="font-display text-[clamp(3rem,8vw,8.5rem)] text-[#F4F0E8] leading-[0.95] tracking-[-0.025em] mb-8 overflow-hidden"
          >
            <span className="sr-only">The mountain remembers.</span>
            <span aria-hidden="true">
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-[900ms]"
                  style={{
                    transform: isSettled ? 'translateY(0)' : 'translateY(110%)',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: '150ms',
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
                    transitionDelay: '300ms',
                  }}
                >
                  remembers.
                </span>
              </span>
            </span>
          </h1>

          {/* Subcopy — the bridge between atmosphere and desire */}
          <p
            className="text-white/80 text-base sm:text-lg max-w-[42ch] leading-relaxed mb-10 transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transitionDelay: '550ms',
            }}
          >
            Japanese craft sensibility, Indian cloth and hands. Numbered objects, never restocked.
          </p>

          {/* Dual CTAs */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transitionDelay: '750ms',
            }}
          >
            <Link
              href="#batch"
              className="inline-flex items-center gap-3 bg-[#F4F0E8] text-[var(--ink)] font-mono text-xs uppercase tracking-[0.15em] px-7 py-4 hover:bg-white transition-colors"
            >
              <span>Discover the Current Batch</span>
              <span className="font-display text-sm">→</span>
            </Link>

            <Link
              href="/archive"
              className="inline-flex items-center gap-3 text-white/70 font-mono text-xs uppercase tracking-[0.15em] border-b border-white/30 pb-1 hover:text-white hover:border-white/60 transition-colors"
            >
              <span>Enter the Archive</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue — barely visible, disappears once scrolled */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-500"
        style={{
          opacity: isSettled ? 0.4 : 0,
          transitionDelay: '1000ms',
        }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
        <span className="w-px h-6 bg-white/30" />
      </div>
    </section>
  );
}
