'use client';

import React from 'react';
import Link from 'next/link';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/lib/currency';
import { useConcierge } from '@/lib/concierge';
import { KanjiStamp } from '@/components/ui/ArchivalBackgroundArt';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { currency, setCurrency } = useCurrency();
  const { openConcierge } = useConcierge();

  return (
    <footer className="bg-[var(--paper-2)] border-t border-hairline py-16 md:py-24 text-[var(--ink)]">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Column 1: Brand & Hallmark */}
          <div className="col-span-full md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="font-display text-2xl tracking-tight">
                  Otaru
                </Link>
                <KanjiStamp text="印" />
              </div>
              <p className="text-sm text-[var(--ink)]/65 max-w-[34ch] leading-relaxed">
                Japanese craft sensibility, Indian cloth and hands. Numbered garment archive. Never restocked.
              </p>
            </div>

            {/* Currency Selector (Prompt 1 requirement) */}
            <div className="mt-8 pt-6 border-t border-hairline">
              <label htmlFor="currency-select" className="block font-mono text-[10px] tracking-widest uppercase text-[var(--ink-muted)] mb-2">
                Currency & Region
              </label>
              <div className="inline-flex items-center gap-1 border border-hairline p-1 bg-[var(--paper)]">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`px-2 py-1 text-xs font-mono transition-colors ${
                      currency === code
                        ? 'bg-[var(--indigo)] text-[var(--paper)] font-medium'
                        : 'text-[var(--ink)]/60 hover:text-[var(--ink)]'
                    }`}
                    aria-pressed={currency === code}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Archive & Collections */}
          <div className="col-span-6 md:col-span-3 md:col-start-6">
            <h4 className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] mb-5">
              Archive
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/archive" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Current Holdings
                </Link>
              </li>
              <li>
                <Link href="/chapters" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Chapters
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Field Notes & Journal
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Canal Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Atelier & Concierge */}
          <div className="col-span-6 md:col-span-3">
            <h4 className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] mb-5">
              Atelier Services
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openConcierge('fit')}
                  className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors text-left"
                >
                  Concierge Desk
                </button>
              </li>
              <li>
                <Link href="/track-order" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Track Dispatch
                </Link>
              </li>
              <li>
                <Link href="/shipping-exchanges" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Care & Repair Ledger
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-[var(--ink)]/75 hover:text-[var(--indigo)] transition-colors">
                  Measurement Guide
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Hairline Bar */}
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[var(--ink-muted)]">
          <p>
            &copy; {year} Otaru. Limited batch archive.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">
              Terms
            </Link>
            <span>Hokkaido 43.19° N</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
