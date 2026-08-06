import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="otaru-container grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-display-sm mb-4">Otaru</p>
          <p className="max-w-sm text-body-sm text-foreground-muted">Garments worth keeping.</p>
          <NewsletterForm className="mt-8" />
        </div>

        <div>
          <p className="otaru-eyebrow mb-4">Studio</p>
          <ul className="space-y-2 text-body-sm">
            <li><Link href="/journal">Journal</Link></li>
            <li><Link href="/membership">Membership</Link></li>
            <li><Link href="/verify">Verify Authenticity</Link></li>
          </ul>
        </div>

        <div>
          <p className="otaru-eyebrow mb-4">Support</p>
          <ul className="space-y-2 text-body-sm">
            <li><Link href="/track-order">Track Order</Link></li>
            <li><Link href="/returns">Returns</Link></li>
          </ul>
        </div>
      </div>
      <div className="otaru-container border-t border-border py-6 text-caption text-foreground-muted">
        © {new Date().getFullYear()} Otaru. All rights reserved.
      </div>
    </footer>
  );
}
