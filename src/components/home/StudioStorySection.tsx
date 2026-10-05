'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { STUDIO_VALUES } from '@/lib/catalog';

/**
 * StudioStorySection — Movement 07: Studio & Hands (PROOF & HUMAN PRESENCE)
 * 
 * Demonstrates real human hands, physical workspace, and studio values.
 * Anchors the brand in physical reality along the Otaru canal.
 */
export function StudioStorySection() {
  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)] border-t border-hairline" id="studio">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Atelier Provenance · Movement 07
            </span>
            <h2 className="display-l text-[var(--ink)]">
              The canal studio.
            </h2>
          </div>
          <p className="text-sm text-[var(--ink)]/65 max-w-[36ch] leading-relaxed">
            Housed inside an unheated 1907 stone warehouse along the Otaru canal. Real cloth, living dye vats, and repair needles.
          </p>
        </div>

        {/* Main Spread: Large Photography & Core Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-center">
          
          {/* Left: Artisan Hands Studio Photography */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] w-full border border-hairline overflow-hidden bg-[var(--ink)] shadow-md group">
              <Image
                src="/api/images/studio-hands"
                alt="Artisan hands repairing raw indigo textile in Otaru canal studio"
                fill
                unoptimized
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] tracking-widest uppercase bg-[var(--paper)]/90 backdrop-blur-xs px-3 py-1.5 text-[var(--ink)] border border-hairline">
                Canal Atelier · Bench 03
              </div>
            </div>
          </div>

          {/* Right: Studio Philosophy & Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[var(--indigo)] font-semibold tracking-wider uppercase block mb-3">
                Since 1907 · Otaru Canal
              </span>
              <blockquote className="font-display text-2xl sm:text-3xl text-[var(--ink)] leading-snug tracking-tight mb-6">
                “They want to hold the fabric up to the window. To see the weave breathe before they wear it.”
              </blockquote>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed font-sans mb-8">
                Every pattern we draft begins with a single yard of loom-state fabric hung against the harbor light. We watch how it falls, how moisture alters its drape, and how many years it will take to soften.
              </p>
            </div>

            <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-[var(--paper)] text-xs font-mono tracking-widest uppercase hover:bg-[var(--indigo)] transition-colors"
              >
                <span>Visit the Studio</span>
                <span>→</span>
              </Link>
              <Link
                href="/journal"
                className="text-xs font-mono tracking-wider uppercase text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors px-2 py-3"
              >
                Read Field Notes
              </Link>
            </div>
          </div>

        </div>

        {/* Studio Values Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-16 mt-16 border-t border-hairline">
          {STUDIO_VALUES.map((val, idx) => (
            <div key={val.title} className="flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[var(--indigo)] block mb-2 font-semibold">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-lg text-[var(--ink)] mb-2">
                  {val.title}
                </h3>
                <p className="text-xs text-[var(--ink)]/75 leading-relaxed font-sans">
                  {val.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
