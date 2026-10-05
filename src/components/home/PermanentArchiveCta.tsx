'use client';

import React from 'react';
import Link from 'next/link';

/**
 * PermanentArchiveCta — Movement 09: Permanent Archive Invitation
 * 
 * Invites visitors to explore the entire 10-piece historical ledger,
 * spanning Outerwear, Trousers, Overshirts, and Accessories.
 */
export function PermanentArchiveCta() {
  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)] border-t border-hairline" id="archive-cta">
      <div className="wrap">
        <div className="border border-hairline bg-[var(--paper-2)] p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="max-w-[58ch] relative z-10">
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--indigo)] font-semibold block mb-3">
              Permanent Holdings · Movement 09
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] tracking-tight mb-4 leading-tight">
              Ten objects. Four chapters. Zero seasonal surplus.
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink)]/75 leading-relaxed font-light font-sans">
              Inspect our full historical archive spanning Tokushima raw twills, Kiryū sandwashed silks, and Ōmi heavyweight canvas totes. Complete with millimeter measurements and provenance records.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/archive"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--ink)] text-[var(--paper)] text-xs font-mono tracking-widest uppercase hover:bg-[var(--indigo)] transition-colors"
            >
              <span>Enter The Archive</span>
              <span>→</span>
            </Link>
          </div>

          {/* Watermark character in background */}
          <div className="absolute right-6 -bottom-8 pointer-events-none select-none text-[140px] font-serif text-[var(--ink)]/[0.03]">
            蔵
          </div>

        </div>
      </div>
    </section>
  );
}
