interface EditorialHeroProps {
  title: string;
  excerpt?: string;
  author?: string;
  publishedAt: string;
  readTimeMinutes?: number;
  coverImageUrl?: string;
  coverImageAlt?: string;
  chapterTitle?: string;
  chapterSlug?: string;
  chapterNumber?: number;
}

export function EditorialHero({
  title,
  excerpt,
  author,
  publishedAt,
  readTimeMinutes = 4,
  coverImageUrl,
  coverImageAlt,
  chapterTitle,
  chapterSlug,
  chapterNumber,
}: EditorialHeroProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="relative w-full overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="grid-container space-y-8 max-w-5xl">
        {chapterTitle && (
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-medium">
            {chapterSlug ? (
              <a
                href={`/chapter/${chapterSlug}`}
                className="hover:text-otaru-ink transition-colors"
              >
                Chapter {chapterNumber?.toString().padStart(2, '0')} — {chapterTitle}
              </a>
            ) : (
              `Chapter — ${chapterTitle}`
            )}
          </p>
        )}

        <h1 className="text-display-xl font-bold tracking-tight text-otaru-ink leading-[1.05]">
          {title}
        </h1>

        {excerpt && (
          <p className="text-body-lg text-otaru-ink-muted max-w-2xl font-normal leading-relaxed">
            {excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-caption text-otaru-ink-subtle pt-4 border-t border-otaru-border/50 text-xs">
          {author && (
            <span className="font-medium text-otaru-ink">Words by {author}</span>
          )}
          <span>•</span>
          <time dateTime={publishedAt}>{formattedDate}</time>
          <span>•</span>
          <span>{readTimeMinutes} min read</span>
        </div>
      </div>

      {coverImageUrl && (
        <div className="w-full mt-12 aspect-[16/9] md:aspect-[21/9] bg-otaru-cream overflow-hidden relative">
          <img
            src={coverImageUrl}
            alt={coverImageAlt ?? title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </header>
  );
}
