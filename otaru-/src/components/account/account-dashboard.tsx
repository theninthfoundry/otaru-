'use client';

import React, { useState } from 'react';
import { MembershipBadge } from '@/components/account/membership-badge';
import { OrderHistory } from '@/components/account/order-history';
import { SavedAddresses } from '@/components/account/saved-addresses';
import { useWishlist } from '@/components/wishlist/wishlist-context';
import { ArtifactCard } from '@/components/artifact/artifact-card';

type Tab = 'overview' | 'orders' | 'addresses' | 'wishlist';

export function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div className="space-y-10">
      {/* Account Header */}
      <header className="border-b border-otaru-border/40 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
            Patron Sanctuary
          </span>
          <h1 className="text-display-md font-semibold text-otaru-ink tracking-tight mt-1">
            Private Account Registry
          </h1>
          <p className="text-body-sm text-otaru-ink-muted font-light mt-1">
            Authenticated Session &bull; patron@otaru.in
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Signing out of private registry session.')}
            className="px-5 py-2.5 border border-otaru-border text-otaru-ink text-caption text-xs font-medium rounded-full hover:border-otaru-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav aria-label="Account Tabs" className="border-b border-otaru-border/30">
        <ul className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-px">
          {(['overview', 'orders', 'addresses', 'wishlist'] as Tab[]).map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-caption text-xs uppercase tracking-widest border-b-2 font-medium transition-all -mb-px whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-otaru-ink text-otaru-ink font-semibold'
                    : 'border-transparent text-otaru-ink-muted hover:text-otaru-ink'
                }`}
              >
                {tab === 'wishlist' ? `Registry (${wishlistCount})` : tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dynamic Tab Content panels */}
      <div className="pt-4 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <section aria-label="Membership Status">
              <MembershipBadge tier="Archival" memberId="OTR-MEM-00492" />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-otaru-chalk-warm/40 border border-otaru-border/40 rounded-sm space-y-2">
                <h4 className="text-body-sm font-semibold text-otaru-ink">Recent Purchase</h4>
                <p className="text-body-sm text-otaru-ink-muted font-light">
                  Order #OTR-9042 &bull; Delivered July 28, 2026
                </p>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-caption text-[11px] font-medium text-otaru-ink underline pt-2 block"
                >
                  View Order Details
                </button>
              </div>

              <div className="p-6 bg-otaru-chalk-warm/40 border border-otaru-border/40 rounded-sm space-y-2">
                <h4 className="text-body-sm font-semibold text-otaru-ink">Default Destination</h4>
                <p className="text-body-sm text-otaru-ink-muted font-light">
                  402 Minami-Aoyama 5-Chome, Minato-ku, Tokyo
                </p>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className="text-caption text-[11px] font-medium text-otaru-ink underline pt-2 block"
                >
                  Manage Addresses
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fadeIn">
            <OrderHistory />
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="animate-fadeIn">
            <SavedAddresses />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-otaru-border/40 pb-4">
              <h3 className="text-heading-sm font-semibold text-otaru-ink">
                Registry Wishlist ({wishlistCount})
              </h3>
            </div>

            {wishlistCount > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlist.map((artifact) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-body-md text-otaru-ink-muted">
                Your private registry list is currently empty.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
