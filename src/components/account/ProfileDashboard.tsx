'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import clsx from 'clsx';

const TABS = [
  { id: 'Overview', label: 'Overview', kanji: '概' },
  { id: 'Acquired Artifacts', label: 'Acquired Artifacts', count: 7, kanji: '獲' },
  { id: 'Saved', label: 'Saved Wishlist', count: 3, kanji: '保' },
  { id: 'Addresses', label: 'Dispatch Addresses', kanji: '所' },
  { id: 'Membership', label: 'Membership Tier', kanji: '員' },
];

const ACQUIRED_DATA = [
  { id: '041', title: 'Yama Field Jacket', run: 'Run 01 / Batch #018', date: '18 Aug MMXXVI', size: 'Size III (L)', status: 'Verified in Ledger', cert: 'OT-ARC-041-018' },
  { id: '043', title: 'Biratori Overshirt', run: 'Run 01 / Batch #004', date: '02 Jul MMXXVI', size: 'Size II (M)', status: 'Verified in Ledger', cert: 'OT-ARC-043-004' },
  { id: '038', title: 'Otaru Deck Coat', run: 'Winter Run / Batch #042', date: '12 Jan MMXXVI', size: 'Size III (L)', status: 'Verified in Ledger', cert: 'OT-ARC-038-042' },
  { id: '037', title: 'Tsukiji Apron Shirt', run: 'Spring Run / Batch #011', date: '28 Mar MMXXV', size: 'Size II (M)', status: 'Verified in Ledger', cert: 'OT-ARC-037-011' },
  { id: '035', title: 'Nemuro Wide Trouser', run: 'Autumn Run / Batch #029', date: '15 Oct MMXXV', size: 'Size II (32)', status: 'Verified in Ledger', cert: 'OT-ARC-035-029' },
  { id: '033', title: 'Wakkanai Muffler', run: 'Solstice Run / Batch #055', date: '04 Dec MMXXV', size: 'One Size', status: 'Verified in Ledger', cert: 'OT-ARC-033-055' },
  { id: '044', title: 'Ōmi Hemp Tote', run: 'Permanent Run / Batch #082', date: '19 May MMXXVI', size: 'One Size', status: 'Verified in Ledger', cert: 'OT-ARC-044-082' },
];

const SAVED_DATA = [
  { id: '042', title: 'Kiryū Wrap Trouser', price: 420, material: 'Raw Indigo Washed Silk', stock: '4 pieces remaining' },
  { id: '036', title: 'Hakodate Watch Cap', price: 160, material: 'Ribbed Hokkaido Wool', stock: 'Archive Reserve' },
  { id: '034', title: 'Rishiri Rain Shell', price: 680, material: '3-Layer Storm Membrane', stock: 'Sold Out — Join Waiting List' },
];

const ADDRESSES_DATA = [
  {
    id: 'addr-1',
    label: 'Primary Dispatch Destination',
    isDefault: true,
    recipient: 'Kenji Takahashi (高橋 健二)',
    line1: 'Minami-Aoyama 4-12-8, Apt 502',
    city: 'Minato-ku, Tokyo',
    postal: '107-0062',
    country: 'Japan',
    phone: '+81 (0)3 5412 8820',
  },
  {
    id: 'addr-2',
    label: 'Hokkaido Studio Care Depot',
    isDefault: false,
    recipient: 'Kenji Takahashi c/o Otaru Atelier',
    line1: 'Canal Warehouse No. 4, Ironai 1-chome',
    city: 'Otaru, Hokkaido',
    postal: '047-0031',
    country: 'Japan',
    phone: '+81 (0)134 22 1907',
  },
];

