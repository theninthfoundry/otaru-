import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export type ChapterSummary = {
  numeral: string;
  title: string;
  season: string;
  pieceCount: number;
  status: "current" | "archived";
  href: string;
};

export function ChapterIndexGrid({ chapters }: { chapters: ChapterSummary[] }) {
  return (
    <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
      {chapters.map((chapter) => (
        <li key={chapter.href} className="list-none">
          <Link href={chapter.href} className="group block">
            <ImagePlaceholder ratio="wide" label={`${chapter.numeral} — 1600×1200`} className="relative">
              {chapter.status === "archived" && (
                <span className="absolute left-3 top-3 rounded-full bg-[var(--otaru-ink)]/80 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">
                  Archived
                </span>
              )}
            </ImagePlaceholder>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-base italic text-[var(--otaru-gold)]">{chapter.numeral}</span>
              <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[var(--otaru-parchment-dim)]">
                {chapter.season} · {chapter.pieceCount} pieces
              </span>
            </div>
            <h2 className="mt-1 font-display text-[1.6rem] text-[var(--otaru-parchment)]">{chapter.title}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}
