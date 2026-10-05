'use client';

import React from 'react';
import Link from 'next/link';

/**
 * WhyThisObject — Movement 05: Editorial Justification (DESIRE & REASONING)
 * 
 * An uncompromising statement of purpose. An Otaru object is not designed
 * to chase seasonal trends; it exists because of a specific material conviction.
 */
export function WhyThisObject() {
  const pillars = [
    {
      num: '01',
      title: 'MATERIAL SOVEREIGNTY',
      lead: '14.5oz Raw Botanical Twill',
      body: 'Woven slowly on shuttle looms running at 90 picks per minute. Low tension lets the organic slub breathe, absorbing botanical indigo deeply into the exterior while keeping the yarn core crisp.',
    },
    {
      num: '02',
      title: 'PERMANENT ARCHITECTURE',
      lead: 'Triple-Needle Felled Seams',
      body: 'Every stress point is bound and reinforced with heavy topstitching. No synthetic adhesives, no cheap heat-bonded taping, no plastic interfacings to degrade with moisture.',
    },
    {
      num: '03',
      title: 'CLOSED RUN INTENTION',
      lead: 'Numbered Edition · Never Restocked',
      body: 'When the allocation is cut and bound, the pattern enters our permanent vault. Scarcity here is not marketing theater — it is the natural limit of hand-harvested botanical vats.',
    },
  ];

  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)] border-t border-hairline" aria-labelledby="why-heading">
      <div className="wrap">
        
        {/* Large Editorial Headline */}
        <div className="max-w-[840px] mb-16 lg:mb-20">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-4">
            Movement 05 · The Ethos
          </span>
          <h2 id="why-heading" className="font-display text-3xl sm:text-5xl lg:text-6xl text-[var(--ink)] tracking-tight leading-[1.08] mb-6">
            Built for cold mornings, wet streets, and the years that follow.
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink)]/70 max-w-[54ch] font-light leading-relaxed">
            We do not create collections for runways. We create numbered instruments for human movement, cut from textiles that grow more beautiful the more you lean on them.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 border-t border-hairline pt-12">
          {pillars.map((pillar) => (
            <div key={pillar.num} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
                  <span className="font-mono text-xs text-[var(--indigo)] font-semibold">
                    {pillar.num}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--ink-muted)]">
                    SPECIFICATION
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-[var(--ink)] mb-2">
                  {pillar.title}
                </h3>
                <span className="font-mono text-xs text-[var(--ink-muted)] block mb-4">
                  {pillar.lead}
                </span>
                <p className="text-sm text-[var(--ink)]/75 leading-relaxed font-sans">
                  {pillar.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Bar */}
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[var(--ink-muted)]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--indigo)]" />
            <span>Documented in the Otaru Canal Atelier Ledger</span>
          </div>
          <Link
            href="/studio"
            className="text-[var(--ink)] hover:text-[var(--indigo)] underline transition-colors"
          >
            Read Our Studio History →
          </Link>
        </div>

      </div>
    </section>
  );
}
