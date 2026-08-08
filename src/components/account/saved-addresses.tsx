'use client';

import React from 'react';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Primary Atelier Residence',
    street: '402 Minami-Aoyama 5-Chome, Minato-ku',
    city: 'Tokyo',
    state: 'Tokyo-to',
    postalCode: '107-0062',
    country: 'Japan',
    isDefault: true,
  },
];

export function SavedAddresses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-otaru-border/40 pb-4">
        <h3 className="text-heading-sm font-semibold text-otaru-ink">
          Dispatch Destinations ({MOCK_ADDRESSES.length})
        </h3>
        <button
          onClick={() => alert('Address modal opening')}
          className="text-caption text-otaru-ink text-xs font-medium underline"
        >
          + Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ADDRESSES.map((addr) => (
          <div
            key={addr.id}
            className="p-5 bg-otaru-chalk-warm/40 border border-otaru-border/40 rounded-sm space-y-2 relative"
          >
            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-otaru-ink text-otaru-chalk rounded-full">
                Primary
              </span>
            )}
            <p className="text-body-sm font-semibold text-otaru-ink">{addr.name}</p>
            <p className="text-body-sm text-otaru-ink-muted font-light leading-snug">
              {addr.street}<br />
              {addr.city}, {addr.state} {addr.postalCode}<br />
              {addr.country}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
