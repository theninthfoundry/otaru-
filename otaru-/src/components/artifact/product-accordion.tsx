'use client';

import { useState } from 'react';
import type { Artifact } from '@/lib/shopify/types';

interface ProductAccordionProps {
  artifact: Artifact;
}

export function ProductAccordion({ artifact }: ProductAccordionProps) {
  const [openTab, setOpenTab] = useState<'specs' | 'fit' | 'care' | null>('specs');

  const toggleTab = (tab: 'specs' | 'fit' | 'care') => {
    setOpenTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="border-t border-otaru-border/60 divide-y divide-otaru-border/60 mt-8 pt-4">
      {/* 1. Material & Craftsmanship */}
      <div className="py-4">
        <button
          onClick={() => toggleTab('specs')}
          className="w-full flex items-center justify-between text-body-md font-medium text-otaru-ink text-left focus:outline-none"
        >
          <span>Material & Craftsmanship</span>
          <span className="text-body-lg text-otaru-ink-muted">
            {openTab === 'specs' ? '−' : '+'}
          </span>
        </button>
        {openTab === 'specs' && (
          <div className="mt-3 space-y-2 text-body-sm text-otaru-ink-muted font-light animate-fadeIn">
            {artifact.gsm && (
              <p>
                <strong className="font-medium text-otaru-ink">Fabric Weight:</strong> {artifact.gsm}
              </p>
            )}
            {artifact.construction && (
              <p>
                <strong className="font-medium text-otaru-ink">Construction:</strong> {artifact.construction}
              </p>
            )}
            {artifact.wash && (
              <p>
                <strong className="font-medium text-otaru-ink">Wash Technique:</strong> {artifact.wash}
              </p>
            )}
            {artifact.printTechnique && (
              <p>
                <strong className="font-medium text-otaru-ink">Print Method:</strong> {artifact.printTechnique}
              </p>
            )}
            {!artifact.gsm && !artifact.construction && (
              <p>
                Crafted from heavy-gauge luxury cotton with reinforced double-needle stitching and custom archival hardware.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. Fit Guide */}
      <div className="py-4">
        <button
          onClick={() => toggleTab('fit')}
          className="w-full flex items-center justify-between text-body-md font-medium text-otaru-ink text-left focus:outline-none"
        >
          <span>Fit & Silhouette</span>
          <span className="text-body-lg text-otaru-ink-muted">
            {openTab === 'fit' ? '−' : '+'}
          </span>
        </button>
        {openTab === 'fit' && (
          <div className="mt-3 space-y-2 text-body-sm text-otaru-ink-muted font-light animate-fadeIn">
            <p>
              Designed with a relaxed, boxy architectural fit with dropped shoulders and a structured drape.
            </p>
            <p className="text-caption text-otaru-ink-subtle text-xs">
              Take your standard size for the intended silhouette, or size down for a tailored cut.
            </p>
          </div>
        )}
      </div>

      {/* 3. Care Instructions */}
      <div className="py-4">
        <button
          onClick={() => toggleTab('care')}
          className="w-full flex items-center justify-between text-body-md font-medium text-otaru-ink text-left focus:outline-none"
        >
          <span>Care Instructions</span>
          <span className="text-body-lg text-otaru-ink-muted">
            {openTab === 'care' ? '−' : '+'}
          </span>
        </button>
        {openTab === 'care' && (
          <div className="mt-3 space-y-2 text-body-sm text-otaru-ink-muted font-light animate-fadeIn">
            <ul className="list-disc list-inside space-y-1">
              <li>Machine wash cold inside out with mild detergent</li>
              <li>Hang dry in shade to preserve fabric weight and dye density</li>
              <li>Do not tumble dry or bleach</li>
              <li>Iron inside out on low heat if required</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
