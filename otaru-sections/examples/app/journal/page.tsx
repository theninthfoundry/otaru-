import type { Metadata } from "next";
import { JournalGrid, type JournalPost } from "@/components/journal/JournalGrid";

export const metadata: Metadata = {
  title: "Journal — Otaru",
  description: "Notes from the warehouse floor.",
};

const FEATURED: JournalPost = {
  id: "boro-loom",
  title: "The loom that's older than the company",
  excerpt:
    "We bought it secondhand in 2019 from a mill that was closing. It still runs every piece in Chapter II. A short account of getting it working again.",
  date: "22 Aug MMXXVI",
  href: "/journal/boro-loom",
};

const POSTS: JournalPost[] = [
  { id: "on-boro", title: "On boro, and the ethics of repair", excerpt: "Why we mend visible seams instead of hiding them.", date: "12 Aug MMXXVI", href: "/journal/on-boro" },
  { id: "a-week-in-omi", title: "A week in Ōmi, where the hemp is cut", excerpt: "Notes from the farm that supplies Chapter III.", date: "30 Jul MMXXVI", href: "/journal/a-week-in-omi" },
  { id: "no-sample-sales", title: "Why we don't do sample sales", excerpt: "The math behind keeping a small run small.", date: "14 Jul MMXXVI", href: "/journal/no-sample-sales" },
  { id: "dyeing-in-winter", title: "Dyeing indigo in a Hokkaido winter", excerpt: "The vats behave differently below freezing.", date: "02 Jul MMXXVI", href: "/journal/dyeing-in-winter" },
  { id: "on-sizing", title: "Why our sizing runs long", excerpt: "A note on the bodies we actually design for.", date: "19 Jun MMXXVI", href: "/journal/on-sizing" },
  { id: "verify-explainer", title: "How the Verify tool actually works", excerpt: "What's on the tag, and what it checks against.", date: "05 Jun MMXXVI", href: "/journal/verify-explainer" },
];

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-32 lg:px-8">
      <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
        The journal
      </span>
      <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,4.2vw,3.4rem)] text-[var(--otaru-parchment)]">
        Notes from the warehouse floor.
      </h1>

      <JournalGrid featured={FEATURED} posts={POSTS} />
    </div>
  );
}
