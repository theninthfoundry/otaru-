import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | House of Otaru',
  description: 'Archival acquisition terms, lifetime stewardship warranty, and operational rules of House of Otaru.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-32 pb-28">
      <div className="wrap max-w-3xl mx-auto px-6">
        
        {/* Header Lockup */}
        <div className="border-b border-hairline pb-8 mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)] block mb-3">
            LEGAL ARCHIVE · PROTOCOL 02
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-4">
            Terms of Service & Archival Governance
          </h1>
          <p className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
            Effective Date: October 2026 · Edition MMXXVI
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-[15px] leading-relaxed text-[var(--ink)]/80">
          
          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">1. The Archival Pact</h2>
            <p>
              By accessing, browsing, or acquiring an object from House of Otaru (&ldquo;the Maison&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), you enter into an archival agreement governed by these terms. Our creations are produced in limited edition batch runs utilizing historic shuttle-loom textiles and artisanal dyes. They are not mass-market commodities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">2. Editions, Allocations &amp; Pricing Integrity</h2>
            <p>
              Every garment in a numbered batch is allocated on a first-confirmed basis. We do not manufacture excess surplus or offer seasonal price liquidations. Prices displayed on our platform are final, transparent, and verified server-side at the time of checkout. Any attempt to alter payload prices or manipulate transaction hashes will result in immediate cancellation and forfeiture of reservation rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">3. Natural Variation &amp; Textile Characteristics</h2>
            <p>
              Due to the authentic handloom spinning, natural botanical indigo vat dipping, and boro sashiko techniques utilized across our garments, subtle slub textures, organic dye variations, and tonal shifts are intrinsic characteristics of the living cloth—not manufacturing defects. No two objects in an edition are identical.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">4. Intellectual Property &amp; Archival Codes</h2>
            <p>
              All patterns, visual assets, architectural silhouettes, archival serial protocols, and written treatises published on this platform are the sole intellectual property of House of Otaru. Unauthorized reproduction, commercial distribution, or automated extraction without express written license is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">5. Restoration &amp; Repair Services</h2>
            <p>
              Garments bearing an official Otaru serial ledger stamp are eligible for our artisanal repair and maintenance services. Feasibility, timelines, and material fees (if applicable) are determined upon atelier intake assessment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">6. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any legal dispute or claim arising from an acquisition or platform usage shall be subject to the exclusive jurisdiction of the competent courts of the Maison&rsquo;s principal operating jurisdiction.
            </p>
          </section>

          {/* Navigation Links */}
          <div className="pt-8 border-t border-hairline flex items-center justify-between">
            <Link
              href="/privacy"
              className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              ← Privacy Policy
            </Link>
            <Link
              href="/shipping-exchanges"
              className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              Shipping &amp; Exchanges →
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
