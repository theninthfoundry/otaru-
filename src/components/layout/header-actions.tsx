'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dock from '@/components/ui/Dock';
import {
  HomeIcon,
  ArchiveIcon,
  SearchIcon,
  HeartIcon,
  UserIcon,
  ShoppingBagIcon,
  MenuIcon,
} from '@/components/ui/icons';
import { PredictiveSearchModal } from '@/components/search/predictive-search-modal';
import { MobileNav } from './mobile-nav';
import { WishlistDrawer } from '@/components/wishlist/wishlist-drawer';
import { useWishlist } from '@/components/wishlist/wishlist-context';

export function HeaderActions() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
  const { wishlistCount } = useWishlist();

  const dockItems = [
    { icon: <HomeIcon size={18} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <ArchiveIcon size={18} />, label: 'Archive', onClick: () => router.push('/archive') },
    { icon: <SearchIcon size={18} />, label: 'Search (Cmd+K)', onClick: () => setIsSearchOpen(true) },
    {
      icon: (
        <div className="relative">
          <HeartIcon size={18} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-otaru-ink text-otaru-chalk text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>
      ),
      label: 'Wishlist',
      onClick: () => setIsWishlistOpen(true),
    },
    { icon: <UserIcon size={18} />, label: 'Account', onClick: () => router.push('/account') },
    { icon: <ShoppingBagIcon size={18} />, label: 'Bag', onClick: () => router.push('/bag') },
  ];

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative inline-block text-left">
          <select
            value={currency}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setCurrency(e.target.value as any)}
            className="bg-transparent text-caption text-[11px] font-mono uppercase tracking-wider text-otaru-ink-muted hover:text-otaru-ink cursor-pointer focus:outline-none py-1 pr-1"
            aria-label="Select Currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        <div className="hidden md:block">
          <Dock
            items={dockItems}
            panelHeight={46}
            baseItemSize={34}
            magnification={48}
            distance={90}
          />
        </div>
        
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-body-sm p-1"
            aria-label="Open Search"
          >
            <SearchIcon size={20} />
          </button>
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="text-body-sm p-1"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>

      <PredictiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
}
