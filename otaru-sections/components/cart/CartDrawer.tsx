"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart/cart-context";
import { CartLineItem } from "@/components/cart/CartLineItem";

function formatCents(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, isLoading, error, updateQuantity, removeLine } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap + Escape-to-close — a drawer is a dialog, treat it like one.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[420px] flex-col bg-[var(--otaru-ink)] outline-none"
          >
            <div className="flex items-center justify-between border-b border-[var(--otaru-line)] px-6 py-5">
              <h2 className="font-display text-xl text-[var(--otaru-parchment)]">Your Cart</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="grid h-8 w-8 place-items-center text-[var(--otaru-parchment-dim)] hover:text-[var(--otaru-parchment)]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {isLoading && (
                <div className="flex h-full items-center justify-center text-sm text-[var(--otaru-parchment-dim)]">
                  Loading your cart…
                </div>
              )}

              {!isLoading && error && (
                <p role="alert" className="mt-6 border border-[var(--otaru-torii)] px-3 py-2 text-sm text-[#e0a08a]">
                  {error}
                </p>
              )}

              {!isLoading && cart && cart.lines.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-[var(--otaru-parchment)]">Your cart is empty.</p>
                  <p className="mt-1 max-w-[28ch] text-sm text-[var(--otaru-parchment-dim)]">
                    Artifacts you add will hold for 30 minutes before releasing back to the archive.
                  </p>
                  <Link
                    href="/archive"
                    onClick={onClose}
                    className="mt-5 inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] hover:border-[var(--otaru-gold)]"
                  >
                    Enter the archive <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}

              {!isLoading && cart && cart.lines.length > 0 && (
                <ul>
                  {cart.lines.map((line) => (
                    <CartLineItem
                      key={line.lineId}
                      line={line}
                      currency={cart.currency}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeLine}
                    />
                  ))}
                </ul>
              )}
            </div>

            {!isLoading && cart && cart.lines.length > 0 && (
              <div className="border-t border-[var(--otaru-line)] px-6 py-5">
                <div className="flex items-center justify-between text-sm text-[var(--otaru-parchment-dim)]">
                  <span>Subtotal</span>
                  <span className="text-[var(--otaru-parchment)]">{formatCents(cart.subtotalCents, cart.currency)}</span>
                </div>
                <p className="mt-1 text-[0.72rem] text-[var(--otaru-horizon)]">Shipping and taxes calculated at checkout.</p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="mt-4 block w-full bg-[var(--otaru-parchment)] py-3.5 text-center text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--otaru-ink)] transition-colors hover:bg-[var(--otaru-gold)]"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
