import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | House of Otaru',
  description: 'How House of Otaru collects, uses and protects personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-32 pb-28">
      <div className="wrap max-w-3xl mx-auto px-6">
        
        {/* Header Lockup */}
        <div className="border-b border-hairline pb-8 mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)] block mb-3">
            LEGAL ARCHIVE · PROTOCOL 01
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-4">
            Privacy Policy & Data Sovereignty
          </h1>
          <p className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
            Effective Date: October 2026 · Prepared with the DPDP Act, 2023 in view
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-[15px] leading-relaxed text-[var(--ink)]/80">
          
          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">1. Atelier Data Manifesto</h2>
            <p>
              House of Otaru operates under the principles of the Indian Digital Personal Data Protection Act (DPDP), 2023, and international data minimization protocols. We treat your personal information with the same restraint and permanence as our textiles: collected with consent, guarded with precision, and never commodified.
            </p>
            <p>
              We do not sell, rent, monetize, or broker personal information to programmatic advertising networks, data brokers, or third-party marketing services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">2. Information We Collect</h2>
            <p>
              We only collect data necessary to craft, allocate, and dispatch archival garments:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--ink)]/75">
              <li><strong>Acquisition Details:</strong> Legal name, shipping address, contact telephone, and billing details for fulfillment.</li>
              <li><strong>Atelier Fit Notes:</strong> Sizing preferences and bespoke sleeve/hem adjustments submitted voluntarily to our concierge.</li>
              <li><strong>Archival Provenance:</strong> Garment serial numbers registered under your account for lifetime repair warranties.</li>
              <li><strong>Electronic Communications:</strong> Email address for dispatch tracking, waitlist notifications, and atelier field notes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">3. Payment & Settlement Invariants</h2>
            <p>
              All payment transactions are encrypted via PCI-DSS Level 1 compliant gateway partners (including Razorpay and Stripe). House of Otaru never stores full credit/debit card numbers, CVVs, or net banking authentication credentials on our application servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">4. Security & Storage</h2>
            <p>
              All communications between your browser and our edge nodes are encrypted via TLS 1.3. Archival records and inventory allocations are stored with end-to-end access controls, automated intrusion detection, and strict least-privilege administrative access policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">5. Patron Rights under DPDP 2023</h2>
            <p>
              Under applicable statutory regulations, every patron retains the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--ink)]/75">
              <li>Request an export of all personal data held in our archival records.</li>
              <li>Request correction or rectification of incomplete or inaccurate information.</li>
              <li>Request complete erasure of your patron account and associated identifiers, subject to statutory tax and financial audit obligations.</li>
              <li>Withdraw consent for optional communications at any time via one-click unsubscribe headers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">6. Inquiries &amp; Privacy Grievance</h2>
            <p>
              For data access requests, deletion commands, or privacy questions, contact our atelier privacy desk directly:
            </p>
            <div className="p-5 border border-hairline bg-[var(--paper-2)] font-mono text-xs space-y-1 text-[var(--ink)]">
              <p className="font-semibold uppercase tracking-wider">House of Otaru Privacy Desk</p>
              <p>Email: <a href="mailto:inquiries@otaru.in" className="underline hover:text-[var(--indigo)]">inquiries@otaru.in</a></p>
              <p className="text-[var(--ink-muted)] text-[11px]">Designated privacy inbox and registered operating entity details to be confirmed by operating entity.</p>
            </div>
          </section>

          {/* Back to Atelier */}
          <div className="pt-8 border-t border-hairline flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              ← Return to Atelier
            </Link>
            <Link
              href="/terms"
              className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              Terms of Service →
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
