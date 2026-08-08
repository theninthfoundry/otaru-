'use client';

import React from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  title: string;
  variantTitle: string;
  price: string;
  imageUrl: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  total: string;
  trackingNumber?: string;
  items: OrderItem[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: '#OTR-9042',
    date: 'July 28, 2026',
    status: 'Delivered',
    total: '$380.00',
    trackingNumber: 'SHP-8849201',
    items: [
      {
        id: 'item-1',
        title: 'Artifact #001 — Raw Selvage Denim Chore Coat',
        variantTitle: 'Medium / Ink Black',
        price: '$380.00',
        imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'ord-002',
    orderNumber: '#OTR-8104',
    date: 'May 14, 2026',
    status: 'Delivered',
    total: '$620.00',
    trackingNumber: 'SHP-7719402',
    items: [
      {
        id: 'item-2',
        title: 'Artifact #002 — Architectural Double Wool Overcoat',
        variantTitle: 'Large / Stone Gray',
        price: '$620.00',
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
];

export function OrderHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-otaru-border/40 pb-4">
        <h3 className="text-heading-sm font-semibold text-otaru-ink">
          Order Archive ({MOCK_ORDERS.length})
        </h3>
        <span className="text-caption text-otaru-ink-subtle text-xs">
          Synchronized with Shopify Commerce
        </span>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div
            key={order.id}
            className="p-6 bg-otaru-chalk-warm/50 border border-otaru-border/40 rounded-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-otaru-border/20 pb-3">
              <div>
                <span className="text-body-sm font-semibold text-otaru-ink">
                  {order.orderNumber}
                </span>
                <span className="text-caption text-otaru-ink-muted text-xs ml-3">
                  {order.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-mono font-medium rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-950/10 text-emerald-800'
                      : 'bg-amber-950/10 text-amber-800'
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-body-sm font-medium text-otaru-ink">
                  {order.total}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-14 h-18 object-cover rounded-xs bg-otaru-cream shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-otaru-ink truncate">
                      {item.title}
                    </p>
                    <p className="text-caption text-otaru-ink-muted text-xs">
                      {item.variantTitle} &bull; {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.trackingNumber && (
              <div className="pt-2 flex items-center justify-between text-caption text-xs">
                <Link
                  href={`/track-order?awb=${order.trackingNumber}`}
                  className="text-otaru-ink hover:underline font-medium flex items-center gap-1"
                >
                  Track Dispatch ({order.trackingNumber}) &rarr;
                </Link>
                <Link
                  href="/returns"
                  className="text-otaru-ink-subtle hover:text-otaru-ink transition-colors"
                >
                  Request Return
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
