'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Otaru Route Exception]:', error);
  }, [error]);

  return (
    <section id="error" aria-label="Error" role="alert" className="min-h-[70vh] flex flex-col justify-center py-20">
      <div className="grid-container max-w-xl text-center space-y-6">
        <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
          System Interruption
        </span>
        <h1 className="text-display-md font-bold tracking-tight text-otaru-ink">
          Something went wrong
        </h1>
        <p className="text-body-md text-otaru-ink-muted font-light leading-relaxed">
          An unexpected error occurred while loading this section. Our engineering team has been notified.
        </p>

        {error.digest && (
          <p className="text-caption text-xs font-mono text-otaru-ink-subtle bg-otaru-cream/50 py-1.5 px-3 rounded-xs inline-block">
            Error Code: {error.digest}
          </p>
        )}

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-body-sm font-medium">
          <button
            onClick={reset}
            className="px-8 py-3 bg-otaru-ink text-otaru-chalk rounded-full hover:bg-otaru-ink-muted transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-transparent border border-otaru-border text-otaru-ink rounded-full hover:border-otaru-ink transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
