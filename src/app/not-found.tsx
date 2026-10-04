import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Archival Record Not Found | Otaru',
  description: 'The requested page or artifact could not be found in the Otaru archive.',
};

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center py-28 bg-[var(--paper)] text-[var(--ink)]">
      <div className="wrap max-w-lg text-center space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] block">
          404 · Uncharted Holding
        </span>
        <h1 className="display-l text-[var(--ink)]">
          Object not found.
        </h1>
        <p className="text-sm text-[var(--ink)]/70 leading-relaxed max-w-[40ch] mx-auto">
          The artifact, chapter, or dispatch ledger you are looking for has been relocated or concluded its archival sequence.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--indigo-hover)] transition-colors"
          >
            Return to Studio
          </Link>
          <Link
            href="/archive"
            className="px-6 py-3 border border-hairline bg-[var(--paper-2)] text-[var(--ink)] text-xs font-mono uppercase tracking-wider hover:border-[var(--ink)] transition-colors"
          >
            Explore Archive Holdings
          </Link>
        </div>

        <div className="pt-8 border-t border-hairline flex items-center justify-center gap-6 font-mono text-xs text-[var(--ink-muted)]">
          <Link href="/chapters" className="hover:text-[var(--ink)] transition-colors">Chapters</Link>
          <span>·</span>
          <Link href="/journal" className="hover:text-[var(--ink)] transition-colors">Field Notes</Link>
          <span>·</span>
          <Link href="/track-order" className="hover:text-[var(--ink)] transition-colors">Track Dispatch</Link>
        </div>
      </div>
    </section>
  );
}
