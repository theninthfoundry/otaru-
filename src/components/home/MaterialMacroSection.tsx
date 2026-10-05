'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MaterialZone {
  id: string;
  number: string;
  title: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

interface MaterialStudy {
  id: string;
  name: string;
  origin: string;
  weight: string;
  weave: string;
  summary: string;
  image: string;
  zones: MaterialZone[];
}

const MATERIALS: MaterialStudy[] = [
  {
    id: 'indigo',
    name: '14.5oz Raw Indigo Twill',
    origin: 'Tokushima, Japan',
    weight: '480 GSM · 14.5oz',
    weave: '3/1 Right-Hand Botanical Twill',
    summary: 'Woven on unhurried 1968 Toyoda G3 shuttle looms. The botanical sukumo indigo clings to the yarn exterior while the undyed core remains untouched, yielding high-contrast fades across years of wear.',
    image: '/api/images/macro-indigo',
    zones: [
      {
        id: 'fiber',
        number: '01',
        title: 'FIBER',
        description: 'Long-staple organic cotton slub yarn, spun with deliberate irregularity for high-tactile drape.',
        x: 32,
        y: 40,
      },
      {
        id: 'weave',
        number: '02',
        title: 'WEAVE',
        description: 'Low-tension 3/1 right-hand twill that breathe freely while resisting wind penetration.',
        x: 68,
        y: 35,
      },
      {
        id: 'dye',
        number: '03',
        title: 'DYE',
        description: '14 successive dips in naturally fermented sukumo indigo vats; unwashed raw finish.',
        x: 48,
        y: 65,
      },
      {
        id: 'wear',
        number: '04',
        title: 'WEAR',
        description: 'Undyed cotton yarn core gradually reveals itself at creases, cuffs, and natural friction lines.',
        x: 75,
        y: 72,
      },
    ],
  },
  {
    id: 'hemp',
    name: 'Raw Ōmi Bast Hemp',
    origin: 'Ōmi, Shiga Prefecture',
    weight: '540 GSM · 16oz',
    weave: 'Plain Double-Warp Canvas',
    summary: 'Extracted from pesticide-free bast hemp stalks and washed in alpine river water. Naturally antimildew, cool in humidity, windproof in deep frost.',
    image: '/api/images/044',
    zones: [
      {
        id: 'fiber',
        number: '01',
        title: 'FIBER',
        description: 'Hollow bast fibers that regulate internal temperature naturally through micro-aeration.',
        x: 35,
        y: 45,
      },
      {
        id: 'weave',
        number: '02',
        title: 'WEAVE',
        description: 'Dense double-warp sailmaker canvas binding, virtually indestructible under heavy load.',
        x: 65,
        y: 40,
      },
      {
        id: 'dye',
        number: '03',
        title: 'DYE',
        description: 'Sun-bleached and river-rinsed; zero synthetic bleaches or chemical softeners.',
        x: 50,
        y: 65,
      },
      {
        id: 'wear',
        number: '04',
        title: 'WEAR',
        description: 'Softens with water and time; creases settle into leather-like suppleness.',
        x: 78,
        y: 68,
      },
    ],
  },
];

/**
 * MaterialMacroSection — Movement 04: Material Study (PROOF & TRUST)
 * 
 * Tactile zone-based exploration: inspect weave, fiber, dye, and aging
 * directly on high-magnification cloth.
 */
