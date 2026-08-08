'use client';

import type { ArtifactVariant } from '@/lib/shopify/types';

interface ArtifactVariantsProps {
  variants: ArtifactVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export function ArtifactVariants({
  variants,
  selectedVariantId,
  onSelect,
}: ArtifactVariantsProps) {
  const sizeOptions = variants
    .map((v) => ({
      id: v.id,
      label: v.selectedOptions.find((o) => o.name === 'Size')?.value ?? v.title,
      availableForSale: v.availableForSale,
    }));

  if (sizeOptions.length <= 1) return null;

  return (
    <fieldset id="size-selector" aria-label="Select size">
      <legend className="text-body-sm font-medium mb-2">Size</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {sizeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={!option.availableForSale}
            className={`px-4 py-2 text-body-sm border transition-none ${
              selectedVariantId === option.id
                ? 'border-otaru-ink bg-otaru-ink text-otaru-ink-inverted'
                : option.availableForSale
                  ? 'border-otaru-border hover:border-otaru-ink'
                  : 'border-otaru-border-subtle text-otaru-ink-subtle line-through cursor-not-allowed'
            }`}
            role="radio"
            aria-checked={selectedVariantId === option.id}
            aria-label={`Size ${option.label}${!option.availableForSale ? ' — sold out' : ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
