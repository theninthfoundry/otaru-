import Link from 'next/link';
import type { SanityChapter } from '@/lib/sanity/types';

/**
 * Chapter preview card for homepage/archive.
 */
interface ChapterCardProps {
  chapter: SanityChapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  const chapterNum = chapter.chapterNumber.toString().padStart(2, '0');

  return (
    <article id={`chapter-card-${chapter.slug}`} className="group">
      <Link href={`/chapter/${chapter.slug}`} aria-label={`Chapter ${chapterNum} — ${chapter.title}`}>
        {/* Cover Image */}
        {chapter.coverImage && (
          <div className="aspect-[16/9] overflow-hidden bg-otaru-cream">
            {/* Will use next/image with Sanity URL builder */}
          </div>
        )}

        <div className="mt-3">
          <p className="text-overline tracking-overline uppercase text-otaru-ink-subtle">
            Chapter {chapterNum}
            {chapter.status === 'archived' && ' · Archived'}
            {chapter.status === 'upcoming' && ' · Coming Soon'}
          </p>
          <h3 className="text-heading-md font-semibold mt-1">
            {chapter.title}
          </h3>
          {chapter.tagline && (
            <p className="text-body-sm text-otaru-ink-muted mt-1">
              {chapter.tagline}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
