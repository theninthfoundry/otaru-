'use client';

import { useState } from 'react';
import { addItem } from '@/actions/cart';
import type { ArtifactVariant } from '@/lib/shopify/types';

interface AddToCartProps {
  variant: ArtifactVariant | null;
  productTitle: string;
  disabled?: boolean;
}

export function AddToCart({ variant, productTitle, disabled }: AddToCartProps) {
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle');

  const isDisabled =
    disabled || !variant || !variant.availableForSale || status === 'adding';

  const buttonText = !variant
    ? 'Select a size'
    : !variant.availableForSale
      ? 'Sold out'
      : status === 'adding'
        ? 'Adding...'
        : status === 'added'
          ? 'Added to Bag'
          : 'Add to Bag';

  async function handleClick() {
    if (isDisabled || !variant) return;

    setStatus('adding');

    try {
      await addItem(variant.id, 1);

      setStatus('added');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('idle');
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      id="add-to-bag-button"
      className={`w-full py-4 text-body-md font-medium transition-none ${
        isDisabled
          ? 'bg-otaru-cream text-otaru-ink-subtle cursor-not-allowed'
          : 'bg-otaru-ink text-otaru-ink-inverted hover:bg-otaru-stone-dark active:bg-otaru-ink'
      }`}
      aria-label={`Add ${productTitle} to bag`}
    >
      {buttonText}
    </button>
  );
}
