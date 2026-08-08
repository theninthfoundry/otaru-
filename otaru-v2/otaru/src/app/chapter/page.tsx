import Link from "next/link";
import { getChapters } from "@/lib/sanity";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = { title: "Chapters — Otaru" };

export default async function ChapterIndexPage() {
  const chapters = await getChapters();

  return (
    <div className="otaru-container pt-32 pb-24">
      <SectionHeading eyebrow="Published Releases" title="Chapters" />
      <div className="divide-y divide-border">
        {chapters.map((chapter) => (
          <Link key={chapter._id} href={`/chapter/${chapter.slug.current}`} className="flex items-center justify-between py-8 group">
            <div>
              <p className="otaru-eyebrow mb-2">Chapter {String(chapter.number).padStart(2, "0")}</p>
              <h2 className="font-display text-display-sm">{chapter.title}</h2>
            </div>
            <span className="text-body-sm group-hover:translate-x-1 transition-transform duration-1">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
