import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChapterBySlug, getChapterSlugs, getJournalEntries } from '@/lib/sanity/queries';
import { getProductsByCollection } from '@/lib/shopify/queries/products';
import { ChapterHero } from '@/components/editorial/chapter-hero';
import { ManifestoSection } from '@/components/editorial/manifesto-section';
import { PortableTextRenderer } from '@/components/journal/portable-text-renderer';
import { LookbookSlider } from '@/components/chapter/lookbook-slider';
import { ArtifactCard } from '@/components/artifact/artifact-card';
import { NewsletterForm } from '@/components/layout/newsletter-form';
import Link from 'next/link';

interface ChapterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const chapters = await getChapterSlugs().catch(() => []);
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = await getChapterBySlug(slug);

  if (!chapter) return { title: 'Chapter Not Found' };

  return {
    title: `Chapter ${chapter.chapterNumber.toString().padStart(2, '0')} — "${chapter.title}" | Otaru`,
    description:
      chapter.seo?.description ??
      chapter.tagline ??
      `Explore Chapter ${chapter.chapterNumber}: ${chapter.title}`,
    openGraph: {
      title: `Chapter ${chapter.chapterNumber} — ${chapter.title}`,
      description: chapter.tagline ?? '',
      images: chapter.coverImage?.asset?.url ? [{ url: chapter.coverImage.asset.url }] : undefined,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;

  const [chapter, journalEntries] = await Promise.all([
    getChapterBySlug(slug),
    getJournalEntries(6).catch(() => []),
  ]);

  if (!chapter) notFound();

  // Fetch associated Artifacts from Shopify if collection handle exists
  const productsResult = chapter.shopifyCollectionHandle
    ? await getProductsByCollection(chapter.shopifyCollectionHandle).catch(
        () => null,
      )
    : null;

  const artifacts = productsResult?.artifacts ?? [];
  const relatedJournal = journalEntries.find((j) => j.chapter?.slug === slug) ?? journalEntries[0];

  const lookbookImages = [
    {
      id: 'look-1',
      url: chapter.coverImage?.asset?.url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
      caption: `Look 01 &bull; ${chapter.title} — Architectural Cut`,
    },
    {
      id: 'look-2',
      url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1600&q=85',
      caption: 'Look 02 &bull; Raw Selvage Detail & Gunmetal Closures',
    },
    {
      id: 'look-3',
      url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1600&q=85',
      caption: 'Look 03 &bull; Melton Wool Outerwear Silhouette',
    },
  ];

  return (
    <article className="space-y-16 md:space-y-24 pb-20">
      {/* 1. Cinematic Chapter Hero */}
      <ChapterHero
        title={chapter.title}
        chapterNumber={chapter.chapterNumber}
        status={chapter.status}
        tagline={chapter.tagline}
        coverImageUrl={chapter.coverImage?.asset?.url}
        symbolName={chapter.symbol?.name}
        symbolMeaning={chapter.symbol?.meaning}
      />

      {/* 2. Chapter Manifesto Section */}
      <ManifestoSection
        headline={`Chapter ${chapter.chapterNumber.toString().padStart(2, '0')} Philosophy`}
        quote={chapter.tagline ?? `The essence of ${chapter.title}`}
        subtext={`Each garment in Chapter ${chapter.chapterNumber.toString().padStart(2, '0')} is produced in limited quantity, engineered with precision, and cataloged for permanence.`}
        author="Otaru Studio"
      />

      {/* 3. Lookbook Interactive Slider */}
      <section id="lookbook" aria-label="Chapter Lookbook" className="grid-container max-w-5xl">
        <LookbookSlider images={lookbookImages} chapterTitle={`Chapter ${chapter.chapterNumber.toString().padStart(2, '0')}`} />
      </section>

      {/* 3. Narrative Story (Portable Text) */}
      {chapter.story && (
        <section id="chapter-story" aria-label="Chapter Narrative" className="grid-container">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold text-center">
              The Narrative
            </h2>
            <PortableTextRenderer content={chapter.story} />
          </div>
        </section>
      )}

      {/* 4. Collection Artifact Grid */}
      <section id="chapter-artifacts" aria-label="Artifacts in this Chapter" className="grid-container space-y-8 pt-8 border-t border-otaru-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[10px] font-semibold">
              Collection Release
            </span>
            <h2 className="text-display-sm font-semibold text-otaru-ink mt-1">
              Artifacts ({artifacts.length})
            </h2>
          </div>
          <Link
            href="/archive"
            className="text-caption text-otaru-ink-muted hover:text-otaru-ink underline text-xs"
          >
            Explore Full Archive →
          </Link>
        </div>

        {artifacts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {artifacts.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-body-md text-otaru-ink-muted bg-otaru-cream/30 rounded-sm">
            Artifacts for this Chapter are currently being cataloged.
          </div>
        )}
      </section>

      {/* 5. Production Details */}
      {(chapter.productionYear || chapter.totalProduced) && (
        <section id="production-details" aria-label="Production Details" className="grid-container max-w-4xl">
          <div className="p-6 md:p-8 bg-otaru-chalk-warm border border-otaru-border/60 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] block">
                Provenance & Archival Specs
              </span>
              <h4 className="text-heading-sm font-semibold text-otaru-ink mt-1">
                Chapter {chapter.chapterNumber.toString().padStart(2, '0')} Specifications
              </h4>
            </div>
            <div className="flex items-center gap-8 text-caption text-otaru-ink text-xs font-medium">
              {chapter.productionYear && (
                <div>
                  <span className="text-otaru-ink-subtle block text-[10px] uppercase">Year</span>
                  <span>{chapter.productionYear}</span>
                </div>
              )}
              {chapter.totalProduced && (
                <div>
                  <span className="text-otaru-ink-subtle block text-[10px] uppercase">Limited Edition</span>
                  <span>{chapter.totalProduced} Units</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. Related Journal Entry */}
      {relatedJournal && (
        <section id="related-journal" className="grid-container max-w-4xl pt-8 border-t border-otaru-border/40">
          <div className="space-y-4">
            <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] font-semibold">
              Editorial Connection
            </span>
            <div className="p-6 bg-otaru-cream/50 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-heading-sm font-medium text-otaru-ink">
                  {relatedJournal.title}
                </h4>
                {relatedJournal.excerpt && (
                  <p className="text-body-sm text-otaru-ink-muted line-clamp-2">
                    {relatedJournal.excerpt}
                  </p>
                )}
              </div>
              <Link
                href={`/journal/${relatedJournal.slug}`}
                className="px-5 py-2.5 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors shrink-0"
              >
                Read Story
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Newsletter CTA */}
      <section className="grid-container max-w-xl text-center space-y-4 pt-12">
        <h3 className="text-heading-md font-semibold text-otaru-ink">
          Stay Updated on Future Chapters
        </h3>
        <p className="text-body-md text-otaru-ink-muted">
          Subscribe to receive notifications when new Chapters and limited Artifacts are released.
        </p>
        <div className="pt-2">
          <NewsletterForm />
        </div>
      </section>
    </article>
  );
}
