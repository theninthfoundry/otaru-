import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllChapters } from '@/lib/sanity/queries';
import { ChapterCard } from '@/components/chapter/chapter-card';

export const metadata: Metadata = {
  title: 'Chapters — Otaru World Building',
  description:
    'Explore the chapters of Otaru. Each chapter represents a dedicated concept, symbol, and limited release of garments.',
};

export default async function ChapterIndexPage() {
  const chapters = await getAllChapters().catch(() => []);

  return (
    <section id="chapters" aria-label="Chapters" className="py-12 md:py-20">
      <div className="grid-container space-y-12">
        {/* Header */}
        <header className="space-y-3 max-w-2xl">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Collections & Concepts
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            Chapters
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light">
            We release garments in numbered Chapters. Each collection carries a distinct philosophy, symbol, and material research.
          </p>
        </header>

        {/* Chapter World Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {chapters.map((chapter) => {
            const formattedNumber = chapter.chapterNumber.toString().padStart(2, '0');
            return (
              <article
                key={chapter._id}
                className="group relative flex flex-col bg-otaru-chalk border border-otaru-border/50 rounded-sm overflow-hidden"
              >
                <Link href={`/chapter/${chapter.slug}`} className="block">
                  {/* Hero Cover */}
                  <div className="aspect-[16/10] bg-otaru-cream overflow-hidden relative">
                    {chapter.coverImage?.asset?.url ? (
                      <img
                        src={chapter.coverImage.asset.url}
                        alt={`Chapter ${formattedNumber} — ${chapter.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-caption text-otaru-ink-subtle">
                        Chapter {formattedNumber}
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-otaru-ink/90 backdrop-blur-md text-otaru-chalk text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold rounded-xs">
                        Chapter {formattedNumber}
                      </span>
                      <span className="bg-otaru-cream/90 backdrop-blur-md text-otaru-ink text-[10px] tracking-wider uppercase px-2 py-1 font-medium rounded-xs">
                        {chapter.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-display-sm font-semibold text-otaru-ink group-hover:text-otaru-ink-muted transition-colors">
                        &ldquo;{chapter.title}&rdquo;
                      </h2>
                      {chapter.symbol && (
                        <span className="text-caption text-otaru-ink-subtle text-xs font-mono">
                          [{chapter.symbol.name}]
                        </span>
                      )}
                    </div>

                    {chapter.tagline && (
                      <p className="text-body-md text-otaru-ink-muted font-light line-clamp-2">
                        {chapter.tagline}
                      </p>
                    )}

                    <div className="pt-4 flex items-center justify-between text-caption text-otaru-ink-subtle text-xs border-t border-otaru-border/30">
                      {chapter.productionYear && (
                        <span>Year: {chapter.productionYear}</span>
                      )}
                      {chapter.totalProduced && (
                        <span>Limited Edition: {chapter.totalProduced} Units</span>
                      )}
                      <span className="group-hover:translate-x-1 transition-transform font-medium text-otaru-ink">
                        Enter World →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
