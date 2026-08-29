import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

type Chapter = {
  numeral: string;
  title: string;
  copy: string;
  tags: string[];
  href: string;
};

const CHAPTERS: Chapter[] = [
  {
    numeral: "Chapter I",
    title: "Kyoto Nights",
    copy: "Indigo-dyed cotton, cut for the hours between dusk and the last train. Eleven pieces, none of them loud.",
    tags: ["Indigo cotton", "11 pieces", "AW26"],
    href: "/chapters/kyoto-nights",
  },
  {
    numeral: "Chapter II",
    title: "Otaru Harbor",
    copy: "Oiled canvas and raw wool, built for salt air and the walk from the ferry. Named for the town we work out of.",
    tags: ["Oiled canvas", "8 pieces", "AW26"],
    href: "/chapters/otaru-harbor",
  },
  {
    numeral: "Chapter III",
    title: "Quiet Interior",
    copy: "Undyed linen and washed silk, made for the rooms we don't photograph. The smallest chapter so far.",
    tags: ["Undyed linen", "6 pieces", "SS26"],
    href: "/chapters/quiet-interior",
  },
];

export function ChapterShowcase() {
  return (
    <section className="bg-[var(--otaru-ink)] py-[var(--space-section)]" aria-labelledby="chapters-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <Eyebrow>The chapters</Eyebrow>
          <SectionTitle>
            <span id="chapters-heading">Every chapter, a season told in cloth.</span>
          </SectionTitle>
        </RevealOnScroll>

        <div className="mt-8">
          {CHAPTERS.map((chapter, i) => (
            <RevealOnScroll key={chapter.href} index={i}>
              <article
                className={`grid grid-cols-1 items-center gap-10 border-b border-[var(--otaru-line)] py-12 last:border-b-0 md:grid-cols-2 md:gap-16 lg:py-16 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <ImagePlaceholder ratio="wide" label={`${chapter.numeral} — ${chapter.title} — 1600×1200`} />
                <div>
                  <span className="font-display text-base italic text-[var(--otaru-gold)]">{chapter.numeral}</span>
                  <h3 className="mt-2 max-w-[16ch] font-display text-[clamp(1.7rem,3vw,2.5rem)] text-[var(--otaru-parchment)]">
                    {chapter.title}
                  </h3>
                  <p className="mt-4 max-w-[42ch] leading-relaxed text-[var(--otaru-parchment-dim)]">{chapter.copy}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {chapter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--otaru-line-strong)] px-3 py-1 text-[0.66rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={chapter.href}
                    className="mt-6 inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] transition-[gap,border-color] hover:gap-3 hover:border-[var(--otaru-gold)]"
                  >
                    Read the chapter <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
