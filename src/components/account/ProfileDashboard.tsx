'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/context/auth-context';
import { AnimatePresence, motion } from 'framer-motion';

interface AcquiredItem {
  id: string;
  title: string;
  run: string;
  date: string;
  size: string;
  cert: string;
  material: string;
  dyeBatch: string;
  careSummary: string;
}

const ACQUIRED_DATA: AcquiredItem[] = [
  {
    id: '041',
    title: 'Yama Field Jacket',
    run: 'Run 01 / Batch #018',
    date: '18 Aug MMXXVI',
    size: 'Size III (L)',
    cert: 'OT-ARC-041-018',
    material: '14.5oz Kuroki Mills Selvedge Denim, Natural Sukumo Indigo',
    dyeBatch: 'Tokushima Sukumo fermentation vat #4, 18 dips',
    careSummary: 'Cold soak only, pH-neutral detergent. Hang dry away from direct sunlight.',
  },
  {
    id: '043',
    title: 'Biratori Overshirt',
    run: 'Run 01 / Batch #004',
    date: '02 Jul MMXXVI',
    size: 'Size II (M)',
    cert: 'OT-ARC-043-004',
    material: 'Handloomed Khadi Cotton, Natural Iron Mordant Tannin',
    dyeBatch: 'Pondicherry artisan guild vat #12',
    careSummary: 'Gentle hand wash in lukewarm water. Iron with steam on reverse.',
  },
  {
    id: '038',
    title: 'Otaru Deck Coat',
    run: 'Winter Run / Batch #042',
    date: '12 Jan MMXXVI',
    size: 'Size III (L)',
    cert: 'OT-ARC-038-042',
    material: 'Hokkaido Heavy Wool Fleece & Waxed Canvas',
    dyeBatch: 'Biella heritage spun yarn, natural charcoal wash',
    careSummary: 'Spot clean only with cold cloth. Professional brush cleaning seasonally.',
  },
  {
    id: '044',
    title: 'Ōmi Hemp Tote',
    run: 'Permanent Run / Batch #082',
    date: '19 May MMXXVI',
    size: 'One Size',
    cert: 'OT-ARC-044-082',
    material: '18oz Heavy Shiga Hemp Canvas & Hand-Hammered Copper Rivets',
    dyeBatch: 'Unbleached natural ecru hemp seed',
    careSummary: 'Wipe with damp sponge. Copper hardware patinates naturally with exposure.',
  },
];

const SAVED_DATA = [
  { id: '042', title: 'Kiryū Wrap Trouser', price: 420, material: 'Raw Indigo Washed Silk', stock: '4 pieces remaining' },
  { id: '036', title: 'Hakodate Watch Cap', price: 160, material: 'Ribbed Hokkaido Wool', stock: 'Archive Reserve' },
  { id: '034', title: 'Rishiri Rain Shell', price: 680, material: '3-Layer Storm Membrane', stock: 'Sold Out — Waiting List' },
];

const RECENT_ORDERS = [
  {
    id: 'ARC-8821',
    date: '04 Oct MMXXVI',
    status: 'In Transit · Hokkaido → Tokyo',
    courier: 'Yamato Archival Express',
    trackingNumber: 'OTA-7739-8821',
    items: ['Yama Field Jacket (Size III)'],
    total: '$520',
  },
  {
    id: 'ARC-8104',
    date: '12 Jan MMXXVI',
    status: 'Delivered · Signature Verified',
    courier: 'Yamato Archival Express',
    trackingNumber: 'OTA-4102-8104',
    items: ['Otaru Deck Coat (Size III)', 'Hakodate Watch Cap (One Size)'],
    total: '$840',
  },
];

type ProfileTab = 'archive' | 'orders' | 'kept' | 'details';

