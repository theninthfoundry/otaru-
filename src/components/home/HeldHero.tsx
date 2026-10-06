'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Atmospheric Hero — House of Otaru
 * 
 * Renders the definitive atelier indigo jacket still life with
 * editorial typography, chapter kicker, and interactive anchors.
 */
export function HeldHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollDown = () => {
    const target = document.getElementById('batch') || document.getElementById('new-drops');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.95, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden bg-[#070D14] text-[#F4F0E8] select-none"
      aria-label="House of Otaru — Chapter I"
    >
      {/* 1. Full-Bleed Atmospheric Still Life Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/api/hero-image?type=atelier"
          alt="House of Otaru Atelier — Indigo garment, craft tools, and Ikebana still life"
          fill
          priority
          sizes="100vw"
          quality={95}
          className={`object-cover object-[center_35%] transition-opacity duration-1000 ${
            isLoaded ? 'opacity-95 scale-100' : 'opacity-0 scale-[1.02]'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Tailored Film Grade Vignette Overlays for Maximum Text Legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(90deg, rgba(7, 13, 20, 0.82) 0%, rgba(7, 13, 20, 0.52) 38%, rgba(7, 13, 20, 0.18) 68%, rgba(7, 13, 20, 0.35) 100%)',
              'linear-gradient(0deg, rgba(7, 13, 20, 0.85) 0%, rgba(7, 13, 20, 0.25) 25%, transparent 55%)',
              'linear-gradient(180deg, rgba(7, 13, 20, 0.70) 0%, transparent 22%)',
            ].join(', '),
          }}
        />
      </div>

      {/* 2. Main Editorial Left Stage */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-28 sm:pt-36 lg:pt-40 flex-1 flex flex-col justify-center">
        <div className="max-w-[760px]">

          {/* Region & Era Kicker */}
          <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#F4F0E8]/70 mb-7 sm:mb-9 space-y-1">
            <p>JAPAN / INDIA</p>
            <p className="text-[#F4F0E8]/50">MMXXVI</p>
          </div>

          {/* Chapter Eyebrow */}
          <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#F4F0E8]/80 mb-5 sm:mb-6">
            CHAPTER I / KYOTO NIGHTS
          </div>

          {/* Master Display Quote */}
          <h1 className="font-display text-[clamp(2.5rem,5.6vw,5.25rem)] text-[#F4F0E8] leading-[1.08] tracking-[-0.015em] mb-7 sm:mb-8 font-light sm:font-normal">
            <span className="block">Inspired by the fear</span>
            <span className="block">of being average,</span>
            <span className="block italic font-normal text-[#F4F0E8]/95">and the perfect.</span>
          </h1>

          {/* Editorial Subcopy */}
          <p className="font-sans text-sm sm:text-base text-[#F4F0E8]/75 leading-relaxed mb-9 sm:mb-11 max-w-[36ch]">
            Japanese craft sensibility,
            <br />
            Indian cloth and hands.
          </p>

          {/* CTA Link to Current Batch */}
          <div>
            <Link
              href="/#batch"
              onClick={(e) => {
                const target = document.getElementById('batch');
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F4F0E8] border-b border-[#F4F0E8]/60 pb-1.5 hover:border-[#F4F0E8] hover:text-white transition-all group"
            >
              <span>DISCOVER THE CURRENT BATCH</span>
              <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 3. Mid-Right Vertical Tagline Specimen */}
      <div className="hidden lg:flex absolute right-6 sm:right-10 lg:right-14 xl:right-16 top-1/2 -translate-y-1/2 flex-col items-end text-right font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.30em] text-[#F4F0E8]/50 leading-[1.9] pointer-events-none z-10">
        <span>OBJECTS</span>
        <span>FOR A</span>
        <span>LONGER</span>
        <span>TOMORROW</span>
      </div>

      {/* 4. Bottom Horizon Bar (Left Origins + Right Scroll Cue) */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-14 xl:px-16 pb-8 sm:pb-10 flex items-center justify-between pointer-events-auto">
        
        {/* Bottom Left Triad */}
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#F4F0E8]/45">
          KYOTO / TOKYO / OTARU
        </div>

        {/* Bottom Right Interactive Scroll Button */}
        <button
          type="button"
          onClick={handleScrollDown}
          className="flex items-center gap-3 text-[#F4F0E8]/55 hover:text-[#F4F0E8] transition-colors group cursor-pointer focus:outline-none"
          aria-label="Scroll to next section"
        >
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em]">
            SCROLL
          </span>
          <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-white/60 flex items-center justify-center transition-colors">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform group-hover:translate-y-0.5 transition-transform"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </button>

      </div>
    </section>
  );
}
