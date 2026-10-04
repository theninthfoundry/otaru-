'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KanjiStamp } from '@/components/ui/ArchivalBackgroundArt';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || searchParams.get('orderId') || 'ARC-1042';
  const amount = searchParams.get('total') || searchParams.get('amount') || '480';
  const [password, setPassword] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);

  // Estimated dispatch calculation (2 days from today)
  const dispatchDate = new Date();
  dispatchDate.setDate(dispatchDate.getDate() + 2);
  const formattedDispatch = dispatchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setAccountCreated(true);
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6 sm:px-8 border border-white/20 bg-[#162238] shadow-2xl relative">
      
      {/* Archive Header & Signature Stamp */}
      <div className="flex items-center justify-between pb-6 border-b border-white/15">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/60 block mb-1">
            Archival Entry Recorded
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#F4F0E8] font-normal">
            NO. {orderId}
          </h1>
        </div>
        <KanjiStamp text="印" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#F4F0E8', width: '2rem', height: '2rem' }} />
      </div>

      {/* Handwritten-Style Studio Thank You Note */}
      <div className="py-8 border-b border-white/15 space-y-3">
        <p className="font-display text-xl sm:text-2xl text-[#EAE4D7] leading-snug italic">
          “Thank you for securing this piece. We hold the cloth gently, and it is now recorded under your personal provenance.”
        </p>
        <p className="font-mono text-xs text-white/60">
          — Otaru Canal Studio, Hokkaido MMXXVI
        </p>
      </div>

      {/* Dispatch Telemetry */}
      <div className="py-6 border-b border-white/15 font-mono text-xs space-y-2.5">
        <div className="flex justify-between">
          <span className="text-white/60">Registered Value</span>
          <span className="text-white font-medium">${amount} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Estimated Studio Dispatch</span>
          <span className="text-white">{formattedDispatch}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Repair Ledger Status</span>
          <span className="text-white/90">Active · Lifetime Warranty</span>
        </div>
      </div>

      {/* Actions: Track Dispatch */}
      <div className="pt-6 space-y-4">
        <Link
          href={`/track-order?order=${orderId}`}
          className="block w-full py-4 bg-[#F4F0E8] text-[#1F2A44] font-mono text-xs uppercase tracking-widest text-center font-medium hover:bg-white transition-colors"
        >
          Track Dispatch Ledger →
        </Link>

        {/* Optional Account Creation with Single Password Field (Prompt 6 requirement) */}
        {!accountCreated ? (
          <div className="pt-6 mt-6 border-t border-white/15">
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/60 block mb-2">
              Save Provenance Record
            </span>
            <p className="text-xs text-white/70 mb-4 leading-relaxed">
              Create a collector account to manage lifetime repair requests and view your owned archive catalogue.
            </p>
            <form onSubmit={handleCreateAccount} className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                required
                className="flex-1 bg-black/20 border border-white/20 px-3 py-2 text-xs font-mono text-white placeholder:text-white/40 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Save
              </button>
            </form>
          </div>
        ) : (
          <div className="p-3 bg-white/10 border border-white/20 text-xs font-mono text-white/90 text-center">
            ✓ Collector account secured. Your repair ledger has been initialized.
          </div>
        )}

        <div className="pt-4 text-center">
          <Link
            href="/archive"
            className="font-mono text-xs text-white/50 hover:text-white uppercase tracking-wider transition-colors"
          >
            ← Return to Archive Holdings
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <section className="min-h-screen bg-[var(--indigo)] text-[#F4F0E8] flex items-center justify-center py-20 px-4">
      <Suspense fallback={<div className="font-mono text-xs text-white/60">Loading confirmation record...</div>}>
        <SuccessContent />
      </Suspense>
    </section>
  );
}
