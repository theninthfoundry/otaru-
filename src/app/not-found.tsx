import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Otaru',
  description: 'The requested page or artifact could not be found in the Otaru archive.',
};

export default function NotFound() {
  return (
    <section id="not-found" aria-label="Page not found" className="min-h-[70vh] flex flex-col justify-center py-20">
      <div className="grid-container max-w-xl text-center space-y-6">
        <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
          Error 404 — Uncharted Location
        </span>
        <h1 className="text-display-xl font-bold tracking-tight text-otaru-ink">
          Page Not Found
        </h1>
        <p className="text-body-lg text-otaru-ink-muted font-light leading-relaxed">
          The artifact or story you are seeking does not exist in the current catalog. It may have been archived or relocated.
        </p>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-body-sm font-medium">
          <Link
            href="/"
            className="px-8 py-3 bg-otaru-ink text-otaru-chalk rounded-full hover:bg-otaru-ink-muted transition-colors"
          >
            Return to Studio Home
          </Link>
          <Link
            href="/archive"
            className="px-8 py-3 bg-transparent border border-otaru-border text-otaru-ink rounded-full hover:border-otaru-ink transition-colors"
          >
            Explore Archive
          </Link>
        </div>

        <div className="pt-8 border-t border-otaru-border/40 text-caption text-xs text-otaru-ink-subtle flex items-center justify-center gap-6">
          <Link href="/chapter" className="hover:text-otaru-ink underline">Chapters</Link>
          <Link href="/journal" className="hover:text-otaru-ink underline">Journal</Link>
          <Link href="/track-order" className="hover:text-otaru-ink underline">Track Order</Link>
        </div>
      </div>
    </section>
  );
}
