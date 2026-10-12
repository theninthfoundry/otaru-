'use client';

import React from 'react';

/**
 * CartBackgroundAtmosphere
 * 
 * Imbues the Cart & Allocation section with the tactile soul of the 1907 Otaru Canal stone warehouse:
 * - Subtle washi paper fibers and mineral grain
 * - Atmospheric watermark seals ('小樽' and '手織り')
 * - Architectural hairline coordinates and atmospheric weather ticker
 */
export function CartBackgroundAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Subtle SVG Noise Grain Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-multiply" aria-hidden="true">
        <filter id="cart-washi-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cart-washi-noise)" />
      </svg>

      {/* 2. Top-Right Architectural Coordinate Blueprint Watermark */}
      <div className="absolute top-20 right-8 lg:right-24 font-mono text-[9px] text-[var(--ink-muted)] opacity-25 leading-relaxed text-right tracking-[0.24em] hidden md:block">
        <div>HOKKAIDO ATELIER · 43.1907° N, 140.9947° E</div>
        <div>STONE WAREHOUSE NO. 04 · LOOM SHUTTLE STATION</div>
        <div>TEMPERATURE: 11°C · HUMIDITY: 54% · AIR DISPATCH: ACTIVE</div>
      </div>

      {/* 3. Faint Vertical Japanese Archival Seals */}
      <div className="absolute top-1/4 left-6 lg:left-12 font-serif text-[72px] lg:text-[110px] text-[var(--ink-muted)] opacity-[0.03] leading-none writing-vertical select-none hidden sm:block">
        小樽織物
      </div>

      <div className="absolute bottom-28 right-8 lg:right-16 font-serif text-[64px] lg:text-[96px] text-[var(--ink-muted)] opacity-[0.025] leading-none writing-vertical select-none hidden lg:block">
        百七年修理
      </div>

      {/* 4. Subtle Hairline Grid Matrix Points */}
      <div className="absolute top-12 left-1/4 w-px h-32 bg-[var(--hairline)] opacity-40 hidden lg:block" />
      <div className="absolute top-44 right-1/3 w-28 h-px bg-[var(--hairline)] opacity-40 hidden lg:block" />
      <div className="absolute bottom-20 left-1/3 w-36 h-px bg-[var(--hairline)] opacity-40 hidden lg:block" />

      {/* 5. Radial Ambient Feathering */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[var(--indigo)]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
