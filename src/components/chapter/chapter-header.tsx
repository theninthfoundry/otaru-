import type { SanityChapter } from '@/lib/sanity/types';

interface ChapterHeaderProps {
  chapter: SanityChapter;
}

export function ChapterHeader({ chapter }: ChapterHeaderProps) {
  return (
    <header id="chapter-hero" className="grid-container">
      <p className="text-overline tracking-overline uppercase text-otaru-ink-subtle">
        Chapter {chapter.chapterNumber.toString().padStart(2, '0')}
      </p>
      <h1 className="text-display-lg font-semibold tracking-tight mt-2">
        {chapter.title}
      </h1>
      {chapter.tagline && (
        <p className="text-body-lg text-otaru-ink-muted mt-4">
          {chapter.tagline}
        </p>
      )}
      {chapter.symbol && (
        <div className="mt-6 text-body-sm text-otaru-ink-muted">
          <span className="font-medium">Symbol:</span> {chapter.symbol.name}
          {chapter.symbol.meaning && ` — ${chapter.symbol.meaning}`}
        </div>
      )}
    </header>
  );
}
