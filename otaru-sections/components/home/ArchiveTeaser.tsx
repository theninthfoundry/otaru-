"use client";

import { useState } from "react";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle, SectionLede } from "@/components/ui/SectionHeading";

const FILTERS = ["All", "Outerwear", "Tops", "Trousers", "Accessories"] as const;

// Placeholder catalog numbers — swap for a real paginated/filtered
// archive query (see section 6 of the build directive: filtering,
// sorting, URL state).
const PREVIEW_NUMBERS = ["038", "037", "036", "035", "034", "033"];

export function ArchiveTeaser() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  return (
    <section className="bg-[var(--otaru-dusk)] py-[var(--space-section)]" aria-labelledby="archive-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <Eyebrow>The archive</Eyebrow>
          <SectionTitle>
            <span id="archive-heading">412 objects. Nothing reprinted.</span>
          </SectionTitle>
          <SectionLede>
            Every artifact we've ever released, cataloged and searchable. When a run sells out, the listing stays — as
            a record, not an invitation.
          </SectionLede>
        </RevealOnScroll>

        <RevealOnScroll className="mt-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the archive">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={active === filter}
                onClick={() => setActive(filter)}
                className={`rounded-full border px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.08em] transition-colors ${
                  active === filter
                    ? "border-[var(--otaru-parchment)] bg-[var(--otaru-parchment)] text-[var(--otaru-ink)]"
                    : "border-[var(--otaru-line-strong)] text-[var(--otaru-parchment-dim)] hover:bg-[var(--otaru-parchment)] hover:text-[var(--otaru-ink)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PREVIEW_NUMBERS.map((num, i) => (
            <RevealOnScroll key={num} index={i}>
              <li className="list-none">
                <Link href={`/archive?ref=${num}`} className="group block">
                  <ImagePlaceholder ratio="portrait" label={`No. ${num}`} className="transition-opacity group-hover:opacity-80" />
                </Link>
              </li>
            </RevealOnScroll>
          ))}
        </ul>

        <RevealOnScroll className="mt-10 text-center">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] transition-[gap,border-color] hover:gap-3 hover:border-[var(--otaru-gold)]"
          >
            Enter the archive <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
