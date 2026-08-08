import type { Metadata } from 'next';
import Link from 'next/link';
import { OrderHistory } from '@/components/account/order-history';

export const metadata: Metadata = {
  title: 'Order Archive & Dispatch Status | Otaru',
  description: 'Track and review past garment purchases and Shiprocket dispatch statuses.',
};

export default function OrdersPage() {
  return (
    <div id="account-orders-page" className="py-12 md:py-16">
      <div className="grid-container max-w-5xl space-y-8">
        <nav aria-label="Account Navigation" className="text-caption text-otaru-ink-subtle text-xs">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/account" className="hover:text-otaru-ink transition-colors">Account Registry</Link>
            </li>
            <li>/</li>
            <li aria-current="page" className="text-otaru-ink font-medium">Order Archive</li>
          </ol>
        </nav>

        <header className="space-y-2 border-b border-otaru-border/40 pb-6">
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
            Patron History
          </span>
          <h1 className="text-display-md font-semibold text-otaru-ink tracking-tight">
            Order Archive & Dispatches
          </h1>
          <p className="text-body-md text-otaru-ink-muted font-light">
            View order timelines, real-time courier tracking numbers, and initiate self-service return requests.
          </p>
        </header>

        <section aria-label="Order List">
          <OrderHistory />
        </section>
      </div>
    </div>
  );
}
