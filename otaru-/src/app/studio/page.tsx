import type { Metadata } from 'next';
import { getStudioContent, getSymbols } from '@/lib/sanity/queries';
import { PortableTextRenderer } from '@/components/journal/portable-text-renderer';
import { ManifestoSection } from '@/components/editorial/manifesto-section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Studio & Atelier Philosophy | Otaru',
  description: 'The architectural principles, textile craftsmanship, and symbol language behind Otaru.',
};

const DEFAULT_PRINCIPLES = [
  {
    name: '01 — Permanent Intention',
    description: 'We reject disposable seasonal calendars. Garments are engineered to withstand decades of wear.',
  },
  {
    name: '02 — Architectural Geometry',
    description: 'Precision drop-shoulder cuts, concealed seams, and ergonomic utility pocketing.',
  },
  {
    name: '03 — Raw Textile Supremacy',
    description: 'Sourced exclusively from Kuroki Mills denim, Biella virgin wool, and 420GSM French terry.',
  },
  {
    name: '04 — Numbered Chapter Archive',
    description: 'Every release is a numbered Chapter published in strictly limited edition runs.',
  },
];

export default async function StudioPage() {
  const [content, symbols] = await Promise.all([
    getStudioContent().catch(() => null),
    getSymbols().catch(() => []),
  ]);

  const principles = content?.designPrinciples && content.designPrinciples.length > 0
    ? content.designPrinciples
    : DEFAULT_PRINCIPLES;

  return (
    <article id="studio-page" className="py-12 md:py-20 space-y-20">
      {/* 1. Studio Editorial Hero */}
      <section id="studio-hero" aria-label="Studio Hero" className="grid-container max-w-4xl text-center space-y-6">
        <span className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
          Otaru Design Atelier &bull; Established MMXXIV
        </span>
        <h1 className="text-display-xl font-bold tracking-tight text-otaru-ink leading-[0.98]">
          {content?.headline ?? 'Craftsmanship outlasts trends.'}
        </h1>
        <p className="text-body-lg text-otaru-ink-muted font-light max-w-2xl mx-auto leading-relaxed">
          Otaru is a luxury garment design house operating at the intersection of architectural structure, raw textile science, and archival permanence.
        </p>
      </section>

      {/* 2. Brand Philosophy Quote */}
      <ManifestoSection
        headline="Atelier Philosophy"
        quote="Garments worth keeping."
        subtext="Every piece is designed, patterned, and finished to age with dignity, acquiring character through years of physical wear."
        author="Otaru Design Principles"
      />

      {/* 3. Narrative Introduction */}
      {content?.introduction && (
        <section id="studio-intro" aria-label="Studio Introduction" className="grid-container max-w-3xl">
          <div className="space-y-6">
            <h2 className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold text-center">
              The Atelier Story
            </h2>
            <PortableTextRenderer content={content.introduction} />
          </div>
        </section>
      )}

      {/* 4. Design Principles Grid */}
      <section id="design-principles" aria-label="Design Principles" className="grid-container max-w-5xl space-y-10">
        <div className="text-center space-y-2">
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
            Core Commandments
          </span>
          <h2 className="text-display-sm font-semibold text-otaru-ink">
            Design Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="p-8 bg-otaru-chalk-warm/50 border border-otaru-border/40 rounded-sm space-y-3"
            >
              <h3 className="text-heading-sm font-semibold text-otaru-ink">
                {principle.name}
              </h3>
              <p className="text-body-sm text-otaru-ink-muted font-light leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Symbol Language Grid */}
      <section id="symbol-language" aria-label="Symbol Language" className="grid-container max-w-5xl space-y-10 pt-12 border-t border-otaru-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
              Archival Glyphs
            </span>
            <h2 className="text-display-sm font-semibold text-otaru-ink mt-1">
              Symbol Language
            </h2>
          </div>
          <Link
            href="/archive"
            className="text-caption text-otaru-ink-muted hover:text-otaru-ink underline text-xs"
          >
            Inspect Artifacts &rarr;
          </Link>
        </div>

        {symbols.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {symbols.map((symbol) => (
              <div
                key={symbol._id}
                className="p-6 bg-otaru-chalk border border-otaru-border/40 rounded-sm space-y-4 text-center"
              >
                <div
                  className="w-12 h-12 mx-auto flex items-center justify-center text-otaru-ink"
                  dangerouslySetInnerHTML={{ __html: symbol.svgMarkup || '&#9671;' }}
                />
                <div>
                  <h4 className="text-body-sm font-semibold text-otaru-ink">{symbol.name}</h4>
                  <p className="text-caption text-xs text-otaru-ink-muted font-light mt-1">
                    {symbol.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-otaru-chalk-warm/40 border border-otaru-border/40 rounded-sm space-y-2">
              <span className="text-heading-md font-mono text-otaru-ink block">&#9632;</span>
              <h4 className="text-body-sm font-semibold text-otaru-ink">Monolith</h4>
              <p className="text-caption text-xs text-otaru-ink-muted">Symbol of permanence and physical structure.</p>
            </div>
            <div className="p-6 bg-otaru-chalk-warm/40 border border-otaru-border/40 rounded-sm space-y-2">
              <span className="text-heading-md font-mono text-otaru-ink block">&#9671;</span>
              <h4 className="text-body-sm font-semibold text-otaru-ink">Kuroki Weave</h4>
              <p className="text-caption text-xs text-otaru-ink-muted">Symbol of selvage density and raw warp integrity.</p>
            </div>
            <div className="p-6 bg-otaru-chalk-warm/40 border border-otaru-border/40 rounded-sm space-y-2">
              <span className="text-heading-md font-mono text-otaru-ink block">&#8734;</span>
              <h4 className="text-body-sm font-semibold text-otaru-ink">Archival Cycle</h4>
              <p className="text-caption text-xs text-otaru-ink-muted">Garments passed down across generations.</p>
            </div>
          </div>
        )}
      </section>

      {/* 6. Chapter Exploration CTA */}
      <section className="grid-container max-w-2xl text-center space-y-6 pt-12">
        <h3 className="text-display-xs font-semibold text-otaru-ink">
          Explore the Published Chapters
        </h3>
        <p className="text-body-md text-otaru-ink-muted font-light">
          Immerse yourself in our published lookbooks, curator essays, and limited artifact releases.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/chapter"
            className="px-8 py-3.5 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors"
          >
            View Chapters
          </Link>
          <Link
            href="/archive"
            className="px-8 py-3.5 bg-transparent border border-otaru-border text-otaru-ink text-body-sm font-medium rounded-full hover:border-otaru-ink transition-colors"
          >
            Explore Archive
          </Link>
        </div>
      </section>
    </article>
  );
}
