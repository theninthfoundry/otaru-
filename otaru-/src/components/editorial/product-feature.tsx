import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface ProductFeatureProps {
  handle: string;
  title: string;
  priceAmount: string;
  currencyCode?: string;
  imageUrl?: string;
  artifactNumber?: string;
}

export function ProductFeature({
  handle,
  title,
  priceAmount,
  currencyCode = 'INR',
  imageUrl,
  artifactNumber,
}: ProductFeatureProps) {
  return (
    <aside className="my-10 p-4 md:p-6 bg-otaru-chalk-warm border border-otaru-border/60 rounded-sm flex items-center justify-between gap-6 max-w-xl mx-auto group">
      <div className="flex items-center gap-4">
        {imageUrl && (
          <div className="w-16 h-20 bg-otaru-cream overflow-hidden shrink-0 rounded-xs">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="space-y-1">
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[9px] block">
            {artifactNumber ? `Featured Artifact ${artifactNumber}` : 'Featured Artifact'}
          </span>
          <h4 className="text-body-md font-medium text-otaru-ink line-clamp-1">
            {title}
          </h4>
          <p className="text-caption text-otaru-ink-muted text-xs">
            {formatPrice(priceAmount, currencyCode)}
          </p>
        </div>
      </div>

      <Link
        href={`/artifact/${handle}`}
        className="px-4 py-2 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full hover:bg-otaru-ink-muted transition-colors shrink-0"
      >
        View Artifact
      </Link>
    </aside>
  );
}
