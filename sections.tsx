"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

export const EMAIL = "inquiries@latent.studio";

const OFFERS = [
  ["Build", "A new site, product or internal tool, designed and engineered together.", "For businesses starting from zero, or starting over. You get a fast, accessible site with the content structure to convert."],
  ["Repair", "Fix what is broken: layouts, forms, slow pages, failing deploys.", "Triage within 24 hours. We find the cause, fix it, and document it so it stays fixed. Abandoned repositories and undocumented code are in scope."],
  ["Refine", "Keep what works and raise the standard.", "Typography, spacing, motion and copy, plus the performance work that makes a decent site a great one. No rebuild."],
  ["Evolve", "Add the next capability: AI assistants, automation, a customer portal.", "We turn spreadsheets and manual processes into software your team actually uses."],
] as const;

export function Services() {
  return (
    <section id="services" className="relative z-10 -mt-8 rounded-t-[32px] bg-paper px-6 py-24 shadow-float lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1fr_2fr]">
        <h2 className="font-serif text-4xl font-light tracking-tight">What we do</h2>
        <div className="divide-y divide-paper-border border-y border-paper-border">
          {OFFERS.map(([t, s, d]) => (
            <details key={t} className="group py-6">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-atelier-indigo">
                <span className="font-serif text-3xl tracking-tight">{t}</span>
                <span className="max-w-[34ch] text-right text-ink-muted group-open:text-ink">{s}</span>
              </summary>
              <p className="mt-5 max-w-[56ch] leading-relaxed text-ink-light">{d}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const WORK = [
  ["Otaru", "A living archive of Japanese textiles, with point-cloud fabric you can inspect and recorded sound from the looms.", "/otaru-archive.png", "Studio project"],
  ["Solomon", "An AI system with episodic memory, so it recalls what happened earlier instead of starting over.", "/solomon-archive.png", "Studio project"],
] as const;

export function Work() {
  return (
    <section id="work" className="px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="font-serif text-4xl font-light tracking-tight">Selected work</h2>
        <div className="mt-14 grid gap-14 md:grid-cols-2">
          {WORK.map(([t, d, src, kind]) => (
            <article key={t}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-paper-border bg-paper-darker">
                <Image src={src} alt={`${t} interface`} fill sizes="(min-width:768px) 560px, 100vw" className="object-cover object-top" />
              </div>
              <h3 className="mt-6 font-serif text-2xl tracking-tight">{t} <span className="ml-2 font-sans text-sm text-ink-faint">{kind}</span></h3>
              <p className="mt-2 max-w-[46ch] leading-relaxed text-ink-light">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), email: f.get("email"), scope: f.get("scope"),
          message: f.get("message"), website_url_hp: f.get("website_url_hp"),
        }),
      });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  const field = "mt-2 w-full rounded-lg border border-paper-border bg-paper-card px-4 py-3 text-base outline-none focus-visible:border-atelier-indigo focus-visible:ring-2 focus-visible:ring-atelier-indigo/30";
  return (
    <section id="contact" className="bg-atelier-indigo px-6 py-24 text-paper lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="font-serif text-4xl font-light tracking-tight">Tell us what to look at</h2>
          <p className="mt-5 max-w-[34ch] leading-relaxed text-paper/75">You write to the people who do the work. We reply within 48 hours.</p>
          <a href={`mailto:${EMAIL}`} className="mt-8 inline-block text-sm underline underline-offset-4">{EMAIL}</a>
        </div>
        {state === "done" ? (
          <p role="status" className="font-serif text-3xl font-light">Received. We will reply within 48 hours.</p>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-6 text-ink sm:grid-cols-2">
            <label className="text-sm text-paper/80">Name<input name="name" required autoComplete="name" className={field} /></label>
            <label className="text-sm text-paper/80">Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
            <label className="text-sm text-paper/80 sm:col-span-2">What do you need?
              <select name="scope" defaultValue="Audit" className={field}>
                {["Audit", "Build", "Repair", "Refine", "Evolve"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-sm text-paper/80 sm:col-span-2">Your website address, and what feels wrong
              <textarea name="message" required minLength={10} rows={4} className={field} />
            </label>
            <input name="website_url_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
            <div className="flex items-center gap-6 sm:col-span-2">
              <button disabled={state === "sending"} className="rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-atelier-indigo transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">
                {state === "sending" ? "Sending" : "Send request"}
              </button>
              <p role="alert" className="text-sm text-paper/80">{state === "error" ? `That did not send. Try again, or email ${EMAIL}.` : ""}</p>
            </div>
          </form>
        )}
      </div>
      <div className="mx-auto mt-24 max-w-[1200px] overflow-hidden border-t border-paper/15 pt-6" aria-hidden="true"><p className="font-serif text-[clamp(6rem,30vw,26rem)] font-light leading-[0.75] tracking-tighter text-paper/10">Latent</p></div>
      <p className="mx-auto mt-6 max-w-[1200px] text-sm text-paper/60">© 2026 Latent. Hyderabad, India.</p>
    </section>
  );
}
