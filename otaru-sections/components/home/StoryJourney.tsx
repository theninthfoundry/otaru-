import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

export function StoryJourney() {
  return (
    <section className="bg-[var(--otaru-ink)] py-[var(--space-section)]" aria-labelledby="journey-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
          <RevealOnScroll>
            <ImagePlaceholder ratio="tall" label="Studio — Otaru, Hokkaido — 1000×1300" />
          </RevealOnScroll>
          <RevealOnScroll index={1}>
            <Eyebrow>The studio</Eyebrow>
            <SectionTitle className="max-w-[14ch]">
              <span id="journey-heading">Otaru was a town before it was a name.</span>
            </SectionTitle>
            <div className="mt-4 space-y-4 text-[var(--otaru-parchment-dim)]">
              <p className="max-w-[44ch] leading-relaxed">
                In 1907 the harbor at Otaru moved more coal, herring, and cloth than any port in Hokkaido. The
                warehouses are mostly empty now. We kept one.
              </p>
              <p className="max-w-[44ch] leading-relaxed">
                Every artifact in this archive is developed in that warehouse, dyed in water drawn from the same
                canal the herring boats used, and finished by four people who have worked together for eleven years.
              </p>
              <p className="max-w-[44ch] leading-relaxed">We do not chase seasons. We chase the right amount of time.</p>
            </div>
            <Link
              href="/studio"
              className="mt-6 inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] transition-[gap,border-color] hover:gap-3 hover:border-[var(--otaru-gold)]"
            >
              Read the full story <span aria-hidden="true">→</span>
            </Link>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
