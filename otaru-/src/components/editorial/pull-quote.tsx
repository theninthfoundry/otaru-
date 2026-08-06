interface PullQuoteProps {
  quote: string;
  author?: string;
}

export function PullQuote({ quote, author }: PullQuoteProps) {
  return (
    <figure className="my-12 md:my-16 border-l-2 border-otaru-ink pl-6 md:pl-10 space-y-3">
      <blockquote className="text-heading-lg md:text-display-sm font-serif italic text-otaru-ink leading-snug">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {author && (
        <figcaption className="text-caption text-otaru-ink-subtle uppercase tracking-wider text-[11px] font-medium">
          — {author}
        </figcaption>
      )}
    </figure>
  );
}
