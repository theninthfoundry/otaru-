import Link from 'next/link';
import type { Artifact } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from '@/components/wishlist/wishlist-button';

/**
 * Artifact card for Archive/Chapter grids.
 * Premium hover interactions, secondary image reveal, name, price, chapter badge, wishlist toggle.
 */
interface ArtifactCardProps {
  artifact: Artifact;
  priority?: boolean;
}

export function ArtifactCard({ artifact, priority = false }: ArtifactCardProps) {
  const displayName = artifact.artifactName
    ? `"${artifact.artifactName}"`
    : artifact.title;

  const primaryImage = artifact.featuredImage ?? artifact.images[0];
  const secondaryImage = artifact.images.length > 1 ? artifact.images[1] : null;

  return (
    <article
      id={`artifact-card-${artifact.handle}`}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-otaru-cream rounded-sm border border-otaru-border/40">
        <Link
          href={`/artifact/${artifact.handle}`}
          aria-label={displayName}
          data-cursor="view"
          data-cursor-label="View"
          className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-otaru-ink rounded-sm"
        >
          {primaryImage ? (
            <>
              <img
                src={primaryImage.url}
                alt={primaryImage.altText ?? displayName}
                width={primaryImage.width}
                height={primaryImage.height}
                className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  secondaryImage ? 'group-hover:opacity-0' : ''
                }`}
                loading={priority ? 'eager' : 'lazy'}
              />
              {secondaryImage && (
                <img
                  src={secondaryImage.url}
                  alt={secondaryImage.altText ?? `${displayName} detail`}
                  width={secondaryImage.width}
                  height={secondaryImage.height}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-caption text-otaru-ink-subtle">
                No Image
              </span>
            </div>
          )}
        </Link>

        {/* Sold Out Badge */}
        {!artifact.availableForSale && (
          <div className="absolute top-3 left-3 bg-otaru-ink/90 backdrop-blur-md text-otaru-chalk text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium rounded-xs pointer-events-none">
            Archive Sold
          </div>
        )}

        {/* Wishlist Heart Toggle Button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton artifact={artifact} />
        </div>
      </div>

      {/* Product Details */}
      <Link href={`/artifact/${artifact.handle}`} className="mt-3.5 flex flex-col space-y-1">
        <div className="flex items-center justify-between gap-2">
          {artifact.artifactNumber ? (
            <span className="text-overline tracking-overline uppercase text-otaru-ink-subtle text-[10px]">
              Artifact {artifact.artifactNumber}
            </span>
          ) : (
            <span className="text-overline tracking-overline uppercase text-otaru-ink-subtle text-[10px]">
              Otaru
            </span>
          )}
          <span className="text-body-sm font-medium text-otaru-ink">
            {formatPrice(artifact.price.amount, artifact.price.currencyCode)}
          </span>
        </div>

        <h3 className="text-body-md font-medium text-otaru-ink group-hover:text-otaru-ink-muted transition-colors duration-200 line-clamp-1">
          {displayName}
        </h3>

        {artifact.chapterId && (
          <p className="text-caption text-otaru-ink-muted/80 text-[11px]">
            Chapter {artifact.chapterId}
          </p>
        )}
      </Link>
    </article>
  );
}
