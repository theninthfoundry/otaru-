'use client';

import React from 'react';
import Link from 'next/link';
import { useCurrency } from '@/lib/currency';

export function MembershipPage() {
  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-28 pb-24">
      <div className="wrap">
        
        {/* Header */}
        <div className="max-w-2xl pb-10 border-b border-hairline">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
            Archival Allocation
          </span>
          <h1 className="display-l text-[var(--ink)] mb-3">
            Three tiers. One standard of care.
          </h1>
          <p className="text-sm text-[var(--ink)]/70 leading-relaxed">
            Membership gives you standing priority to archival batches prior to public release, custom commissions, and a lifetime repair commitment on every garment.
          </p>
        </div>

        {/* 3 Calm Columns, Middle Tier Subtly Emphasised (Anchoring) + Honest Availability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 items-stretch">
          
          {/* Tier 1: Vanguard */}
          <div className="border border-hairline bg-[var(--paper-2)] p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider mb-2">
                Tier I · Open
              </div>
              <h2 className="font-display text-3xl text-[var(--ink)] mb-3">
                Vanguard
              </h2>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed mb-6">
                Standing notification 24 hours prior to public batch releases. Access to the digital field notes archive.
              </p>
              <ul className="font-mono text-xs text-[var(--ink-muted)] space-y-2.5 pt-4 border-t border-hairline/60">
                <li>✓ 24hr priority batch release</li>
                <li>✓ Digital journal access</li>
                <li>✓ Lifetime repair registration</li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-hairline">
              <span className="font-mono text-xs text-[var(--ink-muted)] block mb-3">
                Complimentary with account
              </span>
              <Link
                href="/sign-in"
                className="block w-full py-3 text-center border border-hairline text-xs font-mono uppercase tracking-wider text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
              >
                Join Vanguard →
              </Link>
            </div>
          </div>

          {/* Tier 2: Archival Circle (Subtly Emphasised + Honest 112/150 Availability) */}
          <div className="border-2 border-[var(--indigo)] bg-[var(--paper)] p-8 flex flex-col justify-between relative shadow-sm">
            <span className="absolute -top-3 left-8 px-3 py-0.5 bg-[var(--indigo)] text-white font-mono text-[10px] uppercase tracking-widest">
              Subtly Recommended · Honest Allocation
            </span>

            <div>
              <div className="font-mono text-xs text-[var(--indigo)] uppercase tracking-wider mb-2 font-medium">
                Tier II · Limited Roster
              </div>
              <h2 className="font-display text-3xl text-[var(--ink)] mb-3">
                Archival Circle
              </h2>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed mb-4">
                Guaranteed size allocation on every batch, private courier dispatch, and annual complimentary studio boro repair.
              </p>

              {/* Honest Scarcity Badge (Prompt 7 requirement) */}
              <div className="p-3 bg-[var(--paper-2)] border border-hairline font-mono text-xs text-[var(--ink)] mb-6">
                <span className="text-[var(--indigo)] font-semibold">112 of 150 places claimed</span>
                <span className="text-[var(--ink-muted)] block text-[11px] mt-0.5">38 openings remain for 2026</span>
              </div>

              <ul className="font-mono text-xs text-[var(--ink)]/85 space-y-2.5 pt-4 border-t border-hairline/60">
                <li>✓ 48hr priority access to live batches</li>
                <li>✓ Guaranteed size reservation</li>
                <li>✓ Annual canal re-waxing & boro repair</li>
                <li>✓ Studio anniversary linen monograph</li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-hairline">
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-display text-2xl text-[var(--ink)]">{formatPrice(120)}</span>
                <span className="font-mono text-xs text-[var(--ink-muted)]">/ annual</span>
              </div>
              <Link
                href="/checkout?plan=archival"
                className="block w-full py-3 text-center bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--indigo-hover)] transition-colors"
              >
                Claim Archival Place →
              </Link>
            </div>
          </div>

          {/* Tier 3: Atelier Circle */}
          <div className="border border-hairline bg-[var(--paper-2)] p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider mb-2">
                Tier III · Private Roster
              </div>
              <h2 className="font-display text-3xl text-[var(--ink)] mb-3">
                Atelier Circle
              </h2>
              <p className="text-sm text-[var(--ink)]/75 leading-relaxed mb-6">
                Bespoke pattern cuts, private fittings at the Otaru canal stone warehouse, and direct commissions with our craftspeople.
              </p>
              <ul className="font-mono text-xs text-[var(--ink-muted)] space-y-2.5 pt-4 border-t border-hairline/60">
                <li>✓ Bespoke one-off garment commissions</li>
                <li>✓ Private warehouse fittings in Otaru</li>
                <li>✓ Archive reserve vault access</li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-hairline">
              <span className="font-mono text-xs text-[var(--ink-muted)] block mb-3">
                By referral & application
              </span>
              <a
                href="mailto:atelier@otaru.in"
                className="block w-full py-3 text-center border border-hairline text-xs font-mono uppercase tracking-wider text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
              >
                Inquire for Atelier →
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MembershipPage;
