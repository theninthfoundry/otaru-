'use client';

import React from 'react';

interface CraftProvenanceMapProps {
  origin: string;
}

/**
 * CraftProvenanceMap — Visual Provenance & Making Sequence
 * 
 * Shows the journey from raw agricultural fiber to finished archival garment.
 */
export function CraftProvenanceMap({ origin }: CraftProvenanceMapProps) {
  const steps = [
    {
      step: '01',
      stage: 'FIBER & WEAVE',
      locale: origin.split('·')[0]?.trim() || 'Tokushima',
      detail: 'Woven on unhurried vintage shuttle looms running low mechanical tension.',
    },
    {
      step: '02',
      stage: 'PATTERN CUTTING',
      locale: 'Otaru Canal Atelier',
      detail: 'Individually grain-matched and chalked by hand along wide cedar cutting tables.',
    },
    {
      step: '03',
      stage: 'HEAVY FELLED SEAMS',
      locale: 'Master Workshop',
      detail: 'Triple-needle stitched with heavy thread; reinforced stress points and bar tacks.',
    },
    {
      step: '04',
      stage: 'COLD RIVER RINSE',
      locale: 'Hokkaido Spring Water',
      detail: 'Natural rinse to set indigo dye and eliminate artificial machine oil residue.',
    },
    {
      step: '05',
      stage: 'NUMBERED PASSPORT',
      locale: 'Archival Vault',
      detail: 'Individually stamped, registered into the lifetime ledger, and folded into breathable linen.',
    },
  ];

  return (
    <div className="border border-hairline bg-[var(--paper)] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-hairline mb-8 gap-4">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-1">
            Provenance Flow
          </span>
          <h3 className="font-display text-2xl text-[var(--ink)]">
            How this object was made.
          </h3>
        </div>
        <span className="font-mono text-xs text-[var(--indigo)]">
          5 Stages · 100% Traceable
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((s, idx) => (
          <div key={s.step} className="flex flex-col justify-between border-t border-hairline pt-4">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[var(--indigo)] font-semibold mb-2">
                <span>STAGE {s.step}</span>
                {idx < steps.length - 1 && <span className="hidden lg:inline text-[var(--ink-muted)]">→</span>}
              </div>
              <h4 className="font-display text-base text-[var(--ink)] mb-1">
                {s.stage}
              </h4>
              <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-wider block mb-2">
                {s.locale}
              </span>
              <p className="text-xs text-[var(--ink)]/75 leading-relaxed font-sans">
                {s.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
