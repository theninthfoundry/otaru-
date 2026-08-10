import { notFound } from "next/navigation";
import { getJournalEntryBySlug, getJournalEntries } from "@/lib/sanity";
import { PortableTextRenderer } from "@/components/journal/PortableTextRenderer";
import { ReadingProgress } from "@/components/journal/ReadingProgress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getJournalEntries();
  return entries.map((e) => ({ slug: e.slug.current }));
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry) notFound();

  return (
    <article className="otaru-container max-w-3xl pt-36 pb-24">
      <ReadingProgress />
      <p className="otaru-eyebrow mb-4">{entry.author.name} · {entry.readingTimeMinutes} min read</p>
      <h1 className="font-display text-display-lg mb-12">{entry.title}</h1>
      <PortableTextRenderer blocks={entry.body} />
    </article>
  );
}
