'use client';

<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React from 'react';
>>>>>>> main
import Link from 'next/link';
import { HeldClothCanvas } from './HeldClothCanvas';
import { PRODUCT_CATALOG } from '@/lib/catalog';

export function HeldHero() {
<<<<<<< HEAD
  const [isSettled, setIsSettled] = useState(false);

  // Single source of truth: sum the entire Batch 01 (44 + 38 + 32 + 26 = 140 pieces)
  const { totalBatchPieces, totalBatchRemaining } = React.useMemo(() => {
    const batchIds = ['041', '042', '043', '044'];
    let totalPieces = 0;
    let totalRemaining = 0;

    batchIds.forEach((id) => {
      const prod = PRODUCT_CATALOG[id];
      if (prod) {
        const runQty = parseInt(prod.runQuantity.split(' ')[0], 10) || 0;
        totalPieces += runQty;
        totalRemaining += prod.sizes.reduce((sum, s) => sum + s[1], 0);
      }
    });

    return {
      totalBatchPieces: totalPieces || 140,
      totalBatchRemaining: totalRemaining || 39,
    };
  }, []);

  useEffect(() => {
    const hasSeenHero = typeof window !== 'undefined' && sessionStorage.getItem('otaru_hero_seen');
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenHero || prefersReducedMotion) {
      setIsSettled(true);
    } else {
      // Entry sequence timeline < 2.0s total, never blocking
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

=======
  // Live inventory piece count calculation
  const liveBatchQuantity = React.useMemo(() => {
    const obj41 = PRODUCT_CATALOG['041'];
    if (!obj41) return 44;
    return obj41.runQuantity ? parseInt(obj41.runQuantity.split(' ')[0], 10) || 44 : 44;
  }, []);

>>>>>>> main
  return (
    <section
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col justify-between overflow-hidden bg-[var(--paper)] text-[var(--ink)] select-none"
      aria-label="Hero — Otaru Atelier"
    >
<<<<<<< HEAD
      {/* Background Cloth Canvas Plane (Backlit indigo weave) with entry clip-path */}
      <div
        className="absolute inset-0 z-0 transition-all duration-[1200ms]"
        style={{
          clipPath: isSettled ? 'inset(0% 0%)' : 'inset(35% 0%)',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
=======
      {/* Background Cloth Canvas Plane (Backlit indigo weave) — Plain & Static */}
      <div className="absolute inset-0 z-0">
>>>>>>> main
        <HeldClothCanvas scrollProgress={0} />

        {/* Subtle perimeter vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(16, 25, 42, 0.85) 0%, rgba(16, 25, 42, 0.2) 45%, rgba(16, 25, 42, 0.4) 100%)',
          }}
        />
      </div>

      {/* Top Hairline Meta Row */}
      <div className="relative z-10 w-full pt-20">
        <div className="wrap">
<<<<<<< HEAD
          <div
            className="flex items-center justify-between py-3 border-b border-white/15 text-white/70 font-mono text-[10px] tracking-widest uppercase transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
            }}
          >
            <span>Hokkaido 43.19° N</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              Batch 01 · {totalBatchPieces} pieces crafted ({totalBatchRemaining} remain)
=======
          <div className="flex items-center justify-between py-3 border-b border-white/15 text-white/70 font-mono text-[10px] tracking-widest uppercase">
            <span>Hokkaido 43.19° N</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              Batch 01 · {liveBatchQuantity} pieces live
>>>>>>> main
            </span>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Main Hero Content */}
      <div className="relative z-10 wrap pb-12 sm:pb-16">
        <div className="max-w-[820px]">
          {/* Accessible, crisp headline with line mask entrance */}
          <h1
            className="font-display text-[clamp(2.75rem,7.5vw,7.5rem)] text-[#F4F0E8] leading-[0.98] tracking-[-0.02em] mb-6 overflow-hidden"
          >
            <span className="sr-only">The mountain remembers.</span>
            <span aria-hidden="true">
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-[800ms]"
                  style={{
                    transform: isSettled ? 'translateY(0)' : 'translateY(100%)',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: '200ms',
                  }}
                >
                  The mountain
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-[800ms]"
                  style={{
                    transform: isSettled ? 'translateY(0)' : 'translateY(100%)',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: '350ms',
                  }}
                >
                  remembers.
                </span>
              </span>
            </span>
          </h1>

          {/* Subcopy */}
          <p
            className="text-white/85 text-base sm:text-lg max-w-[46ch] font-body leading-relaxed mb-8 transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transitionDelay: '550ms',
            }}
          >
            A world of water, timber, cloth, and the objects that pass through it.
          </p>

          {/* Single clean CTA */}
          <div
            className="transition-opacity duration-700"
            style={{
              opacity: isSettled ? 1 : 0,
              transitionDelay: '700ms',
            }}
          >
=======
      {/* Main Hero Content — Plain, Simple, Clean */}
      <div className="relative z-10 wrap pb-12 sm:pb-16">
        <div className="max-w-[820px]">
          {/* Accessible, crisp static headline */}
          <h1 className="font-display text-[clamp(2.75rem,7.5vw,7.5rem)] text-[#F4F0E8] leading-[0.98] tracking-[-0.02em] mb-6">
            The mountain remembers.
          </h1>

          {/* Subcopy */}
          <p className="text-white/85 text-base sm:text-lg max-w-[46ch] font-body leading-relaxed mb-8">
            Japanese craft sensibility, Indian cloth and hands. Numbered. Never restocked.
          </p>

          {/* Single clean CTA */}
          <div>
>>>>>>> main
            <Link
              href="#batch"
              className="inline-flex items-center gap-3 text-white font-mono text-xs uppercase tracking-widest group border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              <span>Explore Current Batch</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1 font-serif text-sm">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom subtle baseline line */}
      <div className="relative z-10 w-full border-t border-white/10" />
    </section>
  );
}
