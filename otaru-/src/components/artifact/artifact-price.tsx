import { formatPrice } from '@/lib/utils';
import type { Money } from '@/lib/shopify/types';

/**
 * Price display with INR formatting.
 */
interface ArtifactPriceProps {
  price: Money;
  compareAtPrice?: Money | null;
}

export function ArtifactPrice({ price, compareAtPrice }: ArtifactPriceProps) {
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <div id="artifact-price-display" className="flex items-baseline gap-2">
      <span className="text-heading-md font-semibold">
        {formatPrice(price.amount, price.currencyCode)}
      </span>
      {hasDiscount && (
        <span className="text-body-sm text-otaru-ink-subtle line-through">
          {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
        </span>
      )}
    </div>
  );
}
