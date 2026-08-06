import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { PullQuote } from '@/components/editorial/pull-quote';
import { FullBleedImage } from '@/components/editorial/full-bleed-image';
import { ProductFeature } from '@/components/editorial/product-feature';
import { ImageMasonry } from '@/components/editorial/image-masonry';

/**
 * Custom Portable Text renderer for Otaru Sanity content.
 * Handles standard blocks + Otaru editorial types (pull quotes, full bleed, product embeds, masonry).
 */

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-display-sm font-semibold tracking-tight text-otaru-ink mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-heading-md font-medium tracking-tight text-otaru-ink mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-heading-sm font-medium text-otaru-ink mt-8 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-body-lg text-otaru-ink/90 font-normal mb-6 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <PullQuote quote={typeof children === 'string' ? children : String(children)} />
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 text-body-lg text-otaru-ink space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 text-body-lg text-otaru-ink space-y-2">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-otaru-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="underline underline-offset-4 text-otaru-ink hover:text-otaru-ink-muted transition-colors"
      >
        {children}
      </a>
    ),
    artifactRef: ({ children, value }) => (
      <a
        href={`/artifact/${value?.handle}`}
        className="font-medium underline underline-offset-4 text-otaru-ink hover:text-otaru-ink-muted"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <div className="aspect-[16/9] bg-otaru-cream overflow-hidden rounded-sm">
          {value?.asset?.url && (
            <img
              src={value.asset.url}
              alt={value.alt ?? ''}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        {value?.caption && (
          <figcaption className="mt-2 text-caption text-otaru-ink-subtle text-xs text-center italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    fullBleedImage: ({ value }) => (
      <FullBleedImage url={value?.asset?.url ?? ''} alt={value?.alt} caption={value?.caption} />
    ),
    pullQuote: ({ value }) => (
      <PullQuote quote={value?.quote} author={value?.author} />
    ),
    productFeature: ({ value }) => (
      <ProductFeature
        handle={value?.handle}
        title={value?.title}
        priceAmount={value?.priceAmount}
        imageUrl={value?.imageUrl}
        artifactNumber={value?.artifactNumber}
      />
    ),
    imageMasonry: ({ value }) => (
      <ImageMasonry images={value?.images ?? []} title={value?.title} />
    ),
    materialCallout: ({ value }) => (
      <aside className="my-10 p-6 bg-otaru-chalk-warm border border-otaru-border-subtle rounded-sm">
        <h4 className="text-body-md font-medium text-otaru-ink">{value?.material}</h4>
        {value?.description && (
          <p className="text-body-sm text-otaru-ink-muted mt-2">
            {value.description}
          </p>
        )}
        {value?.specs && value.specs.length > 0 && (
          <ul className="mt-3 space-y-1">
            {value.specs.map((spec: string, i: number) => (
              <li key={i} className="text-caption text-otaru-ink-subtle text-xs">
                {spec}
              </li>
            ))}
          </ul>
        )}
      </aside>
    ),
  },
};

interface PortableTextRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  if (!content || content.length === 0) return null;

  return (
    <div className="portable-text max-w-3xl mx-auto">
      <PortableText value={content} components={components} />
    </div>
  );
}
