'use client';

import React, { useState } from 'react';

interface TimelineStage {
  period: string;
  kanji: string;
  title: string;
  lead: string;
  description: string;
  indicators: string[];
}

const STAGES: TimelineStage[] = [
  {
    period: 'DAY 01',
    kanji: '新',
    title: 'The Unbroken Cloth',
    lead: 'Crisp, dark, architectural',
    description: 'Fresh from the cutting table. The unwashed raw indigo twill is stiff and deep midnight blue. The brass buttons have a soft satin matte finish.',
    indicators: ['Raw 14.5oz stiffness', '100% indigo saturation', 'Pristine topstitching'],
  },
  {
    period: 'MONTH 06',
    kanji: '痕',
    title: 'First Crease Memory',
    lead: 'Adapts to your posture',
    description: 'Radial whiskers form behind the elbows and across the chest where your arms rest. The collar softens against the neck, holding your natural silhouette.',
    indicators: ['Elbow honeycomb fading', 'Collar roll settles', 'Slight canvas softening'],
  },
  {
    period: 'YEAR 02',
    kanji: '深',
    title: 'Botanical Contrast',
    lead: 'High-friction patina emerges',
    description: 'The natural sukumo dye sheds its surface layer at friction points, exposing the undyed white cotton core. The brass hardware develops soft burnished highlights.',
    indicators: ['High-contrast electric blue fades', 'Brass edge burnish', 'Supple broken-in drape'],
  },
  {
    period: 'YEAR 05',
    kanji: '残',
    title: 'Personal Artifact',
    lead: 'Eligible for atelier boro repair',
    description: 'A second skin. Any seam friction point is repaired by hand with antique sashiko thread in our canal atelier, adding permanent character to your life record.',
    indicators: ['Individual patina mapping', 'Lifetime atelier boro stitch', 'Irreplaceable personal artifact'],
  },
];

/**
 * ObjectLifeTimeline — Movement 08: Garment Longevity Timeline (TRUST & ATTACHMENT)
 * 
 * Demonstrates the 5-year evolution of botanical indigo canvas.
 * Proves that an Otaru object appreciates in emotional value with time.
 */
export function ObjectLifeTimeline() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="section-pad bg-[var(--paper-2)] text-[var(--ink)] border-t border-hairline" id="longevity">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Longevity Cycle · Movement 08
            </span>
            <h2 className="display-l text-[var(--ink)]">
              Object life timeline.
            </h2>
          </div>
          <p className="text-sm text-[var(--ink)]/65 max-w-[36ch] leading-relaxed">
            Botanical indigo is alive. How an Otaru garment breaks in, records movement, and ages across five years of daily use.
          </p>
        </div>

        {/* 4-Stage Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {STAGES.map((stage, idx) => {
            const isSelected = activeStage === idx;
            return (
              <div
                key={stage.period}
                onClick={() => setActiveStage(idx)}
                className={`cursor-pointer border p-6 flex flex-col justify-between transition-all duration-300 ${
                  isSelected
                    ? 'bg-[var(--paper)] border-[var(--ink)] shadow-sm -translate-y-1'
                    : 'bg-[var(--paper)]/50 border-hairline hover:border-[var(--ink)]/40 hover:bg-[var(--paper)]'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStage(idx);
                  }
                }}
              >
                <div>
                  {/* Top Timeline Indicator */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
                    <span className="font-mono text-xs font-semibold text-[var(--indigo)]">
                      {stage.period}
                    </span>
                    <span className="w-6 h-6 flex items-center justify-center font-serif text-xs border border-hairline text-[var(--ink-muted)] bg-[var(--paper-2)]">
                      {stage.kanji}
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-[var(--ink)] mb-1">
                    {stage.title}
                  </h3>
                  <span className="font-mono text-xs text-[var(--ink-muted)] block mb-4">
                    {stage.lead}
                  </span>
                  <p className="text-xs text-[var(--ink)]/75 leading-relaxed font-sans mb-6">
                    {stage.description}
                  </p>
                </div>

                {/* Key Indicators */}
                <div className="border-t border-hairline pt-4 space-y-1.5 font-mono text-[11px] text-[var(--ink-muted)]">
                  {stage.indicators.map((ind, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--indigo)]" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Repair Ledger Callout */}
        <div className="mt-12 bg-[var(--paper)] border border-hairline p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-[54ch]">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--indigo)] block mb-1">
              CANAL ATELIER POLICY
            </span>
            <h4 className="font-display text-xl text-[var(--ink)] mb-2">
              Every garment is eligible for lifetime visible boro repairs.
            </h4>
            <p className="text-xs text-[var(--ink)]/70 leading-relaxed font-sans">
              When a hem frays or a pocket corner tears after years of carry, return it to our Otaru canal studio. Our tailors mend it using sashiko thread and archival cloth remnants.
            </p>
          </div>
          <a
            href="mailto:concierge@otaru.in?subject=Atelier%20Repair%20Inquiry"
            className="px-6 py-3 border border-hairline text-xs font-mono tracking-widest uppercase text-[var(--ink)] hover:bg-[var(--paper-2)] transition-colors whitespace-nowrap"
          >
            Inquire Repair Desk →
          </a>
        </div>

      </div>
    </section>
  );
}
