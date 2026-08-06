import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from '@/components/layout/newsletter-form';

export const metadata: Metadata = {
  title: 'Private Registry Membership — Otaru',
  description: 'Join the Otaru Private Registry for early drop access, private passcodes, and exclusive member releases.',
};

export default function MembershipPage() {
  return (
    <section id="membership" aria-label="Private Registry Membership" className="py-12 md:py-20">
      <div className="grid-container space-y-16">
        {/* Header */}
        <header className="space-y-3 max-w-2xl">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Private Access & Privileges
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            The Private Registry
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light leading-relaxed">
            Our garments are produced in finite numbers. Registry membership grants early access passcodes before public launches.
          </p>
        </header>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: Archival Member */}
          <div className="bg-otaru-chalk border border-otaru-border p-8 rounded-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] font-semibold">
                Tier 01
              </span>
              <h3 className="text-display-sm font-semibold text-otaru-ink">
                Archival Member
              </h3>
              <p className="text-caption text-xs text-otaru-ink-muted leading-relaxed">
                Complimentary registration for individuals subscribed to the Otaru publication.
              </p>
              <ul className="space-y-2 text-caption text-xs text-otaru-ink pt-4 border-t border-otaru-border/40">
                <li className="flex items-center gap-2">✓ Chapter drop notifications</li>
                <li className="flex items-center gap-2">✓ Access to digital verification</li>
                <li className="flex items-center gap-2">✓ Journal publication access</li>
              </ul>
            </div>
            <div className="pt-4">
              <span className="text-body-sm font-bold text-otaru-ink block">Free Registration</span>
            </div>
          </div>

          {/* Tier 2: Symbol Member (Featured) */}
          <div className="bg-otaru-chalk border-2 border-otaru-ink p-8 rounded-sm space-y-6 flex flex-col justify-between shadow-lg relative">
            <div className="absolute -top-3 left-6 bg-otaru-ink text-otaru-chalk text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
              Recommended
            </div>
            <div className="space-y-3">
              <span className="text-overline uppercase tracking-widest text-otaru-ink text-[10px] font-bold">
                Tier 02
              </span>
              <h3 className="text-display-sm font-semibold text-otaru-ink">
                Symbol Collector
              </h3>
              <p className="text-caption text-xs text-otaru-ink-muted leading-relaxed">
                Unlocked automatically upon purchasing your first Artifact from any Chapter release.
              </p>
              <ul className="space-y-2 text-caption text-xs text-otaru-ink pt-4 border-t border-otaru-border/40 font-medium">
                <li className="flex items-center gap-2">★ 15-Minute Early Access Passcodes</li>
                <li className="flex items-center gap-2">★ Waitlist priority for sold-out pieces</li>
                <li className="flex items-center gap-2">★ Archival serial number registration</li>
                <li className="flex items-center gap-2">★ Complimentary doorstep returns</li>
              </ul>
            </div>
            <div className="pt-4">
              <span className="text-body-sm font-bold text-otaru-ink block">Unlocked via 1st Purchase</span>
            </div>
          </div>

          {/* Tier 3: Founder Circle */}
          <div className="bg-otaru-chalk border border-otaru-border p-8 rounded-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] font-semibold">
                Tier 03
              </span>
              <h3 className="text-display-sm font-semibold text-otaru-ink">
                Founder Circle
              </h3>
              <p className="text-caption text-xs text-otaru-ink-muted leading-relaxed">
                By invitation or lifetime collection of 5+ numbered Artifacts.
              </p>
              <ul className="space-y-2 text-caption text-xs text-otaru-ink pt-4 border-t border-otaru-border/40">
                <li className="flex items-center gap-2">✦ Private prototype previews</li>
                <li className="flex items-center gap-2">✦ Bespoke tailoring requests</li>
                <li className="flex items-center gap-2">✦ Dedicated client concierge</li>
                <li className="flex items-center gap-2">✦ Guaranteed allocation on drops</li>
              </ul>
            </div>
            <div className="pt-4">
              <span className="text-body-sm font-bold text-otaru-ink block">By Archival Invitation</span>
            </div>
          </div>
        </div>

        {/* Signup CTA */}
        <div className="bg-otaru-chalk-warm border border-otaru-border/60 p-8 md:p-12 rounded-sm text-center max-w-xl mx-auto space-y-4">
          <h3 className="text-heading-md font-semibold text-otaru-ink">
            Register for Archival Access
          </h3>
          <p className="text-body-md text-otaru-ink-muted font-light">
            Enter your email address to join the Registry and receive private drop passcodes.
          </p>
          <div className="pt-2">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
