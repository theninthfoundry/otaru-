"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const LINKS = [["Services", "#services"], ["Audit", "#audit"], ["Work", "#work"], ["Contact", "#contact"]] as const;

export function Masthead() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper-border bg-paper/85 backdrop-blur">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
        <a href="#top" className="font-serif text-xl tracking-tight">Latent</a>
        <ul className="hidden gap-8 text-sm text-ink-muted md:flex">
          {LINKS.map(([l, h]) => <li key={h}><a href={h} className="transition-colors hover:text-ink">{l}</a></li>)}
        </ul>
        <a href="mailto:fix@latent.studio?subject=Something%20is%20broken" className="hidden text-sm underline decoration-paper-border underline-offset-4 hover:decoration-ink md:block">Something broken?</a>
        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-paper-border px-4 py-1.5 text-sm">
            <span className="group-open:hidden">Menu</span><span className="hidden group-open:inline">Close</span>
          </summary>
          <ul className="absolute right-0 top-12 w-56 rounded-2xl border border-paper-border bg-paper-card p-3 shadow-float">
            {LINKS.map(([l, h]) => <li key={h}><a href={h} className="block rounded-lg px-3 py-2.5 hover:bg-paper-subtle">{l}</a></li>)}
            <li><a href="mailto:fix@latent.studio" className="block rounded-lg px-3 py-2.5 text-ink-muted hover:bg-paper-subtle">Something broken?</a></li>
          </ul>
        </details>
      </nav>
    </header>
  );
}

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span className="block" initial={reduce ? false : { y: "108%" }} animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: [0.76, 0, 0.24, 1] }}>{children}</motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="sticky top-0 flex min-h-[100svh] items-end px-6 pb-24 pt-32 lg:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="font-serif text-[clamp(3.5rem,12.5vw,11rem)] font-light leading-[0.9] tracking-tighter">
          <Line delay={0.1}>We build</Line>
          <Line delay={0.25}>inevitables.</Line>
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[40ch] text-lg leading-relaxed text-ink-light">
            Websites, AI tools and rescue work for growing businesses in India. We find what your business could become online, then build it.
          </p>
          <div className="flex items-center gap-8">
            <a href="#contact" className="rounded-full bg-atelier-indigo px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-atelier-indigo">Request an audit</a>
            <a href="#work" className="text-sm underline decoration-paper-border underline-offset-4 hover:decoration-ink">See the work</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Before() {
  return (
    <div className="absolute inset-0 bg-[#e6e6e6] font-[Arial,Helvetica,sans-serif] text-[#222]">
      <div className="flex gap-[1.5cqw] bg-[#bdbdbd] px-[2cqw] py-[1cqw] text-[1.5cqw] text-[#0000ee] underline"><span>Home</span><span>Products</span><span>About us</span><span>Contact us</span><span>Cart(0)</span></div>
      <h3 className="mt-[3cqw] text-center text-[3.2cqw] font-bold">WELCOME TO ATELIER TEXTILES!!!</h3>
      <div className="mt-[3cqw] flex items-start justify-center gap-[2cqw]">
        <div className="h-[22cqw] w-[20cqw] bg-[#9a9a9a]" /><div className="mt-[3cqw] h-[16cqw] w-[26cqw] bg-[#8a8a8a]" />
      </div>
      <div className="mx-auto mt-[3cqw] w-fit bg-[#d40000] px-[2.5cqw] py-[1cqw] text-[1.8cqw] font-bold text-white">BUY NOW</div>
    </div>
  );
}

function After() {
  return (
    <div className="absolute inset-0 bg-paper px-[4cqw] py-[3cqw] text-ink">
      <div className="flex items-baseline justify-between"><span className="font-serif text-[2.4cqw]">Atelier</span><span className="text-[1.4cqw] text-ink-muted">Collection · Story · Visit</span></div>
      <h3 className="mt-[4cqw] max-w-[16ch] font-serif text-[6.2cqw] font-light leading-[0.95] tracking-tighter">Handwoven cloth, made in Hyderabad.</h3>
      <div className="mt-[3.5cqw] flex gap-[2cqw]">
        <div className="h-[16cqw] w-[28cqw] rounded-[1cqw] bg-atelier-indigo" /><div className="h-[16cqw] w-[20cqw] rounded-[1cqw] bg-atelier-brass" />
        <div className="self-end"><p className="mb-[1.5cqw] w-[20cqw] text-[1.4cqw] leading-snug text-ink-muted">Cotton and silk, woven to order in small batches.</p>
          <span className="inline-block rounded-full bg-atelier-indigo px-[2cqw] py-[0.9cqw] text-[1.4cqw] text-paper">Shop the collection</span></div>
      </div>
    </div>
  );
}

function Compare() {
  const [p, setP] = useState(50);
  const chip = "absolute top-3 rounded-full bg-paper-card/90 px-3 py-1 text-xs text-ink shadow-subtle";
  return (
    <figure>
      <div className="relative aspect-[16/10] select-none overflow-hidden rounded-2xl border border-paper-border shadow-card [container-type:inline-size]">
        <After />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}><Before /></div>
        <span className={`${chip} left-3`}>Before</span><span className={`${chip} right-3`}>After</span>
        <input type="range" min={0} max={100} value={p} onChange={(e) => setP(+e.target.value)} aria-label="Drag to compare the old site with the redesign" className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0" />
        <div className="pointer-events-none absolute inset-y-0 w-px bg-ink" style={{ left: `${p}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink bg-paper text-sm peer-focus-visible:ring-4 peer-focus-visible:ring-atelier-indigo/40">↔</span>
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-ink-muted">Illustrative. A fictional store, shown the way an audit leads to a redesign. Drag to compare.</figcaption>
    </figure>
  );
}

export function Audit() {
  return (
    <section id="audit" className="bg-paper-subtle px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[1fr_1.8fr]">
        <div>
          <h2 className="font-serif text-4xl font-light tracking-tight">Start with an audit</h2>
          <p className="mt-5 max-w-[36ch] leading-relaxed text-ink-light">We review your site, then tell you plainly what to fix first.</p>
          <ul className="mt-8 space-y-3 text-ink-light">
            {["Speed: what makes pages slow on a phone", "Mobile: where visitors get stuck", "Code: what is fragile or insecure", "Design: what weakens trust"].map((t) => <li key={t} className="border-t border-paper-border pt-3">{t}</li>)}
          </ul>
          <a href="#contact" className="mt-8 inline-block text-sm underline underline-offset-4">Request yours</a>
        </div>
        <Compare />
      </div>
    </section>
  );
}
