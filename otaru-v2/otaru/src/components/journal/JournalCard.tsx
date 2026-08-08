import Link from "next/link";
import type { JournalEntry } from "@/types/sanity";

export function JournalCard({ entry }: { entry: JournalEntry }) {
  return (
    <Link href={`/journal/${entry.slug.current}`} className="group block">
      <div className="aspect-[4/3] rounded-sm bg-surface-alt mb-4" />
      <p className="otaru-eyebrow mb-2">{entry.readingTimeMinutes} min read</p>
      <h3 className="font-display text-display-sm mb-2 group-hover:text-foreground-muted transition-colors duration-1">
        {entry.title}
      </h3>
      <p className="text-body-sm text-foreground-muted">{entry.excerpt}</p>
    </Link>
  );
}
