"use client";

import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer } = useCart();

  return (
    <Drawer open={isDrawerOpen} onClose={closeDrawer}>
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="font-display text-display-sm">Bag</h2>
          <button onClick={closeDrawer} aria-label="Close bag" className="text-body-lg">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.lines.length === 0 ? (
            <p className="py-12 text-center text-body-sm text-foreground-muted">Your bag is empty.</p>
          ) : (
            cart.lines.map((line) => <CartItem key={line.id} line={line} />)
          )}
        </div>

        {cart.lines.length > 0 && (
          <div className="space-y-4 pt-4">
            <CartSummary cart={cart} />
            <Button className="w-full" onClick={() => window.open(cart.checkoutUrl, "_blank")}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
