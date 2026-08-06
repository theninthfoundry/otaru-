import Link from "next/link";
import type { Chapter } from "@/types/sanity";
import { RevealText } from "@/components/animations/RevealText";

export function ChapterSpotlight({ chapter }: { chapter: Chapter }) {
  return (
    <section className="otaru-container py-24">
      <RevealText>
        <p className="otaru-eyebrow mb-4">Chapter {String(chapter.number).padStart(2, "0")}</p>
        <h2 className="font-display text-display-lg mb-6">{chapter.title}</h2>
        <p className="max-w-xl text-body-lg text-foreground-muted mb-8">{chapter.curatorNote}</p>
        <Link href={`/chapter/${chapter.slug.current}`} className="text-body-sm underline underline-offset-4">
          Enter the Chapter →
        </Link>
      </RevealText>
    </section>
  );
}
