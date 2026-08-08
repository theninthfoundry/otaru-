'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from './wishlist-context';
import { Drawer } from '@/components/ui/drawer';
import { formatPrice } from '@/lib/utils';
import { addItem } from '@/actions/cart';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Saved Registry (${wishlistCount})`}>
      <div className="flex flex-col h-full justify-between space-y-6">
        {wishlistCount > 0 ? (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-otaru-chalk-warm/50 border border-otaru-border/40 rounded-sm"
              >
                <img
                  src={item.featuredImage?.url || item.images[0]?.url}
                  alt={item.title}
                  className="w-16 h-20 object-cover bg-otaru-cream rounded-xs shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-body-sm font-semibold text-otaru-ink truncate">
                    {item.title}
                  </p>
                  <p className="text-caption text-xs font-mono text-otaru-ink">
                    {formatPrice(item.price.amount, item.price.currencyCode)}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={async () => {
                        const variantId = item.variants[0]?.id;
                        if (variantId) {
                          await addItem(variantId, 1);
                          removeFromWishlist(item.id);
                        }
                      }}
                      className="text-caption text-[11px] font-medium text-otaru-ink underline hover:text-otaru-ink-muted"
                    >
                      + Move to Bag
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-caption text-[11px] text-otaru-ink-subtle hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="text-body-md text-otaru-ink font-medium">Your wishlist is empty</p>
            <p className="text-caption text-xs text-otaru-ink-muted">
              Bookmark pieces while exploring the archive.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-otaru-border/40 space-y-3">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="w-full py-3 bg-otaru-ink text-otaru-chalk text-caption text-xs font-medium rounded-full text-center block hover:bg-otaru-ink-muted transition-colors"
          >
            View Full Registry Hub &rarr;
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
