'use client';

import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { removeItem, updateItemQuantity } from '@/actions/cart';
import { Spinner } from '@/components/common/spinner';

export default function BagPage() {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <section id="bag" aria-label="Your Bag">
        <div className="grid-container flex items-center justify-center min-h-[50vh]">
          <Spinner />
        </div>
      </section>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <section id="bag" aria-label="Your Bag">
        <div className="grid-container">
          <h1 className="text-heading-lg font-semibold">Bag</h1>
          <p className="text-body-md text-otaru-ink-muted">
            Your bag is empty.
          </p>
          <a
            href="/archive"
            className="text-body-md underline"
          >
            Explore the Archive
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="bag" aria-label="Your Bag">
      <div className="grid-container">
        <h1 className="text-heading-lg font-semibold">Bag</h1>

        <div id="cart-items" role="list" className="mt-6 flex flex-col gap-4 max-w-2xl">
          {cart.lines.map((line) => (
            <CartItem 
              key={line.id} 
              line={line} 
              onRemove={(id) => {
                removeItem(id);
              }} 
              onUpdateQuantity={(id, qty) => {
                updateItemQuantity(id, line.merchandise.id, qty);
              }}
            />
          ))}
        </div>

        <div className="mt-12 max-w-md">
          <CartSummary cart={cart} />
        </div>
      </div>
    </section>
  );
}