export function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(SAVED_DATA);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const handleAddWishlistToCart = (item: typeof SAVED_DATA[0]) => {
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
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Mount Fuji Japanese Artwork */}
      <ArtBackgroundPlate
        artName="mount-fuji"
        position="top-right"
        opacity={0.24}
        maxWidth="860px"
        maxHeight="620px"
      />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermark */}
      <VerticalKanjiStamp text="富士春景" subtext="MOUNT FUJI · SPRING VISTA MMXXVI" top="10%" right="2.5%" opacity={0.055} />

      <div className="wrap profile-view" style={{ padding: '9rem 0 6rem', position: 'relative', zIndex: 1 }}>
        <div
          className="profile-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(240px, 24vw, 290px) 1fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'start',
          }}
        >
          {/* Left: Collector Dossier Navigation Aside */}
          <aside
            className="profile-side"
            style={{
              borderRight: '1px dashed rgba(217, 189, 131, 0.35)',
              paddingRight: '2rem',
            }}
          >
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--otaru-gold-dim)', padding: '2px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--otaru-dusk-2)', display: 'grid', placeItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--otaru-gold)' }}>
                  樽
                </span>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginTop: '1.2rem', color: 'var(--otaru-parchment)' }}>
              Member since MMXXV
            </h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--otaru-parchment-dim)', marginTop: '0.2rem' }}>
              7 artifacts acquired · Otaru Ledger #8821
            </p>

            <button
              type="button"
              onClick={() => setActiveTab('Membership')}
              style={{
                display: 'inline-block',
                marginTop: '0.9rem',
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--otaru-gold)',
                border: '1px dashed var(--otaru-gold)',
                padding: '0.3rem 0.75rem',
                borderRadius: '2px',
                backgroundColor: 'rgba(217, 189, 131, 0.08)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Archival Circle Tier →
            </button>

            <ul
              className="profile-tabs"
              role="tablist"
              aria-label="Profile sections"
              style={{
                listStyle: 'none',
                margin: '2.4rem 0 0',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      className={clsx(isActive && 'is-active')}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      aria-selected={isActive}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.82rem',
                        letterSpacing: '0.04em',
                        color: isActive ? 'var(--otaru-parchment)' : 'var(--otaru-parchment-dim)',
                        backgroundColor: isActive ? 'var(--otaru-dusk-2)' : 'transparent',
                        border: isActive ? '1px solid var(--otaru-line-strong)' : '1px solid transparent',
                        borderRadius: '2px',
                        transition: 'all var(--duration-fast)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--otaru-gold-dim)', opacity: 0.7 }}>
                          {tab.kanji}
                        </span>
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                          [{tab.count}]
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--otaru-line)' }}>
              <Link
                href="/archive"
                className="cta-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.74rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-parchment-dim)',
                  textDecoration: 'none',
                }}
              >
                Browse Archive Catalog <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>

          {/* Right: Tab-Specific Content Panel */}
          <div style={{ position: 'relative' }}>
            {/* Header with Title & Hash */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px dashed rgba(217, 189, 131, 0.35)', paddingBottom: '1.2rem' }}>
              <div>
                <span className="eyebrow" style={{ margin: 0 }}>Collector dossier</span>
                <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', margin: '0.2rem 0 0' }}>
                  {activeTab}
                </h1>
              </div>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                [ LEDGER HASH · #OT-MMXXVI-8821 ]
              </span>
            </div>

            {/* Interactive Stat Cards Bar */}
            <div
              className="stat-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '1.2rem',
                marginTop: '2rem',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('Acquired Artifacts')}
                className="stat-card sashiko-stitch-box"
                style={{
                  padding: '1.4rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'Acquired Artifacts' ? 'rgba(23,41,62,0.6)' : 'rgba(14, 23, 36, 0.4)',
                  borderColor: activeTab === 'Acquired Artifacts' ? 'var(--otaru-gold)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: 0, color: 'var(--otaru-parchment)' }}>7</p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--otaru-gold)' }}>VIEW →</span>
                </div>
                <p style={{ marginTop: '0.3rem', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                  Artifacts acquired
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('Saved')}
                className="stat-card sashiko-stitch-box"
                style={{
                  padding: '1.4rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'Saved' ? 'rgba(23,41,62,0.6)' : 'rgba(14, 23, 36, 0.4)',
                  borderColor: activeTab === 'Saved' ? 'var(--otaru-gold)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: 0, color: 'var(--otaru-parchment)' }}>{wishlist.length}</p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--otaru-gold)' }}>VIEW →</span>
                </div>
                <p style={{ marginTop: '0.3rem', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                  Saved to wishlist
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('Membership')}
                className="stat-card sashiko-stitch-box"
                style={{
                  padding: '1.4rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'Membership' ? 'rgba(23,41,62,0.6)' : 'rgba(14, 23, 36, 0.4)',
                  borderColor: activeTab === 'Membership' ? 'var(--otaru-gold)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: 0, color: 'var(--otaru-parchment)' }}>Archival</p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--otaru-gold)' }}>TIER →</span>
                </div>
                <p style={{ marginTop: '0.3rem', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                  Membership tier
                </p>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3
                      style={{
                        fontSize: '0.82rem',
                        letterSpacing: '0.14em',
                        color: 'var(--otaru-gold-dim)',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        margin: 0,
                      }}
                    >
                      RECENT LEDGER ACQUISITIONS
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('Acquired Artifacts')}
                      style={{ background: 'none', border: 'none', color: 'var(--otaru-gold)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      All 7 Artifacts →
                    </button>
                  </div>

                  <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {ACQUIRED_DATA.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        className="group"
                        style={{
                          display: 'flex',
                          gap: '1.2rem',
                          alignItems: 'center',
                          padding: '1rem',
                          border: '1px solid var(--otaru-line)',
                          borderRadius: '2px',
                          textDecoration: 'none',
                          backgroundColor: 'rgba(14, 23, 36, 0.4)',
                          transition: 'border-color var(--duration-fast), transform var(--duration-fast)',
                        }}
                      >
                        <div style={{ width: '56px', height: '70px', flexShrink: 0 }}>
                          <ImagePlaceholder ratio="portrait" label={item.id} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                              NO. {item.id}
                            </span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--otaru-parchment-dim)' }}>
                              {item.date}
                            </span>
                          </div>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.96rem', color: 'var(--otaru-parchment)', fontFamily: 'var(--font-display)' }}>
                            {item.title}
                          </p>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.74rem', color: 'var(--otaru-horizon)' }}>
                            {item.run} · {item.size}
                          </p>
                        </div>
                        <span style={{ color: 'var(--otaru-gold)', fontSize: '0.85rem' }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right Side: Mount Fuji Certificate Mount */}
                <div className="watoji-frame" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '240px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      border: '1px dashed rgba(217, 189, 131, 0.4)',
                      backgroundColor: 'var(--otaru-ink)',
                    }}
                  >
                    <img
                      src="/api/art/mount-fuji"
                      alt="Mount Fuji & Sakura Spring Vista"
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'contrast(1.08) saturate(0.95)',
                      }}
                    />
                    <div className="thread-tag">
                      FUJI SPRING · SAKURA MMXXVI
                    </div>
                    <div className="hanko-stamp" title="Mount Fuji Seal">
                      富士
                    </div>
                  </div>

                  <div style={{ marginTop: '0.9rem', padding: '0 0.4rem 0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        ARCHIVAL PROVENANCE SEAL
                      </span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--otaru-parchment-dim)' }}>
                        富士山 · 春景
                      </span>
                    </div>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
                      Collector access certified by Otaru Atelier. Each garment acquisition is linked to your perpetual provenance ledger.
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem' }}>
                      <Link
                        href="/membership"
                        style={{
                          fontSize: '0.68rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--otaru-gold)',
                          border: '1px solid var(--otaru-gold-dim)',
                          padding: '0.4rem 0.8rem',
                          textDecoration: 'none',
                          borderRadius: '2px',
                        }}
                      >
                        Archival Circle Benefits →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACQUIRED ARTIFACTS (FULL PROVENANCE LEDGER) */}
            {activeTab === 'Acquired Artifacts' && (
              <div style={{ marginTop: '2.5rem' }}>
                <p style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', maxWidth: '62ch', lineHeight: 1.7 }}>
                  Every physical artifact released by Otaru carries an immutable digital edition record and perpetual lifetime repair warranty at our Hokkaido canal dyehouse.
                </p>

                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {ACQUIRED_DATA.map((item) => (
                    <div
                      key={item.id}
                      className="sashiko-stitch-box"
                      style={{
                        padding: '1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ width: '100%', height: '180px', borderRadius: '2px', overflow: 'hidden', marginBottom: '1rem' }}>
                          <ImagePlaceholder ratio="portrait" label={item.id} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.64rem', letterSpacing: '0.14em', color: 'var(--otaru-gold)', fontFamily: 'monospace' }}>
                            OBJECT NO. {item.id}
                          </span>
                          <span style={{ fontSize: '0.62rem', color: 'var(--otaru-parchment-dim)' }}>
                            {item.date}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '0.3rem 0 0', color: 'var(--otaru-parchment)' }}>
                          {item.title}
                        </h3>
                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--otaru-horizon)' }}>
                          {item.run} · {item.size}
                        </p>
                        <div style={{ marginTop: '0.8rem', padding: '0.4rem 0.6rem', backgroundColor: 'rgba(11,20,32,0.6)', border: '1px solid var(--otaru-line)', borderRadius: '2px', fontSize: '0.62rem', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                          CERT: {item.cert}
                        </div>
                      </div>

                      <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px dashed var(--otaru-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link
                          href={`/product/${item.id}`}
                          style={{
                            fontSize: '0.74rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--otaru-parchment)',
                            textDecoration: 'none',
                          }}
                        >
                          View Object Record →
                        </Link>
                        <span style={{ fontSize: '0.65rem', color: 'var(--otaru-gold-dim)' }}>
                          ● Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SAVED (WISHLIST) */}
            {activeTab === 'Saved' && (
              <div style={{ marginTop: '2.5rem' }}>
                <p style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', maxWidth: '62ch', lineHeight: 1.7 }}>
                  Artifacts flagged for release monitoring. When archival runs become available for allocation, priority notices are sent directly to your account.
                </p>

                {wishlist.length === 0 ? (
                  <div style={{ marginTop: '3rem', padding: '3rem', textAlign: 'center', border: '1px dashed var(--otaru-line)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--otaru-parchment)' }}>
                      Your wishlist is empty.
                    </p>
                    <Link href="/archive" className="cta-link" style={{ marginTop: '1rem', display: 'inline-block' }}>
                      Browse Archive Catalog →
                    </Link>
                  </div>
                ) : (
                  <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="sashiko-stitch-box"
                        style={{
                          padding: '1.4rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                          <div style={{ width: '70px', height: '90px', flexShrink: 0 }}>
                            <ImagePlaceholder ratio="portrait" label={item.id} />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.64rem', letterSpacing: '0.14em', color: 'var(--otaru-gold)', fontFamily: 'monospace' }}>
                              OBJECT NO. {item.id}
                            </span>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: '0.2rem 0 0', color: 'var(--otaru-parchment)' }}>
                              {item.title}
                            </h3>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)' }}>
                              {item.material} · <span style={{ color: 'var(--otaru-gold-dim)' }}>{item.stock}</span>
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--otaru-parchment)' }}>
                            {formatPrice(item.price)}
                          </span>

                          <Link
                            href={`/product/${item.id}`}
                            style={{
                              fontSize: '0.74rem',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--otaru-parchment)',
                              border: '1px solid var(--otaru-line-strong)',
                              padding: '0.55rem 1rem',
                              textDecoration: 'none',
                              borderRadius: '2px',
                            }}
                          >
                            View Object
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleAddWishlistToCart(item)}
                            style={{
                              fontSize: '0.74rem',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--otaru-ink)',
                              backgroundColor: savedSuccess === item.id ? 'var(--otaru-gold)' : 'var(--otaru-parchment)',
                              border: 'none',
                              padding: '0.55rem 1.1rem',
                              cursor: 'pointer',
                              borderRadius: '2px',
                              fontWeight: 500,
                            }}
                          >
                            {savedSuccess === item.id ? 'Added to Tray ✓' : 'Add to Tray'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveWishlist(item.id)}
                            aria-label="Remove from wishlist"
                            style={{ background: 'none', border: 'none', color: 'var(--otaru-horizon)', fontSize: '1rem', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ADDRESSES */}
            {activeTab === 'Addresses' && (
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <p style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', margin: 0 }}>
                    Saved courier destinations for insured archival shipment dispatches.
                  </p>
                  <button
                    type="button"
                    style={{
                      fontSize: '0.74rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--otaru-gold)',
                      border: '1px dashed var(--otaru-gold)',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      borderRadius: '2px',
                    }}
                  >
                    + Add New Destination
                  </button>
                </div>

                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.8rem' }}>
                  {ADDRESSES_DATA.map((addr) => (
                    <div
                      key={addr.id}
                      className="sashiko-stitch-box"
                      style={{
                        padding: '1.6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.64rem', letterSpacing: '0.12em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-ink)', backgroundColor: 'var(--otaru-gold)', padding: '0.15rem 0.45rem', borderRadius: '2px' }}>
                              Primary
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--otaru-parchment)', marginTop: '0.8rem' }}>
                          {addr.recipient}
                        </h3>

                        <div style={{ marginTop: '0.6rem', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--otaru-parchment-dim)' }}>
                          <p style={{ margin: 0 }}>{addr.line1}</p>
                          <p style={{ margin: 0 }}>{addr.city} {addr.postal}</p>
                          <p style={{ margin: 0 }}>{addr.country}</p>
                          <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: 'var(--otaru-horizon)' }}>{addr.phone}</p>
                        </div>
                      </div>

                      <div style={{ marginTop: '1.5rem', paddingTop: '0.8rem', borderTop: '1px dashed var(--otaru-line)', display: 'flex', gap: '1rem' }}>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--otaru-gold)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}
                        >
                          Edit Details
                        </button>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: 'var(--otaru-parchment-dim)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: MEMBERSHIP (ARCHIVAL CIRCLE) */}
            {activeTab === 'Membership' && (
              <div style={{ marginTop: '2.5rem' }}>
                <div
                  className="watoji-frame"
                  style={{
                    padding: '2rem',
                    backgroundColor: 'rgba(14, 23, 36, 0.75)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.64rem', letterSpacing: '0.14em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          COLLECTOR TIER MMXXVI
                        </span>
                        <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(217,189,131,0.15)', border: '1px solid var(--otaru-gold-dim)', borderRadius: '2px', color: 'var(--otaru-gold)' }}>
                          Active Status
                        </span>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--otaru-parchment)', marginTop: '0.4rem' }}>
                        Archival Circle
                      </h2>
                      <p style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem', maxWidth: '54ch', lineHeight: 1.7, marginTop: '0.4rem' }}>
                        Limited to 150 collectors globally. Standing archive concierge, guaranteed piece allocation, and perpetual canal studio care.
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--otaru-horizon)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Annual Monograph
                      </span>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--otaru-parchment)', margin: '0.2rem 0 0' }}>
                        $120 <span style={{ fontSize: '0.85rem', color: 'var(--otaru-parchment-dim)' }}>/ year</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--otaru-line)' }}>
                    <h3 style={{ fontSize: '0.78rem', letterSpacing: '0.14em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: '1rem' }}>
                      INCLUDED ARCHIVAL PRIVILEGES
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--otaru-parchment)' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>✓</span>
                        <span style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>48-hour priority access to live batch drops before indexing</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--otaru-parchment)' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>✓</span>
                        <span style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>Perpetual provenance ledger linked to physical garment seals</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--otaru-parchment)' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>✓</span>
                        <span style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>Annual canal re-waxing & sashiko/boro garment restoration</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--otaru-parchment)' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>✓</span>
                        <span style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>Guaranteed size allocation on upcoming seasonal releases</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'var(--otaru-parchment)' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>✓</span>
                        <span style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>Studio anniversary linen-bound textile monograph</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                    <a
                      href="mailto:studio@otaru.in?subject=Studio%20Visit%20Appointment"
                      style={{
                        border: '1px solid var(--otaru-gold)',
                        backgroundColor: 'var(--otaru-gold)',
                        color: 'var(--otaru-ink)',
                        padding: '0.7rem 1.4rem',
                        fontSize: '0.76rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        borderRadius: '2px',
                        fontWeight: 600,
                      }}
                    >
                      Request Studio Visit in Hokkaido
                    </a>
                    <Link
                      href="/membership"
                      style={{
                        border: '1px solid var(--otaru-line-strong)',
                        color: 'var(--otaru-parchment)',
                        padding: '0.7rem 1.4rem',
                        fontSize: '0.76rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        borderRadius: '2px',
                      }}
                    >
                      Explore All Atelier Tiers →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
