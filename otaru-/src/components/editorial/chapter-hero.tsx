interface ChapterHeroProps {
  title: string;
  chapterNumber: number;
  status: string;
  tagline?: string;
  coverImageUrl?: string;
  symbolName?: string;
  symbolMeaning?: string;
}

export function ChapterHero({
  title,
  chapterNumber,
  status,
  tagline,
  coverImageUrl,
  symbolName,
  symbolMeaning,
}: ChapterHeroProps) {
  const formattedNumber = chapterNumber.toString().padStart(2, '0');

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-otaru-border/40">
      <div className="grid-container max-w-5xl space-y-6">
        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <span className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Chapter {formattedNumber}
          </span>
          <span className="h-3 w-px bg-otaru-border" />
          <span
            className={`text-[10px] tracking-wider uppercase px-2 py-0.5 font-medium rounded-xs ${
              status === 'active'
                ? 'bg-otaru-ink text-otaru-chalk'
                : 'bg-otaru-cream text-otaru-ink-muted'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Title & Symbol */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <h1 className="text-display-xl font-bold tracking-tight text-otaru-ink leading-tight">
            &ldquo;{title}&rdquo;
          </h1>
          {symbolName && (
            <div className="shrink-0 text-right md:text-right">
              <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] block">
                Symbol: {symbolName}
              </span>
              {symbolMeaning && (
                <span className="text-caption text-otaru-ink-muted text-xs block italic">
                  {symbolMeaning}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tagline */}
        {tagline && (
          <p className="text-body-lg text-otaru-ink-muted max-w-2xl font-light leading-relaxed">
            {tagline}
          </p>
        )}
      </div>

      {/* Cinematic Cover Banner */}
      {coverImageUrl && (
        <div className="w-full mt-12 aspect-[16/9] md:aspect-[21/9] bg-otaru-cream overflow-hidden relative">
          <img
            src={coverImageUrl}
            alt={`Chapter ${formattedNumber} — ${title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </section>
  );
}
