"use client";

import { useState, type FormEvent } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      // TODO: replace with your real subscribe server action / API route.
      // Never trust this as the source of truth for consent — record it
      // server-side with a timestamp and IP for compliance.
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-[var(--otaru-ink)] py-[var(--space-section)] text-center" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <div className="flex justify-center">
            <Eyebrow>Stay near the archive</Eyebrow>
          </div>
          <SectionTitle className="mx-auto mt-2 max-w-none text-center">
            <span id="newsletter-heading">One email, before each chapter opens.</span>
          </SectionTitle>

          {status === "success" ? (
            <p className="mx-auto mt-8 max-w-[380px] text-[var(--otaru-parchment)]" role="status">
              You're on the list. Look for the next chapter in your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-[420px]" noValidate>
              <div className="flex border-b border-[var(--otaru-line-strong)] focus-within:border-[var(--otaru-gold)]">
                <label htmlFor="nl-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="you@domain.com"
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "nl-error" : undefined}
                  className="flex-1 bg-transparent px-1 py-3 text-[var(--otaru-parchment)] placeholder:text-[var(--otaru-horizon)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-2 text-[0.72rem] uppercase tracking-[0.1em] text-[var(--otaru-gold)] disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending…" : "Notify me"}
                </button>
              </div>
              {status === "error" && (
                <p id="nl-error" className="mt-2 text-left text-[0.78rem] text-[#e0a08a]">
                  Enter a valid email address.
                </p>
              )}
            </form>
          )}

          <p className="mt-4 text-[0.72rem] text-[var(--otaru-horizon)]">No noise. Four emails a year, at most.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
