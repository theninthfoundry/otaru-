'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { useSizeGuide } from '@/lib/size-guide';
import { PRODUCT_CATALOG, CARE_SETS, Product } from '@/lib/catalog';
import clsx from 'clsx';

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const product: Product | undefined = PRODUCT_CATALOG[productId];
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { openSizeGuide } = useSizeGuide();

  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<number[]>([0]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  const isOneSize = Boolean(product && product.sizes.length === 1 && product.sizes[0]?.[0] === 'One Size');

  useEffect(() => {
    if (!product) return;

    if (isOneSize) {
      setSelectedSize('One Size');
    } else {
      setSelectedSize(null);
    }
    setSizeError(false);
    setActiveThumb(0);

    // Track recently viewed
    try {
      const stored = localStorage.getItem('otaru_recently_viewed');
      const list: string[] = stored ? JSON.parse(stored) : [];
      const updated = [productId, ...list.filter((id) => id !== productId)].slice(0, 6);
      localStorage.setItem('otaru_recently_viewed', JSON.stringify(updated));
      setRecentlyViewed(updated.filter((id) => id !== productId).slice(0, 3));
    } catch {
      // Ignore localStorage errors
    }
  }, [productId, product, isOneSize]);

  // Subtle 1-3px cursor follower
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageBoxRef.current) return;
    const rect = imageBoxRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / 35;
    const y = (e.clientY - (rect.top + rect.height / 2)) / 35;
    setCursorOffset({ x: Math.max(-3, Math.min(3, x)), y: Math.max(-3, Math.min(3, y)) });
  };

  const handleMouseLeave = () => {
    setCursorOffset({ x: 0, y: 0 });
  };

  if (!product) {
    return (
      <div className="wrap" style={{ padding: '12rem 0', textAlign: 'center' }}>
        <h1 className="section-title" style={{ margin: '0 auto' }}>Object not found</h1>
        <p className="section-lede" style={{ margin: '1rem auto' }}>
          This object has concluded its archival run or does not exist in the active catalogue.
        </p>
        <Link href="/archive" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 1.6rem', marginTop: '2rem' }}>
          Return to Archive
        </Link>
      </div>
    );
  }

  const imageLabels = [
    `${product.objectNumber} — ${product.name} — Front View`,
    `${product.objectNumber} — ${product.name} — Back & Silhouette`,
    `${product.objectNumber} — Textile Weave Close-up`,
    `${product.objectNumber} — Worn in Harbor Studio`,
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart({
      id: `${productId}-${selectedSize}`,
      name: `${product.name}${selectedSize === 'One Size' ? '' : ` — ${selectedSize}`}`,
      meta: product.material.split(',')[0] || '',
      price: product.price,
      size: selectedSize,
      qty: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const relatedIds = Object.keys(PRODUCT_CATALOG)
    .filter((k) => k !== productId && Boolean(PRODUCT_CATALOG[k]))
    .slice(0, 3);

  const careList = CARE_SETS[product.care] || [];
  const selectedSizeStock = product.sizes.find((s) => s[0] === selectedSize)?.[1] ?? 0;

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Japanese Art Plates */}
      <ArtBackgroundPlate artName="cherry-blossom" position="top-right" opacity={0.17} maxWidth="780px" maxHeight="580px" />
      <ArtBackgroundPlate artName="great-wave" position="bottom-left" opacity={0.15} maxWidth="720px" maxHeight="520px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.03} />

      {/* Vertical Japanese Calligraphy Watermark */}
      <VerticalKanjiStamp text="物象原版" subtext={`OBJECT ${product.objectNumber} PROVENANCE`} top="8%" right="2.5%" opacity={0.045} />

      <div className="wrap pdp-wrap" style={{ paddingTop: '8.5rem', paddingBottom: '7rem', position: 'relative', zIndex: 1 }}>
      {/* Archival Ledger Breadcrumb */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', marginBottom: '2.5rem' }}>
        <Link href="/archive" style={{ color: 'inherit', textDecoration: 'none' }}>ARCHIVE</Link>
        <span aria-hidden="true" style={{ color: 'var(--otaru-line-strong)' }}>/</span>
        <span style={{ color: 'inherit' }}>{product.category}</span>
        <span aria-hidden="true" style={{ color: 'var(--otaru-line-strong)' }}>/</span>
        <span style={{ color: 'var(--otaru-gold)' }}>{product.objectNumber}</span>
      </nav>

      {/* Main Object Showcase */}
      <div
        className="pdp-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.28fr 1fr',
          gap: ' clamp(2rem, 5vw, 5rem)',
          alignItems: 'start',
        }}
      >
        {/* Left: Editorial Image Canvas with Cursor Follower */}
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          {/* Vertical Index Indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '60px', flexShrink: 0 }}>
            {imageLabels.map((_, i) => (
              <button
                key={i}
                type="button"
                className={clsx('pdp-thumb', activeThumb === i && 'is-active')}
                onClick={() => setActiveThumb(i)}
                aria-label={`View image 0${i + 1}`}
                style={{
                  border: activeThumb === i ? '1px solid var(--otaru-gold)' : '1px solid var(--otaru-line)',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none',
                  position: 'relative',
                }}
              >
                <ImagePlaceholder ratio="portrait" label={`0${i + 1}`} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0.2rem',
                    right: '0.3rem',
                    fontSize: '0.55rem',
                    color: activeThumb === i ? 'var(--otaru-gold)' : 'var(--otaru-parchment-dim)',
                    fontFamily: 'monospace',
                  }}
                >
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Large Editorial Display with Micro Cursor Offset */}
          <div
            ref={imageBoxRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '2px',
              border: '1px solid var(--otaru-line)',
              backgroundColor: 'var(--otaru-dusk)',
            }}
          >
            <div
              style={{
                transform: `translate3d(${cursorOffset.x}px, ${cursorOffset.y}px, 0)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              <ImagePlaceholder ratio="portrait" label={imageLabels[activeThumb]} />
            </div>

            {/* Bottom Counter */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--otaru-parchment)',
                backgroundColor: 'rgba(11,20,32,0.75)',
                backdropFilter: 'blur(6px)',
                padding: '0.25rem 0.65rem',
                border: '1px solid rgba(244,239,226,0.15)',
              }}
            >
              0{activeThumb + 1} / 04 · {product.firstRelease}
            </div>
          </div>
        </div>

        {/* Right: Archival Object Ledger & Commerce */}
        <div className="pdp-info" style={{ position: 'sticky', top: '6.5rem' }}>
          {/* Object Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              {product.objectNumber}
            </span>
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase' }}>
              {product.origin}
            </span>
          </div>

          {/* Name & Price */}
          <h1 style={{ margin: '1rem 0 0', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem, 3.4vw, 2.9rem)', fontWeight: 400, color: 'var(--otaru-parchment)', lineHeight: 1.1 }}>
            {product.name}
          </h1>
          <p style={{ margin: '0.6rem 0 0', fontSize: '1.25rem', color: 'var(--otaru-gold)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            {formatPrice(product.price)}
          </p>

          {/* Archival Editorial Narrative: Why does it exist? */}
          <p style={{ marginTop: '1.4rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.94rem', lineHeight: 1.75, borderLeft: '2px solid var(--otaru-gold-dim)', paddingLeft: '1rem' }}>
            {product.story}
          </p>

          {/* Size Selector */}
          <div style={{ margin: '2rem 0 0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Select Size
              </span>
              {!isOneSize && (
                <button
                  type="button"
                  onClick={() => openSizeGuide(productId)}
                  style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', textDecoration: 'underline' }}
                >
                  Size Guide Ledger ↗
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {product.sizes.map(([sizeName, stock]) => {
                const isSold = stock === 0;
                const isSelected = selectedSize === sizeName;

                return (
                  <button
                    key={sizeName}
                    type="button"
                    disabled={isSold}
                    onClick={() => {
                      setSelectedSize(sizeName);
                      setSizeError(false);
                    }}
                    className={clsx(
                      'pdp-size-btn',
                      isSelected && 'is-active',
                      isSold && 'is-sold'
                    )}
                    style={{
                      position: 'relative',
                      height: '2.5rem',
                      minWidth: '3.2rem',
                      padding: '0 0.8rem',
                      border: isSelected
                        ? '1px solid var(--otaru-gold)'
                        : isSold
                        ? '1px solid var(--otaru-line)'
                        : '1px solid var(--otaru-line-strong)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: isSelected
                        ? 'var(--otaru-ink)'
                        : isSold
                        ? 'var(--otaru-horizon)'
                        : 'var(--otaru-parchment)',
                      backgroundColor: isSelected ? 'var(--otaru-parchment)' : 'transparent',
                      cursor: isSold ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {sizeName}
                    {isSold && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          margin: 'auto',
                          width: '80%',
                          height: '1px',
                          backgroundColor: 'var(--otaru-horizon)',
                          transform: 'rotate(-18deg)',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {sizeError && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: '#e0a08a' }}>
              Please select a size to record this object into your archive.
            </p>
          )}

          {/* Fit Notes */}
          <div
            style={{
              marginTop: '1.4rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(23, 41, 62, 0.4)',
              border: '1px solid var(--otaru-line)',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              color: 'var(--otaru-parchment-dim)',
            }}
          >
            <strong style={{ color: 'var(--otaru-parchment)', display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Fit & Silhouette Notes
            </strong>
            {product.fitNotes}
          </div>

          {/* Primary Action: Add to Archive */}
          <div style={{ marginTop: '1.6rem', display: 'flex', gap: '0.8rem' }}>
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '1.05rem',
                backgroundColor: isAdded ? 'var(--otaru-gold)' : 'var(--otaru-parchment)',
                color: 'var(--otaru-ink)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {isAdded ? 'Added to Your Archive ✓' : 'Add to Archive'}
            </button>

            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-pressed={isWishlisted}
              aria-label="Save to wishlist"
              style={{
                width: '3.1rem',
                height: '3.1rem',
                flexShrink: 0,
                border: '1px solid var(--otaru-line-strong)',
                display: 'grid',
                placeItems: 'center',
                color: isWishlisted ? 'var(--otaru-gold)' : 'var(--otaru-parchment-dim)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'var(--otaru-gold)' : 'none'} stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c1.9 0 3.3 1 4.5 2.5C12.2 6 13.6 5 15.5 5 19 5 21.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
              </svg>
            </button>
          </div>

          {selectedSize && selectedSizeStock > 0 && selectedSizeStock <= 3 && (
            <p style={{ marginTop: '0.6rem', fontSize: '0.74rem', color: 'var(--otaru-gold-dim)' }}>
              Archival note: Only {selectedSizeStock} remaining in this size specification.
            </p>
          )}

          {/* Expandable Slow Accordion System */}
          <div style={{ marginTop: '2.4rem', borderTop: '1px solid var(--otaru-line)' }}>
            {[
              {
                title: 'The Object Provenance Ledger',
                content: (
                  <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <dt style={{ color: 'var(--otaru-parchment-dim)' }}>Run Edition</dt>
                      <dd style={{ margin: 0, color: 'var(--otaru-parchment)' }}>{product.runQuantity}</dd>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <dt style={{ color: 'var(--otaru-parchment-dim)' }}>First Release</dt>
                      <dd style={{ margin: 0, color: 'var(--otaru-parchment)' }}>{product.firstRelease}</dd>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <dt style={{ color: 'var(--otaru-parchment-dim)' }}>Studio Origin</dt>
                      <dd style={{ margin: 0, color: 'var(--otaru-parchment)' }}>{product.origin}</dd>
                    </div>
                    {product.specs.map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <dt style={{ color: 'var(--otaru-parchment-dim)' }}>{label}</dt>
                        <dd style={{ margin: 0, color: 'var(--otaru-parchment)' }}>{val}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
              {
                title: 'Material & Construction',
                content: (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
                    <li><strong style={{ color: 'var(--otaru-parchment)' }}>Textile:</strong> {product.material}</li>
                    <li><strong style={{ color: 'var(--otaru-parchment)' }}>Assembly:</strong> {product.construction}</li>
                    <li><strong style={{ color: 'var(--otaru-parchment)' }}>Finishing:</strong> Washed in canal water and inspected at Otaru warehouse.</li>
                  </ul>
                ),
              },
              {
                title: 'Care & Maintenance',
                content: (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
                    {careList.map((c, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--otaru-gold)' }}>·</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'Lifetime Canal Studio Repair & Shipping',
                content: (
                  <p style={{ margin: 0, lineHeight: 1.7, fontSize: '0.86rem' }}>
                    Ships directly from Otaru harbor warehouse. Domestic Japanese delivery in 3–5 days; international air shipment in 7–12 days.
                    Covered under our permanent repair ledger: return this garment to the studio for visible boro mending at any point in its lifespan.
                  </p>
                ),
              },
            ].map((sec, idx) => {
              const isOpen = openAccordions.includes(idx);
              return (
                <div key={sec.title} style={{ borderBottom: '1px solid var(--otaru-line)' }}>
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.1rem 0',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--otaru-parchment)',
                    }}
                  >
                    <span>{sec.title}</span>
                    <span
                      style={{
                        color: 'var(--otaru-gold-dim)',
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        fontSize: '1.3rem',
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ paddingBottom: '1.4rem', color: 'var(--otaru-parchment-dim)' }}>
                      {sec.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Large Editorial Photographic Break */}
      <div style={{ marginTop: '7rem' }}>
        <RevealOnScroll>
          <div style={{ border: '1px solid var(--otaru-line)', position: 'relative' }}>
            <ImagePlaceholder ratio="wide" label="Warehouse studio floor, Otaru Harbor — 2400×1000" />
          </div>
          <div style={{ marginTop: '1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <p style={{ margin: 0, maxWidth: '42ch', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.45rem', lineHeight: 1.4, color: 'var(--otaru-parchment)' }}>
              &ldquo;A garment designed to acquire memory, not obsolescence.&rdquo;
            </p>
            <span style={{ fontSize: '0.64rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
              OTARU CANAL ATELIER · MMXXVI
            </span>
          </div>
        </RevealOnScroll>
      </div>

      {/* Section 3: Craftsmanship 3-Step Hand Provenance */}
      <div style={{ marginTop: '7rem', paddingTop: '4rem', borderTop: '1px solid var(--otaru-line)' }}>
        <RevealOnScroll>
          <span className="eyebrow">The Atelier Process</span>
          <h2 className="section-title" style={{ fontSize: '2.1rem' }}>Three steps. Four craftspeople.</h2>
          <div
            style={{
              marginTop: '3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--otaru-gold)' }}>
                01
              </span>
              <p style={{ margin: 0, fontSize: '1rem', color: 'var(--otaru-parchment)', fontWeight: 500 }}>Hand-Cut Pattern</p>
              <p style={{ marginTop: '0.6rem', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--otaru-parchment-dim)' }}>
                Every panel is hand-cut singly with balanced shears — never laser-stacked. This ensures grain alignment and eliminates fabric tension distortions.
              </p>
            </div>
            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--otaru-gold)' }}>
                02
              </span>
              <p style={{ margin: 0, fontSize: '1rem', color: 'var(--otaru-parchment)', fontWeight: 500 }}>Canal Water Dye & Finish</p>
              <p style={{ marginTop: '0.6rem', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--otaru-parchment-dim)' }}>
                Textiles are rinsed in cold mineral water from the Otaru canal to set the botanical Sukumo indigo or walnut tannins before tailored pressing.
              </p>
            </div>
            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--otaru-gold)' }}>
                03
              </span>
              <p style={{ margin: 0, fontSize: '1rem', color: 'var(--otaru-parchment)', fontWeight: 500 }}>Archival Cataloging</p>
              <p style={{ marginTop: '0.6rem', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--otaru-parchment-dim)' }}>
                A single maker inspects each seam, hardware attachment, and hem bar tack before stamping the individual object number into the archive record.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Section 4: Related Objects in the Archive */}
      <div style={{ marginTop: '7rem', paddingTop: '4rem', borderTop: '1px solid var(--otaru-line)' }}>
        <RevealOnScroll>
          <span className="eyebrow">Complementary Pieces</span>
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Related in the Archive</h2>
          <div
            style={{
              marginTop: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem 1.6rem',
            }}
          >
            {relatedIds.map((rid) => {
              const r = PRODUCT_CATALOG[rid];
              if (!r) return null;
              return (
                <Link key={rid} href={`/product/${rid}`} className="artifact-card group object-card" style={{ textDecoration: 'none' }}>
                  <div style={{ overflow: 'hidden', borderRadius: '2px', border: '1px solid var(--otaru-line)' }}>
                    <ImagePlaceholder ratio="portrait" label={`${r.objectNumber} — ${r.name}`} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem' }}>
                    <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      {r.objectNumber}
                    </span>
                    <span style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase' }}>
                      {r.origin.split('·')[0]}
                    </span>
                  </div>
                  <h3 style={{ margin: '0.3rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--otaru-parchment)' }}>
                    {r.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)', borderTop: '1px solid var(--otaru-line)', paddingTop: '0.3rem' }}>
                    <span>{r.material.split(',')[0]}</span>
                    <span style={{ color: 'var(--otaru-parchment)' }}>{formatPrice(r.price)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>

      {/* Section 5: Recently Looked At */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginTop: '7rem', paddingTop: '4rem', borderTop: '1px solid var(--otaru-line)' }}>
          <RevealOnScroll>
            <span className="eyebrow">Archival Trail</span>
            <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Objects you looked at earlier</h2>
            <div
              style={{
                marginTop: '2.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '2rem 1.6rem',
              }}
            >
              {recentlyViewed.map((rvId) => {
                const r = PRODUCT_CATALOG[rvId];
                if (!r) return null;
                return (
                  <Link key={rvId} href={`/product/${rvId}`} className="artifact-card group object-card" style={{ textDecoration: 'none' }}>
                    <div style={{ overflow: 'hidden', borderRadius: '2px', border: '1px solid var(--otaru-line)' }}>
                      <ImagePlaceholder ratio="portrait" label={`${r.objectNumber} — ${r.name}`} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem' }}>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        {r.objectNumber}
                      </span>
                    </div>
                    <h3 style={{ margin: '0.3rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--otaru-parchment)' }}>
                      {r.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)' }}>
                      <span>{r.material.split(',')[0]}</span>
                      <span style={{ color: 'var(--otaru-parchment)' }}>{formatPrice(r.price)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      )}
      </div>
    </div>
  );
}
