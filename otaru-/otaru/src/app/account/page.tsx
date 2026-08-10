export const metadata = { title: "Account — Otaru" };

/**
 * ROADMAP STUB (Phase 3 — Client Experience & VIP).
 * Wire up Shopify Customer Account API here:
 *  - OAuth session handling for authenticated users
 *  - Order history timeline (reuse TrackOrderForm's data shape)
 *  - Saved shipping addresses
 *  - Exclusive Chapter drop reservations
 * See section 6 of the architecture report for the full spec.
 */
export default function AccountPage() {
  return (
    <div className="otaru-container pt-36 pb-24">
      <p className="otaru-eyebrow mb-4">Account</p>
      <h1 className="font-display text-display-lg mb-4 max-w-2xl">Coming Soon</h1>
      <p className="max-w-lg text-body-md text-foreground-muted">
        The Customer Account portal — order history, saved addresses, and exclusive Chapter drop
        reservations — is next on the roadmap. In the meantime, use{" "}
        <a href="/track-order" className="underline underline-offset-4">Track Order</a> to check on a purchase.
      </p>
    </div>
  );
}
