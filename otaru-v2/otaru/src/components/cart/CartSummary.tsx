import { formatMoney } from "@/lib/utils";
import type { Cart } from "@/types/shopify";

const FREE_SHIPPING_THRESHOLD = 300;

export function CartSummary({ cart }: { cart: Cart }) {
  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <div>
        <p className="text-caption text-foreground-muted mb-2">
          {remaining > 0 ? `${formatMoney(remaining)} away from free shipping` : "Free shipping unlocked"}
        </p>
        <div className="h-1 w-full rounded-full bg-surface-alt overflow-hidden">
          <div className="h-full bg-otaru-ink transition-all duration-2 ease-out-expo" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-body-md">
        <span>Subtotal</span>
        <span>{formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</span>
      </div>
    </div>
  );
}
