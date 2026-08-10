"use client";

/**
 * Express one-tap payment row (ASOS/Baymard pattern — foreground the
 * fastest path above the form). These are UI affordances only: wiring
 * Apple Pay / Google Pay / Shop Pay / PayPal to real payment capture
 * requires Shopify Checkout Extensibility or a processor SDK (Stripe
 * Payment Request API, PayPal SDK, etc.) — see README for the real
 * integration point. Buttons call onSelect so the parent can branch once
 * wired.
 */
export function ExpressPayButtons({ onSelect }: { onSelect: (method: string) => void }) {
  const methods = [
    { id: "shop-pay", label: "Shop Pay", className: "bg-[#5A31F4] text-white" },
    { id: "apple-pay", label: "Apple Pay", className: "bg-otaru-ink text-otaru-chalk" },
    { id: "google-pay", label: "Google Pay", className: "bg-otaru-chalk text-otaru-ink border border-otaru-ink" },
    { id: "paypal", label: "PayPal", className: "bg-[#FFC439] text-otaru-ink" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`h-12 rounded-sm text-body-sm font-medium transition-opacity duration-1 hover:opacity-90 ${m.className}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-caption text-foreground-muted">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
