import Link from 'next/link';
import type { SanityJournalEntry } from '@/lib/sanity/types';

interface RelatedArticlesProps {
  entries: SanityJournalEntry[];
}

export function RelatedArticles({ entries }: RelatedArticlesProps) {
  if (!entries || entries.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-otaru-border/40 mt-16 md:mt-24">
      <div className="grid-container max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-md font-semibold tracking-tight text-otaru-ink">
            Related Stories
          </h3>
          <Link
            href="/journal"
            className="text-caption text-otaru-ink-muted hover:text-otaru-ink underline text-xs transition-colors"
          >
            View All Journal Entries
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <article key={entry._id} className="group space-y-3">
              <Link href={`/journal/${entry.slug}`} className="block space-y-3">
                <div className="aspect-[4/3] bg-otaru-cream overflow-hidden rounded-sm">
                  {entry.coverImage?.asset?.url ? (
                    <img
                      src={entry.coverImage.asset.url}
                      alt={entry.coverImage.alt ?? entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-caption text-otaru-ink-subtle">
                      Otaru Journal
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] block">
                    {entry.chapter?.title ?? 'Editorial'}
                  </span>
                  <h4 className="text-body-md font-medium text-otaru-ink group-hover:text-otaru-ink-muted transition-colors line-clamp-2 mt-1">
                    {entry.title}
                  </h4>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
