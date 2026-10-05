'use client';

import React, { useState } from 'react';

interface ObjectFitCalculatorProps {
  onSelectSize: (size: string) => void;
  availableSizes: [string, number][];
}

/**
 * ObjectFitCalculator — Interactive Size Recommendation Tool
 * 
 * Replaces generic sizing charts with an interactive sizing consultation.
 */
export function ObjectFitCalculator({ onSelectSize, availableSizes }: ObjectFitCalculatorProps) {
  const [height, setHeight] = useState<number>(180);
  const [build, setBuild] = useState<'slim' | 'regular' | 'broad'>('regular');
  const [fitPreference, setFitPreference] = useState<'tailored' | 'relaxed'>('relaxed');
  const [isOpen, setIsOpen] = useState(false);

  // Compute recommendation
  const getRecommendation = () => {
    if (height < 168) {
      return build === 'slim' ? 'XS' : 'S';
    }
    if (height < 178) {
      if (build === 'slim') return fitPreference === 'tailored' ? 'S' : 'M';
      return fitPreference === 'tailored' ? 'M' : 'M';
    }
    if (height < 188) {
      if (build === 'broad') return 'XL';
      return fitPreference === 'tailored' ? 'M' : 'L';
    }
    return build === 'broad' ? 'XL' : 'L';
  };

  const recommendedSize = getRecommendation();
  const isAvailable = availableSizes.some(([s, count]) => s === recommendedSize && count > 0);

  return (
    <div className="border border-hairline bg-[var(--paper)] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--indigo)] font-semibold">◈</span>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink)]">
            Find Your Silhouette
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-mono text-[var(--indigo)] hover:underline"
        >
          {isOpen ? 'Close Tool −' : 'Calculate Size +'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 pt-4 border-t border-hairline space-y-4 font-mono text-xs">
          {/* Height Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[var(--ink-muted)]">Your Height</span>
              <span className="font-bold text-[var(--ink)]">{height} cm</span>
            </div>
            <input
              type="range"
              min="160"
              max="200"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-[var(--indigo)] cursor-pointer"
            />
          </div>

          {/* Build Selector */}
          <div>
            <span className="text-[var(--ink-muted)] block mb-1.5">Body Build</span>
            <div className="grid grid-cols-3 gap-2">
              {(['slim', 'regular', 'broad'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBuild(b)}
                  className={`py-1.5 border text-center uppercase tracking-wider text-[11px] transition-colors ${
                    build === b
                      ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                      : 'bg-[var(--paper-2)] text-[var(--ink)] border-hairline'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Preference */}
          <div>
            <span className="text-[var(--ink-muted)] block mb-1.5">Preferred Fit</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFitPreference('tailored')}
                className={`py-1.5 border text-center uppercase tracking-wider text-[11px] transition-colors ${
                  fitPreference === 'tailored'
                    ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                    : 'bg-[var(--paper-2)] text-[var(--ink)] border-hairline'
                }`}
              >
                Tailored (Closer)
              </button>
              <button
                type="button"
                onClick={() => setFitPreference('relaxed')}
                className={`py-1.5 border text-center uppercase tracking-wider text-[11px] transition-colors ${
                  fitPreference === 'relaxed'
                    ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                    : 'bg-[var(--paper-2)] text-[var(--ink)] border-hairline'
                }`}
              >
                Archival (Relaxed)
              </button>
            </div>
          </div>

          {/* Recommendation Output */}
          <div className="p-3 bg-[var(--paper-2)] border border-hairline flex items-center justify-between mt-4">
            <div>
              <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block">
                Recommended Allocation
              </span>
              <span className="text-base font-bold text-[var(--ink)]">
                Size {recommendedSize}
              </span>
              <span className="text-[10px] text-[var(--ink-muted)] ml-2">
                ({isAvailable ? 'In Stock' : 'Low Allocation'})
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectSize(recommendedSize)}
              className="px-3 py-1.5 bg-[var(--indigo)] text-white text-[11px] uppercase tracking-wider hover:bg-[var(--indigo-hover)]"
            >
              Apply Size →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
