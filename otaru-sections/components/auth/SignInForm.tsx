"use client";

/**
 * SignInForm
 * -----------------------------------------------------------------
 * Client-side shell only. Wire `handleSubmit` to your real auth
 * provider (Auth.js/NextAuth, Lucia, Clerk, or a custom credentials
 * route) — this component does not hash, store, or validate
 * passwords itself, and it must not. On the server:
 *   - rate-limit this endpoint (see section 13 of the directive —
 *     sign-in is a classic brute-force / credential-stuffing target)
 *   - return a generic "incorrect email or password" for both a
 *     wrong password and a nonexistent account, never distinguish
 *   - set the session cookie httpOnly + secure + sameSite=lax
 */
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FieldErrors = { email?: string; password?: string };

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      // TODO: replace with your real sign-in call, e.g.
      // await signIn("credentials", { email, password, redirect: false })
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setFormError("Incorrect email or password.");
        return;
      }
      router.push("/profile");
    } catch {
      setFormError("Something went wrong. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[400px] flex-col justify-center px-6 py-24">
      <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
        Archive access
      </span>
      <h1 className="mt-2 font-display text-[2.1rem] text-[var(--otaru-parchment)]">Welcome back.</h1>
      <p className="mt-2 text-[0.92rem] text-[var(--otaru-parchment-dim)]">
        Sign in to see saved artifacts, past acquisitions, and your membership tier.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-2">
        {formError && (
          <p role="alert" className="mt-4 rounded-sm border border-[var(--otaru-torii)] px-3 py-2 text-sm text-[#e0a08a]">
            {formError}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-1.5">
          <label htmlFor="si-email" className="text-[0.72rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">
            Email
          </label>
          <input
            id="si-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "si-email-error" : undefined}
            className="border border-[var(--otaru-line-strong)] bg-transparent px-3 py-3 text-[var(--otaru-parchment)] focus:border-[var(--otaru-gold)] focus:outline-none"
          />
          {errors.email && (
            <span id="si-email-error" className="text-[0.74rem] text-[#e0a08a]">
              {errors.email}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor="si-pass" className="text-[0.72rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">
            Password
          </label>
          <input
            id="si-pass"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "si-pass-error" : undefined}
            className="border border-[var(--otaru-line-strong)] bg-transparent px-3 py-3 text-[var(--otaru-parchment)] focus:border-[var(--otaru-gold)] focus:outline-none"
          />
          {errors.password && (
            <span id="si-pass-error" className="text-[0.74rem] text-[#e0a08a]">
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 w-full bg-[var(--otaru-parchment)] py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--otaru-ink)] transition-colors hover:bg-[var(--otaru-gold)] disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Continue"}
        </button>

        <div className="my-6 flex items-center gap-4 text-[0.72rem] uppercase tracking-[0.1em] text-[var(--otaru-horizon)]">
          <span className="h-px flex-1 bg-[var(--otaru-line)]" />
          or
          <span className="h-px flex-1 bg-[var(--otaru-line)]" />
        </div>

        <Link
          href="/"
          className="block w-full border border-[var(--otaru-line-strong)] py-3.5 text-center text-[0.78rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment)] transition-colors hover:border-[var(--otaru-gold-dim)]"
        >
          Continue as guest
        </Link>

        <p className="mt-6 text-center text-sm text-[var(--otaru-parchment-dim)]">
          <Link href="/forgot-password" className="border-b border-transparent text-[var(--otaru-gold-dim)] hover:border-[var(--otaru-gold-dim)]">
            Forgot your password?
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-[var(--otaru-parchment-dim)]">
          New to the archive?{" "}
          <Link href="/sign-up" className="border-b border-transparent text-[var(--otaru-gold-dim)] hover:border-[var(--otaru-gold-dim)]">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
