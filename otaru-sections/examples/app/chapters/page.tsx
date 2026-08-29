import type { Metadata } from "next";
import { ChapterIndexGrid, type ChapterSummary } from "@/components/chapters/ChapterIndexGrid";

export const metadata: Metadata = {
  title: "Chapters — Otaru",
  description: "Every chapter, a season told in cloth.",
};

const CHAPTERS: ChapterSummary[] = [
  { numeral: "Chapter III", title: "Quiet Interior", season: "SS26", pieceCount: 6, status: "current", href: "/chapters/quiet-interior" },
  { numeral: "Chapter II", title: "Otaru Harbor", season: "AW26", pieceCount: 8, status: "current", href: "/chapters/otaru-harbor" },
  { numeral: "Chapter I", title: "Kyoto Nights", season: "AW26", pieceCount: 11, status: "current", href: "/chapters/kyoto-nights" },
  { numeral: "Chapter 0", title: "First Run", season: "AW25", pieceCount: 11, status: "archived", href: "/chapters/first-run" },
];

export default function ChaptersPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-32 lg:px-8">
      <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
        The chapters
      </span>
      <h1 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,4.2vw,3.4rem)] text-[var(--otaru-parchment)]">
        Every chapter, a season told in cloth.
      </h1>
      <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-[var(--otaru-parchment-dim)]">
        Chapters release when the work is ready, not on a retail calendar. Archived chapters stay listed — the
        pieces themselves may still turn up in the Archive.
      </p>

      <ChapterIndexGrid chapters={CHAPTERS} />
    </div>
  );
}
