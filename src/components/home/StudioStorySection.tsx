'use client';

import React from 'react';
import Link from 'next/link';

export function StudioStorySection() {
  return (
    <section className="section-pad bg-[var(--paper-2)] text-[var(--ink)] border-t border-hairline" id="story">
      <div className="wrap max-w-4xl">
        <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-6 text-center">
          Atelier Philosophy
        </span>

        {/* The Core Studio Quote */}
        <blockquote className="font-display text-[clamp(1.75rem,3.8vw,3.2rem)] text-center leading-snug tracking-[-0.01em] text-[var(--ink)] mb-8 text-balance">
          “They want to hold the fabric up to the window. To see the weave breathe before they wear it.”
        </blockquote>

        <p className="text-center text-sm sm:text-base text-[var(--ink)]/75 max-w-[54ch] mx-auto leading-relaxed mb-10">
          We work out of a stone warehouse along the Otaru canal. We do not design for trends or restock sold runs. Every garment is cut slowly, stitched with heavy selvedge threads, and catalogued under an irrevocable lifetime repair commitment.
        </p>

        <div className="flex justify-center">
          <Link
            href="/studio"
            className="text-xs font-mono uppercase tracking-widest px-6 py-3 border border-hairline bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
          >
            Read Studio Archive →
          </Link>
        </div>
      </div>
    </section>
  );
}