export function ProfileDashboard() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('archive');
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [acquiredItems, setAcquiredItems] = useState<AcquiredItem[]>(ACQUIRED_DATA);
  const [wishlist, setWishlist] = useState(SAVED_DATA);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Selected item for Repair & Care Modal
  const [repairModalItem, setRepairModalItem] = useState<AcquiredItem | null>(null);
  const [repairSubmitted, setRepairSubmitted] = useState(false);

  // Load persistence
  useEffect(() => {
    try {
      const savedAcquired = localStorage.getItem('otaru_acquired_artifacts');
      if (savedAcquired) setAcquiredItems(JSON.parse(savedAcquired));
      const savedWish = localStorage.getItem('otaru_saved_wishlist');
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch {
      // ignore
    }
  }, []);

  const handleAddWishlistToCart = (item: (typeof SAVED_DATA)[0]) => {
    addToCart({
      id: `${item.id}-saved`,
      name: item.title,
      meta: item.material,
      price: item.price,
      size: 'Size II',
      qty: 1,
    });
    setSavedSuccess(item.id);
    setTimeout(() => setSavedSuccess(null), 2500);
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('otaru_saved_wishlist', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--otaru-canvas)] text-[var(--otaru-ink)] pt-24 pb-20 selection:bg-[var(--otaru-indigo)] selection:text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Collector Header */}
        <header className="border-b border-[var(--otaru-hairline)] pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--otaru-ink-subtle)]">
                  Archival Collector Dossier
                </span>
                <span className="font-serif text-[11px] text-[var(--otaru-ink-subtle)] border border-[var(--otaru-hairline)] px-1.5 py-0.2 rounded-xs">
                  印
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-[var(--otaru-ink)]">
                {isAuthenticated
                  ? user?.name || (user?.email ? user.email.split('@')[0] : 'Kenji Takahashi')
                  : 'Collector Dossier'}
              </h1>
              <p className="font-mono text-xs text-[var(--otaru-ink-muted)]">
                {isAuthenticated ? user?.email || 'Authenticated Member' : 'Guest Collector · Unlinked Session'} · Member since MMXXIV
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/40 rounded-xs text-right">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-[var(--otaru-ink-subtle)]">
                  Patron Tier
                </span>
                <span className="font-mono text-xs font-medium text-[var(--otaru-indigo)]">
                  Archival Circle Sovereign
                </span>
              </div>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-4 py-2 border border-[var(--otaru-hairline)] text-[var(--otaru-ink-muted)] hover:text-[var(--otaru-ink)] text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="px-4 py-2 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase tracking-wider hover:bg-[var(--otaru-ink-light)] transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* 4 Quiet Tabs */}
          <nav className="flex gap-8 mt-10 border-t border-[var(--otaru-hairline)] pt-4" aria-label="Dossier Tabs">
            {[
              { id: 'archive', label: 'Owned Archive', count: acquiredItems.length },
              { id: 'orders', label: 'Dispatches & Orders', count: RECENT_ORDERS.length },
              { id: 'kept', label: 'Kept Pieces', count: wishlist.length },
              { id: 'details', label: 'Preferences & Depot' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={`relative pb-2 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-[var(--otaru-ink)] font-semibold'
                      : 'text-[var(--otaru-ink-subtle)] hover:text-[var(--otaru-ink)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] text-[var(--otaru-ink-subtle)] font-mono">[{tab.count}]</span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeDossierTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--otaru-indigo)]"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </header>

        {/* Tab 1: Owned Archive (Garment Gallery & Care/Repair) */}
        {activeTab === 'archive' && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl tracking-tight">Catalogued Possessions</h2>
                <p className="text-xs text-[var(--otaru-ink-muted)] mt-1">
                  Each artifact bears an indelible serial sealed into the Hokkaido registry. Free annual atelier repair is included for life.
                </p>
              </div>
              <Link
                href="/archive"
                className="font-mono text-xs uppercase tracking-wider text-[var(--otaru-indigo)] hover:underline shrink-0"
              >
                Acquire New Artifact →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acquiredItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm p-5 space-y-4 hover:border-[var(--otaru-ink-subtle)] transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-28 bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs overflow-hidden shrink-0">
                      <ImagePlaceholder ratio="portrait" label="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)]">
                            NO. ARC-{item.id}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-xs">
                            Ledger Verified
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-normal tracking-tight mt-1">{item.title}</h3>
                        <p className="font-mono text-[10px] text-[var(--otaru-ink-muted)] mt-0.5">
                          {item.run} · {item.size}
                        </p>
                      </div>

                      <div className="font-mono text-[9px] text-[var(--otaru-ink-subtle)] truncate">
                        Cert: {item.cert} · {item.date}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--otaru-hairline)] pt-3 text-[11px] space-y-1.5">
                    <div className="text-[var(--otaru-ink-muted)]">
                      <span className="text-[var(--otaru-ink)] font-medium">Textile: </span>
                      {item.material}
                    </div>
                    <div className="text-[var(--otaru-ink-subtle)] font-mono text-[10px]">
                      <span className="text-[var(--otaru-ink)]">Vat Batch: </span>
                      {item.dyeBatch}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[var(--otaru-hairline)]">
                    <button
                      type="button"
                      onClick={() => {
                        setRepairModalItem(item);
                        setRepairSubmitted(false);
                      }}
                      className="font-mono text-xs text-[var(--otaru-indigo)] hover:text-[var(--otaru-ink)] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <span>Repair & Care Protocol</span>
                      <span>→</span>
                    </button>
                    <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)]">
                      Complimentary Atelier Service
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 2: Orders & Dispatches */}
        {activeTab === 'orders' && (
          <section className="space-y-6">
            <div className="flex justify-between items-baseline">
              <h2 className="font-serif text-xl tracking-tight">Transit Telemetry</h2>
              <span className="font-mono text-xs text-[var(--otaru-ink-subtle)]">
                Direct from Canal Warehouse No. 4
              </span>
            </div>

            <div className="space-y-4">
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--otaru-hairline)] pb-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--otaru-ink-subtle)]">
                        Dispatch Ref
                      </span>
                      <p className="font-serif text-lg tracking-tight font-medium text-[var(--otaru-ink)]">
                        NO. {order.id}
                      </p>
                    </div>

                    <div className="sm:text-right font-mono text-xs">
                      <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs inline-block mb-1">
                        ● {order.status}
                      </span>
                      <p className="text-[var(--otaru-ink-subtle)] text-[10px]">Ordered on {order.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block mb-1">
                        Consigned Artifacts
                      </span>
                      <ul className="space-y-1 font-serif text-[13px]">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--otaru-indigo)] inline-block" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block mb-1">
                        Courier Telemetry
                      </span>
                      <p className="font-mono text-xs text-[var(--otaru-ink-muted)]">
                        {order.courier} · AWB {order.trackingNumber}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--otaru-hairline)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--otaru-ink)] font-semibold">Total Settled: {order.total}</span>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/track-order?orderId=${order.trackingNumber}`}
                        className="text-[var(--otaru-indigo)] hover:underline uppercase tracking-wider text-[11px]"
                      >
                        Live Tracking Map →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 3: Kept Pieces (Wishlist) */}
        {activeTab === 'kept' && (
          <section className="space-y-6">
            <div className="flex justify-between items-baseline">
              <div>
                <h2 className="font-serif text-xl tracking-tight">Reserved Desires</h2>
                <p className="text-xs text-[var(--otaru-ink-muted)] mt-1">
                  Garments held in personal consideration. Inventory allocations update in real time.
                </p>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="p-12 text-center border border-[var(--otaru-hairline)] rounded-sm bg-[var(--otaru-chalk-warm)]/20 space-y-3">
                <p className="text-xs text-[var(--otaru-ink-muted)]">No garments currently kept in reservation.</p>
                <Link
                  href="/archive"
                  className="inline-block px-4 py-2 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-xs font-mono uppercase"
                >
                  Explore Current Batch
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[3/4] bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-xs overflow-hidden">
                        <ImagePlaceholder ratio="portrait" label="" />
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[10px] text-[var(--otaru-ink-subtle)]">
                            NO. ARC-{item.id}
                          </span>
                          <span className="font-mono text-xs font-medium">{formatPrice(item.price)}</span>
                        </div>
                        <h3 className="font-serif text-base tracking-tight mt-1">{item.title}</h3>
                        <p className="text-[11px] text-[var(--otaru-ink-muted)]">{item.material}</p>
                        <p className="font-mono text-[10px] text-[var(--otaru-indigo)] mt-1">{item.stock}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--otaru-hairline)] flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddWishlistToCart(item)}
                        className="flex-1 py-2 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] text-[10px] font-mono uppercase tracking-wider hover:bg-[var(--otaru-ink-light)] transition-colors"
                      >
                        {savedSuccess === item.id ? 'Added to Bag ✓' : 'Move to Bag'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveWishlist(item.id)}
                        className="px-2.5 py-2 border border-[var(--otaru-hairline)] text-[var(--otaru-ink-subtle)] hover:text-[var(--otaru-ink)] text-[10px] font-mono transition-colors"
                        title="Remove from kept"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 4: Details & Care Depot */}
        {activeTab === 'details' && (
          <section className="space-y-8 max-w-2xl">
            <div>
              <h2 className="font-serif text-xl tracking-tight">Atelier Consignment Depot</h2>
              <p className="text-xs text-[var(--otaru-ink-muted)] mt-1">
                Primary shipping address and tailoring preferences on file with Otaru Hokkaido.
              </p>
            </div>

            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--otaru-hairline)] pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--otaru-ink)]">
                  Primary Destination
                </span>
                <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                  Default
                </span>
              </div>
              <div className="font-mono text-xs text-[var(--otaru-ink-muted)] leading-relaxed space-y-1">
                <p className="font-medium text-[var(--otaru-ink)]">Kenji Takahashi</p>
                <p>Minami-Aoyama 4-12-8, Apt 502</p>
                <p>Minato-ku, Tokyo 107-0062, Japan</p>
                <p>Tel: +81 (0)3 5412 8820</p>
              </div>
            </div>

            <div className="border border-[var(--otaru-hairline)] bg-[var(--otaru-chalk-warm)]/30 rounded-sm p-6 space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--otaru-ink)] block border-b border-[var(--otaru-hairline)] pb-3">
                Tailoring & Fit Preferences
              </span>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[var(--otaru-ink-muted)]">
                <div>
                  <span className="text-[var(--otaru-ink-subtle)] text-[10px] block uppercase">Standard Outerwear</span>
                  <span className="text-[var(--otaru-ink)] font-medium">Size III (Relaxed Japanese Cut)</span>
                </div>
                <div>
                  <span className="text-[var(--otaru-ink-subtle)] text-[10px] block uppercase">Trouser Waist</span>
                  <span className="text-[var(--otaru-ink)] font-medium">32 in / Size II</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Repair & Care Modal */}
      <AnimatePresence>
        {repairModalItem && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-[var(--otaru-ink)]/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRepairModalItem(null)}
            />

            <motion.div
              className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="pointer-events-auto w-full max-w-lg bg-[var(--otaru-canvas)] border border-[var(--otaru-hairline)] rounded-sm shadow-2xl p-6 md:p-8 space-y-6 text-[var(--otaru-ink)]">
                <div className="flex items-start justify-between border-b border-[var(--otaru-hairline)] pb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--otaru-indigo)]">
                      Atelier Care & Sashiko Repair
                    </span>
                    <h3 className="font-serif text-xl font-normal mt-1">{repairModalItem.title}</h3>
                    <p className="font-mono text-[10px] text-[var(--otaru-ink-subtle)]">
                      Cert: {repairModalItem.cert} · {repairModalItem.dyeBatch}
                    </p>
                  </div>
                  <button
                    onClick={() => setRepairModalItem(null)}
                    className="text-[var(--otaru-ink-subtle)] hover:text-[var(--otaru-ink)] font-mono text-sm"
                  >
                    ✕
                  </button>
                </div>

                {!repairSubmitted ? (
                  <div className="space-y-5 text-xs">
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block">
                        Preservation Guidance
                      </span>
                      <p className="text-[var(--otaru-ink-muted)] leading-relaxed bg-[var(--otaru-chalk-warm)]/40 p-3 rounded-xs border border-[var(--otaru-hairline)]">
                        {repairModalItem.careSummary}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--otaru-ink-subtle)] block">
                        Complimentary Lifetime Services
                      </span>
                      <div className="space-y-2 font-mono text-[11px] text-[var(--otaru-ink-muted)]">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="mt-0.5 accent-[var(--otaru-indigo)]" />
                          <span>Seasonal Sashiko Reinforcement (Cuff & collar reinforcement by master artisans)</span>
                        </label>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 accent-[var(--otaru-indigo)]" />
                          <span>Annual Sukumo Natural Indigo Re-dip (Restore depth to worn edges in autumn)</span>
                        </label>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 accent-[var(--otaru-indigo)]" />
                          <span>Mother-of-Pearl Button Replacement (Matching original provenance batch)</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRepairSubmitted(true)}
                        className="flex-1 py-3 bg-[var(--otaru-ink)] text-[var(--otaru-chalk)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--otaru-ink-light)] transition-colors"
                      >
                        Request Atelier Consignment Label →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-base">
                      ✓
                    </span>
                    <h4 className="font-serif text-lg">Consignment Request Lodged</h4>
                    <p className="text-xs text-[var(--otaru-ink-muted)] max-w-sm mx-auto leading-relaxed">
                      A pre-printed insured Yamato courier box and archival garment envelope have been dispatched to your Tokyo depot.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRepairModalItem(null)}
                      className="mt-4 px-6 py-2 border border-[var(--otaru-hairline)] text-xs font-mono uppercase"
                    >
                      Close Dossier
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
