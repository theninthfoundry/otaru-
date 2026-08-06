'use client';

import React, { useActionState } from 'react';
import { loginPatron } from '@/actions/auth';

const initialState = {
  error: undefined as string | undefined,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginPatron, initialState);

  return (
    <section id="login" aria-label="Patron Access Portal" className="py-16 md:py-24">
      <div className="grid-container max-w-md space-y-10 animate-fadeIn">
        {/* Header */}
        <header className="text-center space-y-2">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Patron Sanctuary
          </p>
          <h1 className="text-display-sm font-bold tracking-tight text-otaru-ink">
            Access Registry
          </h1>
          <p className="text-caption text-xs text-otaru-ink-muted leading-relaxed">
            Please enter your patron email credentials and security code to authenticate your session.
          </p>
        </header>

        {/* Form */}
        <form action={formAction} className="space-y-6 bg-otaru-chalk border border-otaru-border/60 p-6 md:p-8 rounded-sm shadow-xl">
          {state?.error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xs animate-fadeIn">
              {state.error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
              Patron Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="patron@otaru.in"
              className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[10px] uppercase font-mono tracking-widest text-otaru-ink-subtle">
              Security Code
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-otaru-cream/30 border border-otaru-border rounded-xs px-4 py-3 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-otaru-ink text-otaru-chalk text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-otaru-ink-muted transition-colors disabled:opacity-50"
          >
            {isPending ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>

        {/* Demo instructions subtext */}
        <div className="p-4 bg-otaru-cream/30 border border-otaru-border/40 rounded-xs text-center text-[10px] font-mono text-otaru-ink-subtle leading-relaxed">
          <span className="font-semibold block mb-1">Vault Demo Account</span>
          Email: <code className="text-otaru-ink">patron@otaru.in</code> &bull; Password: <code className="text-otaru-ink">archival</code>
        </div>
      </div>
    </section>
  );
}
