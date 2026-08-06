import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJournalBySlug, getJournalEntries, getJournalSlugs } from '@/lib/sanity/queries';
import { ReadingProgress } from '@/components/editorial/reading-progress';
import { EditorialHero } from '@/components/editorial/editorial-hero';
import { PortableTextRenderer } from '@/components/journal/portable-text-renderer';
import { RelatedArticles } from '@/components/editorial/related-articles';

interface JournalEntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getJournalSlugs().catch(() => []);
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: JournalEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getJournalBySlug(slug);

  if (!entry) return { title: 'Entry Not Found' };

  return {
    title: `${entry.title} — Otaru Journal`,
    description: entry.seo?.description ?? entry.excerpt ?? '',
    openGraph: {
      title: entry.title,
      description: entry.excerpt ?? '',
      type: 'article',
      publishedTime: entry.publishedAt,
      authors: entry.author ? [entry.author] : undefined,
      images: entry.coverImage?.asset?.url ? [{ url: entry.coverImage.asset.url }] : undefined,
    },
  };
}

export default async function JournalEntryPage({
  params,
}: JournalEntryPageProps) {
  const { slug } = await params;

  const [entry, allEntries] = await Promise.all([
    getJournalBySlug(slug),
    getJournalEntries(4).catch(() => []),
  ]);

  if (!entry) notFound();

  const relatedEntries = allEntries.filter((e) => e.slug !== slug).slice(0, 3);
  const wordCount = entry.body ? JSON.stringify(entry.body).split(/\s+/).length : 500;
  const readTimeMinutes = Math.max(2, Math.ceil(wordCount / 200));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.title,
    description: entry.excerpt,
    datePublished: entry.publishedAt,
    author: {
      '@type': 'Person',
      name: entry.author ?? 'Otaru Studio',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Otaru',
    },
    image: entry.coverImage?.asset?.url,
  };

  return (
    <>
      <ReadingProgress />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article id="journal-entry" itemScope itemType="https://schema.org/Article" className="pb-16">
        {/* Editorial Hero */}
        <EditorialHero
          title={entry.title}
          excerpt={entry.excerpt}
          author={entry.author}
          publishedAt={entry.publishedAt}
          readTimeMinutes={readTimeMinutes}
          coverImageUrl={entry.coverImage?.asset?.url}
          coverImageAlt={entry.coverImage?.alt}
          chapterTitle={entry.chapter?.title}
          chapterSlug={entry.chapter?.slug}
          chapterNumber={entry.chapter?.chapterNumber}
        />

        {/* Story Body */}
        <div id="journal-body" itemProp="articleBody" className="grid-container mt-12 md:mt-16">
          {entry.body && <PortableTextRenderer content={entry.body} />}
        </div>

        {/* Related Articles */}
        <RelatedArticles entries={relatedEntries} />
      </article>
    </>
  );
}
