'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/lib/currency';

export interface GiftWrappingData {
  enabled: boolean;
  recipientName: string;
  senderName: string;
  message: string;
  woodenBoxIncluded: boolean;
}

interface CartGiftWrappingOptionProps {
  giftData: GiftWrappingData;
  onChange: (data: GiftWrappingData) => void;
  subtotal: number;
}

export function CartGiftWrappingOption({
  giftData,
  onChange,
  subtotal,
}: CartGiftWrappingOptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const isComplimentary = subtotal >= 500;
  const giftFee = isComplimentary ? 0 : 25;

  const handleToggle = (checked: boolean) => {
    onChange({
      ...giftData,
      enabled: checked,
      woodenBoxIncluded: checked,
    });
  };

  return (
    <div className="border border-hairline bg-[var(--paper)] p-5 mt-4 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={giftData.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className="mt-1 w-4 h-4 rounded-none accent-[var(--indigo)] cursor-pointer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink)] font-semibold">
                Archival Paulownia Wood Box Packaging (桐箱)
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                {isComplimentary ? 'Complimentary Privilege' : `+${formatPrice(giftFee)}`}
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] mt-1 font-sans leading-relaxed">
              Nest garments in a custom solid paulownia wood crate wrapped in Echizen mulberry washi paper with braided silk cords.
            </p>
          </div>
        </label>

        {giftData.enabled && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="font-mono text-[10px] uppercase tracking-wider text-[var(--indigo)] underline hover:opacity-75 whitespace-nowrap pt-1"
          >
            {isOpen ? 'Collapse Note' : 'Add Gift Note'}
          </button>
        )}
      </div>

      {giftData.enabled && isOpen && (
        <div className="mt-4 pt-4 border-t border-hairline space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={giftData.recipientName}
                onChange={(e) => onChange({ ...giftData, recipientName: e.target.value })}
                placeholder="e.g. Kenzo / Priya"
                className="w-full px-3 py-2 border border-hairline bg-[var(--paper-2)]/60 font-sans text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                Sender / Patron Name
              </label>
              <input
                type="text"
                value={giftData.senderName}
                onChange={(e) => onChange({ ...giftData, senderName: e.target.value })}
                placeholder="e.g. Atelier Patron"
                className="w-full px-3 py-2 border border-hairline bg-[var(--paper-2)]/60 font-sans text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--ink)]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
              Hand-Lettered Calligraphy Message
            </label>
            <textarea
              rows={2}
              value={giftData.message}
              onChange={(e) => onChange({ ...giftData, message: e.target.value })}
              placeholder="Inscribe a personal reflection to accompany the garment into the vault..."
              className="w-full px-3 py-2 border border-hairline bg-[var(--paper-2)]/60 font-sans text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
