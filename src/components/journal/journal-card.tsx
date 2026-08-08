import Link from 'next/link';
import type { SanityJournalEntry } from '@/lib/sanity/types';

interface JournalCardProps {
  entry: SanityJournalEntry;
}

export function JournalCard({ entry }: JournalCardProps) {
  return (
    <article id={`journal-card-${entry.slug}`} className="group">
      <Link href={`/journal/${entry.slug}`} data-cursor="view" data-cursor-label="Read">
        {entry.coverImage && (
          <div className="aspect-[16/9] overflow-hidden bg-otaru-cream">
          </div>
        )}
        <div className="mt-3">
          <h3 className="text-heading-sm font-medium">
            {entry.title}
          </h3>
          {entry.excerpt && (
            <p className="text-body-sm text-otaru-ink-muted mt-1 line-clamp-2">
              {entry.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-caption text-otaru-ink-subtle">
            {entry.chapter && (
              <span>
                Chapter {entry.chapter.chapterNumber.toString().padStart(2, '0')}
              </span>
            )}
            <time dateTime={entry.publishedAt}>
              {new Date(entry.publishedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
