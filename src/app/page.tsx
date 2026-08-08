import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify/queries/products';
import { getActiveChapter, getAllChapters, getJournalEntries, getSiteSettings } from '@/lib/sanity/queries';
import { ArtifactCard } from '@/components/artifact/artifact-card';
import { JournalCard } from '@/components/journal/journal-card';
import { NewsletterForm } from '@/components/layout/newsletter-form';
import { ManifestoSection } from '@/components/editorial/manifesto-section';

export const metadata: Metadata = {
  title: 'Otaru — Garments Worth Keeping',
  description:
    'Craftsmanship outlasts trends. Limited-run, design-led garments built from exceptional fabric and invisible construction quality.',
};

export default async function HomePage() {
  const [productsResult, activeChapter, chapters, journalEntries, settings] =
    await Promise.all([
      getProducts({ first: 8 }).catch(() => ({ artifacts: [], pageInfo: { hasNextPage: false, endCursor: null } })),
      getActiveChapter().catch(() => null),
      getAllChapters().catch(() => []),
      getJournalEntries(3).catch(() => []),
      getSiteSettings().catch(() => null),
    ]);

  const { artifacts: featuredArtifacts } = productsResult;
  const leadJournal = journalEntries[0];

  return (
    <>
      <section id="hero" aria-label="Hero" className="relative min-h-[85vh] flex flex-col justify-between py-16 md:py-24 border-b border-otaru-border/40">
        <div className="grid-container space-y-6 my-auto max-w-5xl">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Otaru Design House — Established MMXXIV
          </p>
          <h1 className="text-display-xl md:text-[5rem] font-bold tracking-tight text-otaru-ink leading-[0.98]">
            Garments worth keeping.
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light max-w-xl leading-relaxed pt-2">
            Craftsmanship outlasts trends. We build limited-run garments from exceptional raw textiles, precise architectural cuts, and permanent intention.
          </p>
          <div className="pt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/archive"
              className="px-8 py-3.5 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors"
            >
              Explore Archive
            </Link>
            <Link
              href="/chapter"
              className="px-8 py-3.5 bg-transparent border border-otaru-border text-otaru-ink text-body-sm font-medium rounded-full hover:border-otaru-ink transition-colors"
            >
              View Chapters
            </Link>
          </div>
        </div>

        <div className="grid-container flex items-center justify-between text-caption text-otaru-ink-subtle text-xs pt-8 border-t border-otaru-border/20">
          <span>Limited Releases Only</span>
          <span>Tokyo · New Delhi · Global Shipping</span>
          <span>{featuredArtifacts.length} Active Artifacts</span>
        </div>
      </section>

      <ManifestoSection
        headline="Brand Philosophy"
        quote="We do not make seasonal collections. We publish numbered Chapters."
        subtext="Every piece is designed to age gracefully, maintaining structural integrity through years of wear."
        author="Otaru Design Principles"
      />

      {activeChapter && (
        <section id="active-chapter" aria-label="Current Chapter" className="py-20 bg-otaru-chalk-warm border-b border-otaru-border/40">
          <div className="grid-container max-w-5xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
                  Current Chapter Release
                </span>
                <h2 className="text-display-md font-semibold tracking-tight text-otaru-ink mt-1">
                  Chapter {activeChapter.chapterNumber.toString().padStart(2, '0')} — &ldquo;{activeChapter.title}&rdquo;
                </h2>
              </div>
              <Link
                href={`/chapter/${activeChapter.slug}`}
                className="px-6 py-2.5 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors shrink-0"
              >
                Enter Chapter World →
              </Link>
            </div>

            {activeChapter.coverImage?.asset?.url && (
              <div className="aspect-[16/8] bg-otaru-cream overflow-hidden rounded-sm relative group">
                <img
                  src={activeChapter.coverImage.asset.url}
                  alt={activeChapter.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {activeChapter.tagline && (
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-otaru-ink/90 backdrop-blur-md text-otaru-chalk rounded-xs max-w-lg">
                    <p className="text-body-md font-light italic">
                      &ldquo;{activeChapter.tagline}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="featured-artifacts" aria-label="Featured Artifacts" className="py-20">
        <div className="grid-container space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
                Latest Releases
              </p>
              <h2 className="text-display-sm font-semibold tracking-tight text-otaru-ink mt-1">
                Recent Artifacts
              </h2>
            </div>
            <Link href="/archive" className="text-caption text-otaru-ink-muted hover:text-otaru-ink underline text-xs">
              View All ({featuredArtifacts.length})
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featuredArtifacts.slice(0, 4).map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </div>
        </div>
      </section>

      {leadJournal && (
        <section id="editorial-highlight" aria-label="Editorial Highlight" className="py-20 bg-otaru-chalk-warm border-y border-otaru-border/40">
          <div className="grid-container max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
                Publication Highlight
              </p>
              <Link href="/journal" className="text-caption text-otaru-ink-muted hover:text-otaru-ink underline text-xs">
                Visit Journal Hub
              </Link>
            </div>

            <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <Link
                href={`/journal/${leadJournal.slug}`}
                className="lg:col-span-7 aspect-[16/10] bg-otaru-cream overflow-hidden rounded-sm group block focus:outline-none focus-visible:ring-2 focus-visible:ring-otaru-ink"
                data-cursor="view"
                data-cursor-label="Read"
              >
                {leadJournal.coverImage?.asset?.url && (
                  <img
                    src={leadJournal.coverImage.asset.url}
                    alt={leadJournal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </Link>
              <div className="lg:col-span-5 space-y-4">
                <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] font-semibold">
                  Featured Story
                </span>
                <h3 className="text-display-sm font-semibold text-otaru-ink leading-tight">
                  {leadJournal.title}
                </h3>
                {leadJournal.excerpt && (
                  <p className="text-body-md text-otaru-ink-muted font-light line-clamp-3">
                    {leadJournal.excerpt}
                  </p>
                )}
                <Link
                  href={`/journal/${leadJournal.slug}`}
                  className="inline-block px-6 py-2.5 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors pt-2"
                >
                  Read Full Editorial →
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <section id="newsletter" aria-label="Newsletter" className="py-24">
        <div className="grid-container max-w-xl text-center space-y-4">
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
            Private Access
          </span>
          <h2 className="text-display-sm font-semibold text-otaru-ink">
            {settings?.newsletterHeadline ?? 'Join the Otaru Registry'}
          </h2>
          <p className="text-body-md text-otaru-ink-muted font-light">
            {settings?.newsletterSubtext ?? 'Receive private release dates, chapter manifestos, and archive notifications directly.'}
          </p>
          <div className="pt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
