'use client';

import React, { useState } from 'react';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

interface MaterialSpec {
  id: string;
  name: string;
  origin: string;
  gsm: string;
  weave: string;
  loom: string;
  dyeVat: string;
  description: string;
}

const MATERIALS: MaterialSpec[] = [
  {
    id: 'indigo',
    name: 'Indigo Cotton Twill',
    origin: 'Tokushima, Japan',
    gsm: '480 GSM',
    weave: '3/1 Right-Hand Botanical Twill',
    loom: '1968 Toyoda G3 Vintage Shuttle Loom',
    dyeVat: '14x Fermented Sukumo Indigo Dip',
    description: 'Woven on unhurried low-tension shuttle looms. The irregular slub yarn absorbs botanical indigo unevenly, creating ten years of fading patina without fiber fatigue.',
  },
  {
    id: 'hemp',
    name: 'Raw Hemp Canvas',
    origin: 'Ōmi, Japan',
    gsm: '540 GSM',
    weave: 'Plain Weave Double-Warp Canvas',
    loom: 'Heavy Heritage Duck Loom',
    dyeVat: 'Undyed River-Rinsed Fiber',
    description: 'Extracted from pesticide-free hemp stalk, river-rinsed in mountain water. Cool in summer, wind-resistant in winter, naturally antimicrobial and virtually indestructible.',
  },
  {
    id: 'wool',
    name: 'Boiled Wool Felt',
    origin: 'Biratori, Hokkaido',
    gsm: '620 GSM',
    weave: 'Dense Boiled Compacted Melton',
    loom: 'Local Hokkaido Planetary Fuller',
    dyeVat: 'Natural Iron-Water Dip',
    description: 'Combed from northern sheep and boiled in canal mineral waters to shrink fibers by 40%. Repels freezing sea spray without synthetic waterproofing membranes.',
  },
  {
    id: 'silk',
    name: 'Sandwashed Silk Blend',
    origin: 'Kiryū, Japan',
    gsm: '290 GSM',
    weave: 'Crepe Weft Heavy Drape Twill',
    loom: 'Kiryū Jacquard Frame',
    dyeVat: 'Botanical Persimmon Tannin (Kakishibu)',
    description: 'Raw silk fibers tumbled with river sand for a dull chalk finish. Heavy architectural drape with whisper-quiet movement against the body.',
  },
];

export function MaterialMacroSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const current = (MATERIALS[selectedIdx] ?? MATERIALS[0])!;

  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)] border-t border-hairline" id="material">
      <div className="wrap">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Textile Library
            </span>
            <h2 className="display-l text-[var(--ink)]">
              Material study.
            </h2>
          </div>
          <p className="text-sm text-[var(--ink)]/65 max-w-[36ch]">
            Inspect one fabric at a time. Click the tactile swatch below for full-screen fiber magnification and loom telemetry.
          </p>
        </div>

        {/* Swatch Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-4 mb-10" role="tablist">
          {MATERIALS.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={selectedIdx === idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors border ${
                selectedIdx === idx
                  ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] font-medium'
                  : 'bg-[var(--paper-2)] text-[var(--ink)]/70 border-hairline hover:text-[var(--ink)]'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Single Focused Interactive Swatch Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Swatch Interactive Trigger */}
          <div className="lg:col-span-6">
            <div
              onClick={() => setIsModalOpen(true)}
              className="group relative cursor-pointer overflow-hidden border border-hairline bg-[var(--paper-2)] p-4"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsModalOpen(true);
                }
              }}
              aria-label={`Open full-screen macro inspection for ${current.name}`}
            >
              <div className="relative aspect-square overflow-hidden border border-hairline">
                <ImagePlaceholder ratio="swatch" label={current.name} />
                
                {/* Subtle Hover Cue */}
                <div className="absolute inset-0 bg-[var(--indigo)]/0 group-hover:bg-[var(--indigo)]/10 transition-colors flex items-center justify-center">
                  <span className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-[var(--paper)]/90 border border-hairline text-[var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Magnify ⊕
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Single Spec Ledger */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[var(--ink-muted)] block mb-2">
                Origin: {current.origin}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mb-4">
                {current.name}
              </h3>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed mb-8">
                {current.description}
              </p>
            </div>

            {/* Spec Table */}
            <div className="border-t border-hairline pt-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-hairline/60">
                <span className="text-[var(--ink-muted)]">Areal Density</span>
                <span className="text-[var(--ink)] font-medium">{current.gsm}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/60">
                <span className="text-[var(--ink-muted)]">Weave Binding</span>
                <span className="text-[var(--ink)]">{current.weave}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/60">
                <span className="text-[var(--ink-muted)]">Apparatus</span>
                <span className="text-[var(--ink)]">{current.loom}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--ink-muted)]">Color Ritual</span>
                <span className="text-[var(--ink)]">{current.dyeVat}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Full-Screen Macro Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-[var(--ink)]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[var(--paper)] max-w-2xl w-full p-8 border border-hairline relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">Macro Scan · 1:1 Scale</span>
                <h4 className="font-display text-2xl text-[var(--ink)]">{current.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="font-mono text-xs uppercase px-3 py-1 border border-hairline hover:bg-[var(--paper-2)] text-[var(--ink)]"
              >
                Close ✕
              </button>
            </div>

            <div className="aspect-video w-full border border-hairline overflow-hidden mb-6 bg-[var(--paper-2)]">
              <ImagePlaceholder ratio="wide" label={`${current.name} — Macro Weave Scan`} />
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-[var(--ink-muted)] block">Density:</span>
                <span className="text-[var(--ink)] font-bold">{current.gsm}</span>
              </div>
              <div>
                <span className="text-[var(--ink-muted)] block">Origin:</span>
                <span className="text-[var(--ink)]">{current.origin}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[var(--ink-muted)] block">Loom Specification:</span>
                <span className="text-[var(--ink)]">{current.loom}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
