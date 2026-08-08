'use client';

import type { CartLine } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  line: CartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

export function CartItem({ line, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div id={`cart-item-${line.id}`} className="flex gap-4 py-4 border-b border-otaru-border-subtle">
      {line.merchandise.product.featuredImage && (
        <div className="aspect-[3/4] w-20 flex-shrink-0 overflow-hidden bg-otaru-cream">
          <img
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
            width={80}
            height={107}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <a
          href={`/artifact/${line.merchandise.product.handle}`}
          className="text-body-sm font-medium hover:underline"
        >
          {line.merchandise.product.title}
        </a>
        <p className="text-caption text-otaru-ink-muted mt-1">
          {line.merchandise.selectedOptions
            .map((o) => `${o.name}: ${o.value}`)
            .join(' · ')}
        </p>
        <p className="text-body-sm font-medium mt-2">
          {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}
            className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink w-6 h-6 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-body-sm w-6 text-center" aria-label={`Quantity: ${line.quantity}`}>
            {line.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
            className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink w-6 h-6 flex items-center justify-center"
            aria-label="Increase quantity"
          >
            +
          </button>
          <button
            onClick={() => onRemove(line.id)}
            className="text-caption text-otaru-ink-subtle hover:text-otaru-error ml-auto"
            aria-label={`Remove ${line.merchandise.product.title}`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
