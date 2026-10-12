'use client';

import React from 'react';
import { CARE_SETS, Product } from '@/lib/catalog';

interface CartGarmentCareModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function CartGarmentCareModal({ product, isOpen, onClose }: CartGarmentCareModalProps) {
  if (!isOpen) return null;

  const careKey = product.care || 'indigo';
  const careInstructions = CARE_SETS[careKey] || CARE_SETS.indigo || [];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3.5 sm:p-6 bg-[var(--ink)]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="care-modal-title"
    >
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto overscroll-contain bg-[var(--paper)] text-[var(--ink)] border border-[var(--hairline-strong)] shadow-2xl p-5 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-hairline mb-6">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--gold)] block mb-1">
              ATELIER PRESERVATION DOSSIER · {product.objectNumber}
            </span>
            <h3 id="care-modal-title" className="font-display text-2xl text-[var(--ink)]">
              {product.name} Care Protocol
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 font-mono text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            aria-label="Close preservation dossier"
          >
            ✕
          </button>
        </div>

        {/* Garment Fiber & Provenance */}
        <div className="p-4 bg-[var(--paper-2)] border border-hairline mb-6 text-xs font-sans">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] mb-1">
            Material Specification:
          </div>
          <p className="text-[var(--ink)] leading-relaxed font-medium">
            {product.material}
          </p>
        </div>

        {/* Care Instructions List */}
        <div className="space-y-4 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)] block font-semibold">
            Preservation Directives ({careKey.toUpperCase()} LOT):
          </span>
          <ul className="space-y-2.5">
            {careInstructions.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[var(--ink-muted)]">
                <span className="font-mono text-[var(--gold)] text-xs mt-0.5">0{idx + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lifetime Studio Repair Ledger Note */}
        <div className="pt-4 border-t border-hairline bg-[var(--paper)] flex items-start gap-3 text-[11px] text-[var(--ink-muted)] font-mono">
          <span className="font-serif text-sm text-[var(--otaru-torii)] flex-shrink-0">印</span>
          <div>
            <strong className="text-[var(--ink)] block">Lifetime Canal Repair Ledger</strong>
            <span>
              Covered under our permanent repair covenant. If any seam, gusset, or button yields after years of wear, return to the Otaru canal studio for visible sashiko and boro mending.
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-hairline flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-mono text-xs uppercase tracking-[0.18em] hover:bg-[var(--indigo)] transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
