'use client';

import { useState } from 'react';
import type { ArtifactVariant } from '@/lib/shopify/types';
import { ArtifactVariants } from './artifact-variants';
import { AddToCart } from '@/components/cart/add-to-cart';
import { SizeGuideModal } from './size-guide-modal';

interface ProductFormProps {
  variants: ArtifactVariant[];
  productTitle: string;
}

export function ProductForm({ variants, productTitle }: ProductFormProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const defaultVariant = variants.find((v) => v.availableForSale) || variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariant?.id ?? null
  );

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between">
        <span className="text-overline uppercase text-otaru-ink-subtle text-[10px] font-semibold">
          Select Variant
        </span>
        <button
          type="button"
          onClick={() => setIsSizeGuideOpen(true)}
          className="text-caption text-xs text-otaru-ink-muted hover:text-otaru-ink underline transition-colors"
        >
          Size & Fit Guide &rarr;
        </button>
      </div>

      <ArtifactVariants
        variants={variants}
        selectedVariantId={selectedVariantId}
        onSelect={setSelectedVariantId}
      />
      <AddToCart
        variant={selectedVariant}
        productTitle={productTitle}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        artifactName={productTitle}
      />
    </div>
  );
}
