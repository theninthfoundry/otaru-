import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

const POSTS = [
  { date: "12 Aug MMXXVI", title: "On boro, and the ethics of repair", href: "/journal/on-boro" },
  { date: "30 Jul MMXXVI", title: "A week in Ōmi, where the hemp is cut", href: "/journal/a-week-in-omi" },
  { date: "14 Jul MMXXVI", title: "Why we don't do sample sales", href: "/journal/no-sample-sales" },
];

export function JournalTeaser() {
  return (
    <section className="bg-[var(--otaru-dusk)] py-[var(--space-section)]" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <Eyebrow>The journal</Eyebrow>
          <SectionTitle>
            <span id="journal-heading">Notes from the warehouse floor.</span>
          </SectionTitle>
        </RevealOnScroll>

        <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <RevealOnScroll key={post.href} index={i}>
              <li className="list-none">
                <Link href={post.href} className="group block">
                  <ImagePlaceholder ratio="wide" label="Journal — 800×500" />
                  <p className="mt-4 text-[0.68rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment-dim)]">{post.date}</p>
                  <h3 className="mt-1.5 font-display text-[1.25rem] leading-snug text-[var(--otaru-parchment)]">{post.title}</h3>
                </Link>
              </li>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