export function MaterialMacroSection() {
  const [activeMaterialIdx, setActiveMaterialIdx] = useState(0);
  const [activeZoneId, setActiveZoneId] = useState<string>('fiber');

  const current = MATERIALS[activeMaterialIdx] ?? MATERIALS[0]!;
  const currentZone = current.zones.find((z) => z.id === activeZoneId) || current.zones[0]!;

  return (
    <section className="section-pad bg-[var(--paper-2)] text-[var(--ink)] border-t border-hairline" id="material">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Tactile Study · Movement 04
            </span>
            <h2 className="display-l text-[var(--ink)]">
              Material study.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {String(activeMaterialIdx + 1).padStart(2, '0')} / {String(MATERIALS.length).padStart(2, '0')}
            </span>
            <div className="inline-flex border border-hairline bg-[var(--paper)]">
              {MATERIALS.map((mat, idx) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => {
                    setActiveMaterialIdx(idx);
                    setActiveZoneId(MATERIALS[idx]?.zones[0]?.id || 'fiber');
                  }}
                  className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                    activeMaterialIdx === idx
                      ? 'bg-[var(--ink)] text-[var(--paper)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                  aria-label={`Inspect ${mat.name}`}
                >
                  {mat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tactile Study Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-center">
          
          {/* Left Column: Interactive Macro Canvas with Hotspot Pins */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square w-full border border-hairline bg-[var(--ink)] overflow-hidden shadow-lg select-none">
              
              {/* Macro Image */}
              <Image
                src={current.image}
                alt={`${current.name} macro study`}
                fill
                unoptimized
                className="object-cover object-center transition-all duration-700 ease-out"
              />

              {/* Subtle Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Hotspot Pins */}
              {current.zones.map((zone) => {
                const isActive = activeZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setActiveZoneId(zone.id)}
                    style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group flex items-center gap-2 p-1.5 focus:outline-none transition-all duration-300 ${
                      isActive ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Inspect zone ${zone.number} ${zone.title}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold shadow-md transition-all ${
                      isActive
                        ? 'bg-[var(--indigo)] text-white ring-4 ring-[var(--indigo)]/30'
                        : 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--ink)]/40 hover:bg-[var(--indigo)] hover:text-white'
                    }`}>
                      {zone.number}
                    </span>
                    <span className={`hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-1 bg-[var(--paper)]/95 text-[var(--ink)] border border-hairline shadow-sm backdrop-blur-xs transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {zone.title}
                    </span>
                  </button>
                );
              })}

              {/* Lower Overlay Badge */}
              <div className="absolute bottom-4 left-4 z-10 font-mono text-[11px] tracking-widest uppercase bg-[var(--paper)]/90 backdrop-blur-sm px-3 py-1.5 text-[var(--ink)] border border-hairline">
                Interactive Weave Study · 1:1 Scale
              </div>
            </div>
          </div>

          {/* Right Column: Zone Story & Provenance Ledger */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Material Title */}
              <span className="font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase block mb-1">
                {current.origin}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mb-4">
                {current.name}
              </h3>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed mb-8">
                {current.summary}
              </p>

              {/* Focused Zone Callout */}
              <div className="bg-[var(--paper)] border border-hairline p-6 mb-8 relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold text-[var(--indigo)]">
                    ZONE {currentZone.number}
                  </span>
                  <span className="text-[var(--ink-muted)]">·</span>
                  <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink)] font-medium">
                    {currentZone.title}
                  </span>
                </div>
                <p className="text-sm text-[var(--ink)]/85 leading-relaxed font-sans">
                  {currentZone.description}
                </p>

                {/* Zone Quick-Switcher Dots */}
                <div className="mt-5 pt-4 border-t border-hairline flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider">
                    Select zone:
                  </span>
                  <div className="flex items-center gap-2">
                    {current.zones.map((z) => (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => setActiveZoneId(z.id)}
                        className={`font-mono text-xs px-2 py-0.5 border transition-colors ${
                          activeZoneId === z.id
                            ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                            : 'bg-[var(--paper-2)] text-[var(--ink-muted)] border-hairline hover:text-[var(--ink)]'
                        }`}
                      >
                        {z.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Concise Specifications */}
              <div className="border-t border-hairline pt-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-hairline/60">
                  <span className="text-[var(--ink-muted)]">Density</span>
                  <span className="text-[var(--ink)] font-medium">{current.weight}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline/60">
                  <span className="text-[var(--ink-muted)]">Binding</span>
                  <span className="text-[var(--ink)]">{current.weave}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--ink-muted)]">Provenance</span>
                  <span className="text-[var(--ink)]">{current.origin}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
