/** Placed adjacent to the payment form, not buried in the footer (Baymard: reduces anxiety at the point of card entry). */
export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-caption text-foreground-muted border-t border-border pt-4">
      <span>🔒 Secure checkout, SSL encrypted</span>
      <span>·</span>
      <span>30-day free returns</span>
      <span>·</span>
      <span>Verified by Visa / Mastercard SecureCode</span>
    </div>
  );
}
