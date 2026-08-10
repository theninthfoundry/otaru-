"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export default function OrderConfirmationPage() {
  // Real flow: order number + summary should come from the payment
  // processor's response, not be re-derived from client cart state, which
  // is why this clears the cart rather than displaying line items again.
  const cart = useCartStore((s) => s.cart);

  useEffect(() => {
    // TODO: clear cart via a real cartLinesRemove / new-cart call once
    // payment capture is wired to a processor.
  }, []);

  const orderNumber = `OT-${Date.now().toString().slice(-6)}`;

  return (
    <div className="otaru-container pt-44 pb-24 max-w-lg text-center mx-auto">
      <p className="otaru-eyebrow mb-4">Order Confirmed</p>
      <h1 className="font-display text-display-md mb-4">Thank you.</h1>
      <p className="text-body-md text-foreground-muted mb-2">Order {orderNumber}</p>
      <p className="text-body-sm text-foreground-muted mb-10">
        A confirmation email is on its way. You can track your order any time.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/track-order" className="text-body-sm underline underline-offset-4">Track Order</Link>
        <Link href="/archive" className="text-body-sm underline underline-offset-4">Continue Shopping</Link>
      </div>
    </div>
  );
}
