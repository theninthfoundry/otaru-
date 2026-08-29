import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Timeline } from "@/components/studio/Timeline";
import { ValuesList } from "@/components/studio/ValuesList";
import { TeamGrid } from "@/components/studio/TeamGrid";

export const metadata: Metadata = {
  title: "Studio — Otaru",
  description: "Otaru was a town before it was a name.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-32 lg:px-8">
      {/* Intro — the same story as the homepage teaser, told in full */}
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
        <div>
          <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
            The studio
          </span>
          <h1 className="mt-3 max-w-[14ch] font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.08] text-[var(--otaru-parchment)]">
            Otaru was a town before it was a name.
          </h1>
          <div className="mt-5 space-y-4 text-[var(--otaru-parchment-dim)]">
            <p className="max-w-[46ch] leading-relaxed">
              In 1907 the harbor at Otaru moved more coal, herring, and cloth than any port in Hokkaido. The
              warehouses are mostly empty now. We kept one.
            </p>
            <p className="max-w-[46ch] leading-relaxed">
              Every artifact in this archive is developed in that warehouse, dyed in water drawn from the same canal
              the herring boats used, and finished by four people who have worked together for eleven years.
            </p>
            <p className="max-w-[46ch] leading-relaxed">We do not chase seasons. We chase the right amount of time.</p>
          </div>
        </div>
        <ImagePlaceholder ratio="tall" label="Studio — Otaru, Hokkaido — 1000×1300" />
      </div>

      {/* Timeline */}
      <div className="mt-24 border-t border-[var(--otaru-line)] pt-20">
        <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
          A short history
        </span>
        <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.7rem,3.4vw,2.6rem)] text-[var(--otaru-parchment)]">
          Nineteen years between the first warehouse and the first jacket.
        </h2>
        <Timeline />
      </div>

      {/* Values */}
      <div className="mt-24 border-t border-[var(--otaru-line)] pt-20">
        <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
          How we work
        </span>
        <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.7rem,3.4vw,2.6rem)] text-[var(--otaru-parchment)]">
          Four principles that don&rsquo;t change with the season.
        </h2>
        <ValuesList />
      </div>

      {/* Team */}
      <div className="mt-24 border-t border-[var(--otaru-line)] pt-20">
        <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
          The people
        </span>
        <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.7rem,3.4vw,2.6rem)] text-[var(--otaru-parchment)]">
          Four names on every care label.
        </h2>
        <TeamGrid />
      </div>

      {/* Visit / careers callout */}
      <div className="mt-24 flex flex-col items-start gap-4 border-t border-[var(--otaru-line)] pt-20 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="max-w-[26ch] font-display text-[1.5rem] text-[var(--otaru-parchment)]">
            The studio is open to visitors by appointment, most Fridays.
          </h2>
          <p className="mt-2 text-sm text-[var(--otaru-parchment-dim)]">Otaru, Hokkaido — exact address on request.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/contact"
            className="border border-[var(--otaru-line-strong)] px-5 py-3 text-[0.78rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment)] transition-colors hover:border-[var(--otaru-gold-dim)]"
          >
            Request a visit
          </Link>
          <Link
            href="/studio/careers"
            className="border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment)] hover:border-[var(--otaru-gold)]"
          >
            Careers →
          </Link>
        </div>
      </div>
    </div>
  );
}
