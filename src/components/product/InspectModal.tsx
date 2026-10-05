'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Hotspot {
  id: string;
  num: string;
  title: string;
  detail: string;
  x: number; // percentage
  y: number; // percentage
}

interface InspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  productName: string;
  objectNumber: string;
}

const DEFAULT_HOTSPOTS: Hotspot[] = [
  {
    id: 'hardware',
    num: '01',
    title: 'Solid Brass Button',
    detail: 'Custom turned raw brass with a matte blackened chemical bath. Develops warm golden highlights with use.',
    x: 50,
    y: 48,
  },
  {
    id: 'stitch',
    num: '02',
    title: 'Triple-Needle Felled Seam',
    detail: 'Encased raw edge with high-tensile core thread. Prevents fraying and withstands decades of stress.',
    x: 28,
    y: 52,
  },
  {
    id: 'canvas',
    num: '03',
    title: '14.5oz Indigo Twill',
    detail: 'Woven on 1968 Toyoda G3 shuttle looms. Heavy slub texture with rich botanical indigo depth.',
    x: 68,
    y: 38,
  },
  {
    id: 'pocket',
    num: '04',
    title: 'Gusseted Utility Pocket',
    detail: 'Deep drop pocket with interior bar tacks and reinforced pocket corners.',
    x: 35,
    y: 72,
  },
];

/**
 * InspectModal — Full-Screen Detail & Macro Hotspot Inspector
 */
export function InspectModal({
  isOpen,
  onClose,
  imageSrc,
  productName,
  objectNumber,
}: InspectModalProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string>('hardware');

  if (!isOpen) return null;

  const currentHotspot = DEFAULT_HOTSPOTS.find((h) => h.id === activeHotspotId) || DEFAULT_HOTSPOTS[0]!;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-[var(--ink)]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="bg-[var(--paper)] max-w-5xl w-full border border-hairline overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-hairline bg-[var(--paper)]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
              {objectNumber} · Detail Inspection Mode
            </span>
            <h3 className="font-display text-2xl text-[var(--ink)]">{productName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs uppercase px-4 py-2 border border-hairline bg-[var(--paper-2)] hover:bg-[var(--paper)] text-[var(--ink)]"
          >
            Close ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Main Annotated Canvas */}
          <div className="lg:col-span-8 relative aspect-[4/5] sm:aspect-square bg-[var(--ink)] select-none">
            <Image
              src={imageSrc}
              alt={`${productName} inspect canvas`}
              fill
              unoptimized
              className="object-cover object-center"
            />

            {/* Hotspots */}
            {DEFAULT_HOTSPOTS.map((spot) => {
              const isActive = activeHotspotId === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspotId(spot.id)}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 transition-transform ${
                    isActive ? 'scale-125' : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`Inspect ${spot.title}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shadow-lg ${
                      isActive
                        ? 'bg-[var(--indigo)] text-white ring-4 ring-[var(--indigo)]/40'
                        : 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--ink)]'
                    }`}
                  >
                    {spot.num}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Side Annotation Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[var(--paper-2)] border-l border-hairline">
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--indigo)] font-semibold block mb-2">
                POINT {currentHotspot.num}
              </span>
              <h4 className="font-display text-xl sm:text-2xl text-[var(--ink)] mb-4">
                {currentHotspot.title}
              </h4>
              <p className="text-sm text-[var(--ink)]/80 leading-relaxed font-sans mb-8">
                {currentHotspot.detail}
              </p>
            </div>

            {/* Hotspot List Selector */}
            <div className="border-t border-hairline pt-6">
              <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block mb-3">
                All Inspected Points:
              </span>
              <div className="space-y-2">
                {DEFAULT_HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotspotId(h.id)}
                    className={`w-full text-left font-mono text-xs px-3 py-2 border transition-colors flex items-center justify-between ${
                      activeHotspotId === h.id
                        ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] font-medium'
                        : 'bg-[var(--paper)] text-[var(--ink)] border-hairline hover:border-[var(--ink)]'
                    }`}
                  >
                    <span>{h.num}. {h.title}</span>
                    <span>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
