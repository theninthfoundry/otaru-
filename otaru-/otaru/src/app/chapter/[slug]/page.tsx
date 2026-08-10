import { notFound } from "next/navigation";
import { getChapterBySlug, getChapters } from "@/lib/sanity";
import { getArtifacts } from "@/lib/shopify";
import { ArtifactCard } from "@/components/artifact/ArtifactCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const chapters = await getChapters();
  return chapters.map((c) => ({ slug: c.slug.current }));
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const [chapter, artifacts] = await Promise.all([getChapterBySlug(slug), getArtifacts()]);
  if (!chapter) notFound();

  const chapterArtifacts = artifacts.filter((a) => chapter.artifactHandles.includes(a.handle));

  return (
    <div>
      <section className="otaru-container pt-36 pb-16">
        <p className="otaru-eyebrow mb-4">Chapter {String(chapter.number).padStart(2, "0")}</p>
        <h1 className="font-display text-display-lg mb-6 max-w-3xl">{chapter.title}</h1>
        <p className="max-w-xl text-body-lg text-foreground-muted">{chapter.curatorNote}</p>
      </section>

      <section className="otaru-container pb-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {chapterArtifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </section>
    </div>
  );
}
