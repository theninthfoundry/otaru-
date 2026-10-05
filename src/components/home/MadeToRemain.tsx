'use client';

import React from 'react';
import Link from 'next/link';

/**
 * MadeToRemain — Movement 11: The Repair Ledger (TRUST & CONVICTION)
 * 
 * WEAR → REPAIR → RETURN → WEAR AGAIN
 * The antithesis of disposable fast fashion.
 */
export function MadeToRemain() {
  const steps = [
    {
      num: '01',
      title: 'WEAR FREELY',
      kanji: '着',
      subtitle: 'No preservation anxiety',
      text: 'Our garments are engineered for rough weather, salt spray, heavy friction, and continuous daily movement. You do not need to baby them.',
    },
    {
      num: '02',
      title: 'SEND TO ATELIER',
      kanji: '送',
      subtitle: 'Postage covered worldwide',
      text: 'When a seam gives way, a button pulls, or canvas frays after years of wear, contact our concierge desk. We send a secure return mailer to your door.',
    },
    {
      num: '03',
      title: 'VISIBLE BORO REPAIR',
      kanji: '繕',
      subtitle: 'Hand-sewn in Otaru',
      text: 'Our tailors reinforce the wear zone using sashiko stitching and archival cloth swatches. The repair is intentional, visible, and unique to your story.',
    },
    {
      num: '04',
      title: 'WEAR FOR DECADES',
      kanji: '継',
      subtitle: 'Recorded in the ledger',
      text: 'Your piece returns with a stamped atelier mending record. An object with a visible repair carries more pride and history than a pristine copy.',
    },
  ];

  return (
    <section className="section-pad bg-[var(--paper-2)] text-[var(--ink)] border-t border-hairline" id="repair">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Lifetime Commitment · Movement 11
            </span>
            <h2 className="display-l text-[var(--ink)]">
              Made to remain.
            </h2>
          </div>
          <p className="text-sm text-[var(--ink)]/65 max-w-[36ch] leading-relaxed">
            Every garment sold includes our permanent canal studio repair commitment. We mend visibly, for free, for as long as we exist.
          </p>
        </div>

        {/* 4 Steps Lifecycle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {steps.map((step) => (
            <div
              key={step.num}
              className="border border-hairline bg-[var(--paper)] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
                  <span className="font-mono text-xs font-semibold text-[var(--indigo)]">
                    STEP {step.num}
                  </span>
                  <span className="w-6 h-6 flex items-center justify-center font-serif text-xs border border-hairline text-[var(--ink-muted)] bg-[var(--paper-2)]">
                    {step.kanji}
                  </span>
                </div>
                <h3 className="font-display text-xl text-[var(--ink)] mb-1">
                  {step.title}
                </h3>
                <span className="font-mono text-xs text-[var(--ink-muted)] block mb-4">
                  {step.subtitle}
                </span>
                <p className="text-xs text-[var(--ink)]/75 leading-relaxed font-sans">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Banner with Concierge Link */}
        <div className="mt-12 bg-[var(--ink)] text-[var(--paper)] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-hairline">
          <div className="max-w-[56ch]">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              THE OTARU GUARANTEE
            </span>
            <h4 className="font-display text-2xl sm:text-3xl text-white mb-2 tracking-tight">
              “A repaired garment is more valuable than an untouched one.”
            </h4>
            <p className="text-xs sm:text-sm text-[var(--paper)]/75 leading-relaxed font-light">
              We keep spare yardage from every historical batch in our dry cedar racks specifically for lifetime mending.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:concierge@otaru.in?subject=Repair%20Ledger%20Inquiry"
              className="px-6 py-3.5 bg-[var(--paper)] text-[var(--ink)] text-xs font-mono tracking-widest uppercase hover:bg-[var(--paper-subtle)] transition-colors whitespace-nowrap"
            >
              Open Repair Request →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
