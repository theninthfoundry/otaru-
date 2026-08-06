import type { Cart } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/utils';

/**
 * Cart summary — subtotal, shipping note, checkout link.
 */
interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div id="cart-summary-section" className="border-t border-otaru-border pt-6">
      <div className="flex justify-between items-baseline">
        <span className="text-body-md">Subtotal</span>
        <span className="text-heading-sm font-semibold">
          {formatPrice(
            cart.cost.subtotalAmount.amount,
            cart.cost.subtotalAmount.currencyCode,
          )}
        </span>
      </div>
      <p className="text-caption text-otaru-ink-muted mt-2">
        Shipping and taxes calculated at checkout.
      </p>
      <a
        href={cart.checkoutUrl}
        id="checkout-link"
        className="mt-4 block w-full py-4 text-center text-body-md font-medium bg-otaru-ink text-otaru-ink-inverted hover:bg-otaru-stone-dark"
      >
        Checkout
      </a>
    </div>
  );
}
