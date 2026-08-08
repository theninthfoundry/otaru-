import type { Metadata } from 'next';
import Link from 'next/link';
import { getJournalEntries } from '@/lib/sanity/queries';
import { JournalCard } from '@/components/journal/journal-card';

export const metadata: Metadata = {
  title: 'Journal — Otaru Editorial Stories',
  description:
    'Craft notes, material investigations, and long-form editorial narratives from the Otaru design studio.',
};

export default async function JournalPage() {
  const entries = await getJournalEntries(20).catch(() => []);
  const featuredEntry = entries[0];
  const remainingEntries = entries.slice(1);

  return (
    <section id="journal" aria-label="Journal" className="py-12 md:py-20">
      <div className="grid-container space-y-12 md:space-y-16">
        <header className="space-y-3 max-w-2xl">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Publication & Stories
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            Journal
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light">
            In-depth material investigations, craftsman manifestos, and behind-the-scenes narratives from our design lab.
          </p>
        </header>

        {featuredEntry && (
          <article className="group relative border-y border-otaru-border/50 py-8 md:py-12">
            <Link
              href={`/journal/${featuredEntry.slug}`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 aspect-[16/10] bg-otaru-cream overflow-hidden rounded-sm">
                {featuredEntry.coverImage?.asset?.url ? (
                  <img
                    src={featuredEntry.coverImage.asset.url}
                    alt={featuredEntry.coverImage.alt ?? featuredEntry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-caption text-otaru-ink-subtle">
                    Featured Editorial
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-4">
                {featuredEntry.chapter && (
                  <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] font-semibold">
                    Chapter {featuredEntry.chapter.chapterNumber.toString().padStart(2, '0')} — {featuredEntry.chapter.title}
                  </span>
                )}
                <h2 className="text-display-sm font-semibold tracking-tight text-otaru-ink group-hover:text-otaru-ink-muted transition-colors leading-tight">
                  {featuredEntry.title}
                </h2>
                {featuredEntry.excerpt && (
                  <p className="text-body-md text-otaru-ink-muted font-light line-clamp-3 leading-relaxed">
                    {featuredEntry.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-caption text-otaru-ink-subtle text-xs pt-2">
                  {featuredEntry.author && <span>By {featuredEntry.author}</span>}
                  <span>•</span>
                  <time dateTime={featuredEntry.publishedAt}>
                    {new Date(featuredEntry.publishedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        )}

        {remainingEntries.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-heading-md font-semibold tracking-tight text-otaru-ink">
              Recent Articles
            </h3>
            <div
              id="journal-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {remainingEntries.map((entry) => (
                <JournalCard key={entry._id} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div className="py-16 text-center text-body-md text-otaru-ink-muted">
            No journal entries found. Check back soon for studio updates.
          </div>
        )}
      </div>
    </section>
  );
}
