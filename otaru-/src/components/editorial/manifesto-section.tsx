interface ManifestoSectionProps {
  headline?: string;
  quote: string;
  author?: string;
  subtext?: string;
}

export function ManifestoSection({
  headline = 'Manifesto',
  quote,
  author = 'Otaru Design House',
  subtext,
}: ManifestoSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-otaru-chalk border-y border-otaru-border/30">
      <div className="grid-container max-w-4xl text-center space-y-8">
        <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
          {headline}
        </p>

        <blockquote className="text-display-md md:text-display-lg font-serif font-normal text-otaru-ink leading-tight tracking-tight italic max-w-3xl mx-auto">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {subtext && (
          <p className="text-body-md text-otaru-ink-muted max-w-xl mx-auto font-light leading-relaxed">
            {subtext}
          </p>
        )}

        <div className="pt-4">
          <span className="text-caption text-otaru-ink-subtle uppercase tracking-wider text-[10px]">
            {author}
          </span>
        </div>
      </div>
    </section>
  );
}
