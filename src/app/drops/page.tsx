import type { Metadata } from 'next';
import Link from 'next/link';
import { DropCountdown } from '@/components/drops/drop-countdown';
import { NewsletterForm } from '@/components/layout/newsletter-form';

export const metadata: Metadata = {
  title: 'Limited Drops & Timed Releases — Otaru',
  description: 'Track upcoming limited releases, private passcodes, and timed garment drops from Otaru.',
};

export default function DropsPage() {
  const nextDropDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <section id="drops" aria-label="Limited Drops" className="py-12 md:py-20">
      <div className="grid-container space-y-16">
        <header className="space-y-3 max-w-2xl">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Limited Releases & Queues
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            Timed Drops
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light leading-relaxed">
            We release garments in finite, numbered quantities. Once a drop reaches zero, pieces enter the permanent Archive.
          </p>
        </header>

        <DropCountdown
          targetDate={nextDropDate}
          dropTitle="Chapter 05 — &ldquo;The Architectural Shift&rdquo;"
        />

        <div className="space-y-6 max-w-4xl mx-auto pt-8 border-t border-otaru-border/40">
          <h2 className="text-heading-md font-semibold text-otaru-ink">
            Release Schedule
          </h2>

          <div className="divide-y divide-otaru-border/50 border-y border-otaru-border/50">
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px]">
                  Upcoming Drop · Aug 2026
                </span>
                <h3 className="text-body-md font-semibold text-otaru-ink mt-0.5">
                  Chapter 05 — &ldquo;The Architectural Shift&rdquo;
                </h3>
                <p className="text-caption text-xs text-otaru-ink-muted mt-1">
                  450 GSM Heavy French Terry · Limited Run of 150 Units
                </p>
              </div>
              <span className="bg-otaru-ink text-otaru-chalk text-[10px] uppercase tracking-wider px-3 py-1 font-medium rounded-full shrink-0 self-start sm:self-auto">
                Scheduled
              </span>
            </div>

            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
              <div>
                <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px]">
                  Past Release · Chapter 01
                </span>
                <h3 className="text-body-md font-semibold text-otaru-ink mt-0.5">
                  Chapter 01 — &ldquo;Origins&rdquo;
                </h3>
                <p className="text-caption text-xs text-otaru-ink-muted mt-1">
                  Triple Needle Heavyweight Cotton · Archived Batch
                </p>
              </div>
              <Link
                href="/archive"
                className="text-caption text-xs font-medium text-otaru-ink underline hover:text-otaru-ink-muted shrink-0"
              >
                View in Archive →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-otaru-chalk-warm border border-otaru-border/60 p-8 md:p-12 rounded-sm text-center max-w-xl mx-auto space-y-4">
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] font-semibold">
            Passcode Priority
          </span>
          <h3 className="text-display-sm font-semibold text-otaru-ink">
            Get Private Passcodes
          </h3>
          <p className="text-body-md text-otaru-ink-muted font-light">
            Subscribe to receive private release passcodes 15 minutes before public drops go live.
          </p>
          <div className="pt-2">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
