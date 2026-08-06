import type { Metadata } from 'next';
import Link from 'next/link';
import { SavedAddresses } from '@/components/account/saved-addresses';

export const metadata: Metadata = {
  title: 'Dispatch Destinations | Otaru',
  description: 'Manage saved shipping and atelier delivery destinations.',
};

export default function AddressesPage() {
  return (
    <div id="account-addresses-page" className="py-12 md:py-16">
      <div className="grid-container max-w-5xl space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Account Navigation" className="text-caption text-otaru-ink-subtle text-xs">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/account" className="hover:text-otaru-ink transition-colors">Account Registry</Link>
            </li>
            <li>/</li>
            <li aria-current="page" className="text-otaru-ink font-medium">Dispatch Destinations</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="space-y-2 border-b border-otaru-border/40 pb-6">
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
            Patron Sanctuary
          </span>
          <h1 className="text-display-md font-semibold text-otaru-ink tracking-tight">
            Dispatch Destinations
          </h1>
          <p className="text-body-md text-otaru-ink-muted font-light">
            Manage your primary delivery locations for seamless one-click order fulfillment.
          </p>
        </header>

        {/* Saved Addresses Component */}
        <section aria-label="Address List">
          <SavedAddresses />
        </section>
      </div>
    </div>
  );
}
