'use client';

import React from 'react';
import Link from 'next/link';
import { HeldClothCanvas } from './HeldClothCanvas';
import { PRODUCT_CATALOG } from '@/lib/catalog';

export function HeldHero() {
  // Live inventory piece count calculation
  const liveBatchQuantity = React.useMemo(() => {
    const obj41 = PRODUCT_CATALOG['041'];
    if (!obj41) return 44;
    return obj41.runQuantity ? parseInt(obj41.runQuantity.split(' ')[0], 10) || 44 : 44;
  }, []);

  return (
    <section
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col justify-between overflow-hidden bg-[var(--paper)] text-[var(--ink)] select-none"
      aria-label="Hero — Otaru Atelier"
    >
      {/* Background Cloth Canvas Plane (Backlit indigo weave) — Plain & Static */}
      <div className="absolute inset-0 z-0">
        <HeldClothCanvas scrollProgress={0} />

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
          <div className="flex items-center justify-between py-3 border-b border-white/15 text-white/70 font-mono text-[10px] tracking-widest uppercase">
            <span>Hokkaido 43.19° N</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              Batch 01 · {liveBatchQuantity} pieces live
            </span>
          </div>
        </div>
      </div>

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
