'use client';

import React from 'react';
import { Product } from '@/lib/catalog';

interface ObjectPassportProps {
  productId: string;
  product: Product;
}

/**
 * ObjectPassport — Physical Provenance Certificate
 * 
 * An archival document confirming the batch numbering, loom origin,
 * and lifetime canal repair registration of the object.
 */
export function ObjectPassport({ productId, product }: ObjectPassportProps) {
  const objectId = product.specs.find(([k]) => k.includes('Object ID'))?.[1] || `ARC-${productId}-OTR`;
  const loom = product.specs.find(([k]) => k.includes('Loom'))?.[1] || 'Traditional Heritage Shuttle Loom';
  const weave = product.specs.find(([k]) => k.includes('Weave'))?.[1] || 'Botanical Hand-Loom Twill';

  return (
    <div className="border border-hairline bg-[var(--paper-2)] p-6 sm:p-8 relative overflow-hidden font-mono text-xs select-none">
      {/* Background Archival Seal */}
      <div className="absolute right-4 top-4 text-5xl font-serif text-[var(--indigo)]/10 pointer-events-none select-none">
        小樽
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hairline mb-6 gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--indigo)]" />
          <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
            ARCHIVAL PASSPORT & PROVENANCE RECORD
          </span>
        </div>
        <span className="text-[10px] text-[var(--indigo)] tracking-widest uppercase">
          LEDGER VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
            Archival Registry
          </span>
          <span className="text-sm font-bold text-[var(--ink)] tracking-wider">
            {objectId}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
            Allocation Run
          </span>
          <span className="text-sm text-[var(--ink)]">
            {product.runQuantity}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
            Apparatus
          </span>
          <span className="text-xs text-[var(--ink)] truncate block" title={loom}>
            {loom}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
            Repair Guarantee
          </span>
          <span className="text-xs text-[var(--indigo)] font-medium">
            Lifetime Canal Atelier
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-hairline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[var(--ink-muted)]">
        <span>Crafted under the supervision of Otaru Canal Atelier, Hokkaido.</span>
        <span className="font-sans text-xs text-[var(--ink)]">
          Permanent Archival Holding · Chapter I
        </span>
      </div>
    </div>
  );
}
