'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-otaru-chalk text-otaru-ink font-sans antialiased min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md space-y-6">
          <h1 className="text-display-md font-bold tracking-tight">
            Application Error
          </h1>
          <p className="text-body-md text-otaru-ink-muted">
            A critical error occurred. Please refresh the page or try resetting the session.
          </p>
          {error.digest && (
            <p className="text-caption text-xs font-mono text-otaru-ink-subtle">
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
