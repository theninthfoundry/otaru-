import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping, Exchanges & Care | House of Otaru',
  description: 'Dispatch procedures, domestic logistics, size exchange guidelines, and garment care for House of Otaru.',
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-32 pb-28">
      <div className="wrap max-w-3xl mx-auto px-6">
        
        {/* Header Lockup */}
        <div className="border-b border-hairline pb-8 mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)] block mb-3">
            LOGISTICS &amp; CARE GUIDELINES
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-4">
            Shipping, Exchanges &amp; Care
          </h1>
          <p className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
            Curated Inspection · Insured Dispatch
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-[15px] leading-relaxed text-[var(--ink)]/80">
          
          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">1. Inspection &amp; Dispatch Timeline</h2>
            <p>
              Every garment allocated from an active edition undergoes an individual inspection: seam integrity check, natural dye evaluation, and archival serial verification. Because of this careful hand-finishing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--ink)]/75">
              <li><strong>Domestic Orders (India):</strong> Hand-packed and dispatched via express air couriers following inspection. Detailed tracking links are provided via email once the consignment is handed over to the carrier.</li>
              <li><strong>International Orders:</strong> Dispatched following customs clearance prep. Transit times and import documentation are communicated upon allocation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">2. Shipping Charges &amp; Duties</h2>
            <p>
              Applicable shipping fees, regional surcharges, and any active complimentary dispatch thresholds are calculated transparently at checkout based on your destination postal code. For international deliveries, applicable duties and taxes depend on the destination customs authority.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">3. Size Exchanges &amp; Fit Assistance</h2>
            <p>
              We prioritize garment longevity and intimate fit. If a piece requires an alternate size or adjustment:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--ink)]/75">
              <li>Contact our atelier team promptly upon delivery through our <Link href="/returns" className="underline hover:text-[var(--indigo)]">Care &amp; Exchanges portal</Link> to initiate an exchange inquiry.</li>
              <li>When available in our batch reserve, we assist in securing a replacement size before the edition concludes.</li>
              <li>Garments submitted for exchange must remain unworn, unwashed, and unaltered, with original archival tags intact.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">4. Return &amp; Refund Policy</h2>
            <p>
              Because our editions are produced in strictly numbered, limited batch allocations, return availability is subject to batch-specific terms and applicable statutory consumer protections. Items approved for return must be unworn and in their original packaging. Upon atelier inspection, approved refunds are credited back to the original payment method.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">5. Atelier Repair &amp; Mending Services</h2>
            <p>
              To honor the life of the garment, House of Otaru provides care guidance and artisanal mending intake services. Patrons can submit repair inquiries for seam reinforcements, button replacements, or traditional boro sashiko stitching via our <Link href="/returns" className="underline hover:text-[var(--indigo)]">Care &amp; Repair Portal</Link>. Scope, feasibility, and material fees (if applicable) are confirmed with you prior to intake.
            </p>
          </section>

          {/* Navigation Links */}
          <div className="pt-8 border-t border-hairline flex items-center justify-between">
            <Link
              href="/returns"
              className="font-mono text-xs uppercase tracking-widest text-[var(--ink)] underline hover:text-[var(--indigo)] transition-colors"
            >
              Atelier Care &amp; Repair Portal →
            </Link>
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              Home
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
