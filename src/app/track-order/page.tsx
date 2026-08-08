import type { Metadata } from 'next';
import { trackShipment } from '@/lib/shiprocket';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Track Order — Otaru',
  description: 'Track your Otaru shipment status and delivery progress in real time.',
};

interface TrackOrderPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function TrackOrderPage({
  searchParams,
}: TrackOrderPageProps) {
  const { order: orderId } = await searchParams;

  const trackingResult = orderId ? await trackShipment(orderId) : null;

  return (
    <section id="track-order" aria-label="Track Order" className="py-12 md:py-20">
      <div className="grid-container max-w-3xl space-y-12">
        <header className="space-y-3">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Client Logistics
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            Track Order
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light leading-relaxed">
            Enter your order number or AWB tracking code to inspect live shipment status.
          </p>
        </header>

        <form action="/track-order" method="GET" className="flex flex-col sm:flex-row gap-3">
          <input
            id="order-input"
            name="order"
            type="text"
            defaultValue={orderId ?? ''}
            placeholder="Enter Order Number or AWB Code (e.g. 1001)"
            className="flex-1 bg-otaru-cream/50 border border-otaru-border rounded-full px-5 py-3 text-body-sm focus:outline-none focus:border-otaru-ink"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors shrink-0"
          >
            Track Status
          </button>
        </form>

        {orderId && trackingResult && (
          <div className="bg-otaru-chalk border border-otaru-border/60 p-6 md:p-8 rounded-sm space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-otaru-border/40">
              <div>
                <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[10px] block">
                  Shipment Query
                </span>
                <h2 className="text-display-sm font-semibold text-otaru-ink mt-0.5">
                  Order {trackingResult.channelOrderId}
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-caption text-xs text-otaru-ink-muted block">Status</span>
                <span className="text-body-sm font-semibold text-otaru-ink uppercase tracking-wider">
                  {trackingResult.statusText}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-caption text-xs font-medium text-otaru-ink block">
                Delivery Timeline Progress
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold uppercase tracking-wider">
                <div
                  className={`py-2 rounded-xs transition-colors ${
                    getStepState(trackingResult.status, 'PLACED')
                      ? 'bg-otaru-ink text-otaru-chalk'
                      : 'bg-otaru-cream text-otaru-ink-subtle'
                  }`}
                >
                  Placed
                </div>
                <div
                  className={`py-2 rounded-xs transition-colors ${
                    getStepState(trackingResult.status, 'PROCESSING')
                      ? 'bg-otaru-ink text-otaru-chalk'
                      : 'bg-otaru-cream text-otaru-ink-subtle'
                  }`}
                >
                  Processing
                </div>
                <div
                  className={`py-2 rounded-xs transition-colors ${
                    getStepState(trackingResult.status, 'SHIPPED')
                      ? 'bg-otaru-ink text-otaru-chalk'
                      : 'bg-otaru-cream text-otaru-ink-subtle'
                  }`}
                >
                  Shipped
                </div>
                <div
                  className={`py-2 rounded-xs transition-colors ${
                    getStepState(trackingResult.status, 'DELIVERED')
                      ? 'bg-otaru-ink text-otaru-chalk'
                      : 'bg-otaru-cream text-otaru-ink-subtle'
                  }`}
                >
                  Delivered
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-otaru-border/40 text-caption text-xs">
              {trackingResult.courierName && (
                <div>
                  <span className="text-otaru-ink-subtle block">Carrier Partner</span>
                  <span className="font-medium text-otaru-ink">{trackingResult.courierName}</span>
                </div>
              )}
              {trackingResult.awbCode && (
                <div>
                  <span className="text-otaru-ink-subtle block">AWB Tracking Code</span>
                  <span className="font-mono text-otaru-ink">{trackingResult.awbCode}</span>
                </div>
              )}
              {trackingResult.estimatedDelivery && (
                <div>
                  <span className="text-otaru-ink-subtle block">Estimated Delivery</span>
                  <span className="font-medium text-otaru-ink">{trackingResult.estimatedDelivery}</span>
                </div>
              )}
              {trackingResult.location && (
                <div>
                  <span className="text-otaru-ink-subtle block">Last Known Hub</span>
                  <span className="font-medium text-otaru-ink">{trackingResult.location}</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-otaru-border/40 flex flex-wrap items-center justify-between gap-4 text-xs">
              {trackingResult.trackingUrl && (
                <a
                  href={trackingResult.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-medium text-otaru-ink underline hover:text-otaru-ink-muted"
                >
                  View External Carrier Tracking →
                </a>
              )}
              <Link href="/returns" className="text-otaru-ink-muted hover:text-otaru-ink underline">
                Need to request a return?
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function getStepState(
  currentStatus: string,
  targetStep: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
): boolean {
  const steps = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = steps.indexOf(currentStatus);
  const targetIndex = steps.indexOf(targetStep);

  return currentIndex >= targetIndex;
}
