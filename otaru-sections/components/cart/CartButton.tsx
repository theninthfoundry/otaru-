"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function CartButton() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        className="relative grid h-9 w-9 place-items-center rounded-full text-[var(--otaru-parchment-dim)] transition-colors hover:bg-white/5 hover:text-[var(--otaru-parchment)]"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 7h15l-1.5 9h-13z" />
          <path d="M6 7 5 3H2" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--otaru-gold)] px-1 text-[0.6rem] font-semibold text-[var(--otaru-ink)]">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
