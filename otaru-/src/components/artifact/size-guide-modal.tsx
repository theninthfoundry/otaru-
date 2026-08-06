'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifactName?: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  artifactName = 'Artifact Garment',
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const convert = (cmVal: number) => {
    if (unit === 'in') {
      return (cmVal / 2.54).toFixed(1);
    }
    return cmVal.toString();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Garment Sizing & Fit Architecture">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-otaru-border/40 pb-4">
          <div>
            <span className="text-overline uppercase text-otaru-ink-subtle text-[10px] font-mono">
              Tailoring Standards
            </span>
            <p className="text-body-sm font-semibold text-otaru-ink">{artifactName}</p>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-otaru-cream/80 p-1 rounded-full border border-otaru-border/50 text-caption text-xs">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-full font-mono text-[11px] transition-colors ${
                unit === 'cm' ? 'bg-otaru-ink text-otaru-chalk' : 'text-otaru-ink-muted'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-full font-mono text-[11px] transition-colors ${
                unit === 'in' ? 'bg-otaru-ink text-otaru-chalk' : 'text-otaru-ink-muted'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Sizing Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-caption text-xs">
            <thead>
              <tr className="border-b border-otaru-border text-otaru-ink-subtle uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest Width</th>
                <th className="py-2.5 px-3">Shoulder</th>
                <th className="py-2.5 px-3">Back Length</th>
                <th className="py-2.5 px-3">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-otaru-border/30 font-mono text-otaru-ink">
              <tr>
                <td className="py-3 px-3 font-semibold font-sans text-body-sm">S (Small)</td>
                <td className="py-3 px-3">{convert(56)} {unit}</td>
                <td className="py-3 px-3">{convert(49)} {unit}</td>
                <td className="py-3 px-3">{convert(72)} {unit}</td>
                <td className="py-3 px-3">{convert(63)} {unit}</td>
              </tr>
              <tr className="bg-otaru-chalk-warm/30">
                <td className="py-3 px-3 font-semibold font-sans text-body-sm">M (Medium)</td>
                <td className="py-3 px-3">{convert(59)} {unit}</td>
                <td className="py-3 px-3">{convert(51)} {unit}</td>
                <td className="py-3 px-3">{convert(74)} {unit}</td>
                <td className="py-3 px-3">{convert(65)} {unit}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold font-sans text-body-sm">L (Large)</td>
                <td className="py-3 px-3">{convert(62)} {unit}</td>
                <td className="py-3 px-3">{convert(53)} {unit}</td>
                <td className="py-3 px-3">{convert(76)} {unit}</td>
                <td className="py-3 px-3">{convert(67)} {unit}</td>
              </tr>
              <tr className="bg-otaru-chalk-warm/30">
                <td className="py-3 px-3 font-semibold font-sans text-body-sm">XL (Extra Large)</td>
                <td className="py-3 px-3">{convert(65)} {unit}</td>
                <td className="py-3 px-3">{convert(55)} {unit}</td>
                <td className="py-3 px-3">{convert(78)} {unit}</td>
                <td className="py-3 px-3">{convert(69)} {unit}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fit Profile Callout */}
        <div className="p-4 bg-otaru-cream/50 border border-otaru-border/40 rounded-sm text-caption text-xs space-y-1">
          <span className="font-semibold text-otaru-ink block uppercase text-[10px] tracking-wider">
            Fit Silhouette Profile: Relaxed Drop Shoulder
          </span>
          <p className="text-otaru-ink-muted font-light leading-relaxed">
            This garment is tailored with an intentional relaxed silhouette. Take your true size for the intended drop-shoulder drape, or size down for a structured classic fit.
          </p>
        </div>
      </div>
    </Modal>
  );
}
