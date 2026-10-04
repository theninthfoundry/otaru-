'use client';

import React from 'react';

export interface GarmentPassportProps {
  serialNumber: string;        // "OTR-2026-000184"
  chapter: string;             // "CHAPTER VII"
  productName: string;         // "Rain Study"
  editionPiece: string;        // "Piece 14 of 44"
  batchYear: number;           // 2026
  origin: string;              // "Otaru, Hokkaido"
  loomSpec: string;            // "Toyoda G3 Vintage Shuttle Loom (1968)"
  dyeMethod: string;           // "Botanical Sukumo Fermented Indigo"
  cutter: string;              // "K. Sato (Master Pattern Cutter)"
  inspectedAt: string;         // "03.09.2026"
  authenticityHash: string;    // 64-char SHA-256
  isOwner?: boolean;
}

/**
 * C5 — GARMENT PASSPORT
 * The digital certificate and identity passport permanently bound to the physical garment.
 * Accessed by scanning the physical garment's woven QR/NFC label.
 */
export function GarmentPassport({
  serialNumber,
  chapter,
  productName,
  editionPiece,
  origin,
  loomSpec,
  dyeMethod,
  cutter,
  inspectedAt,
  authenticityHash,
  isOwner = true,
}: GarmentPassportProps) {
  return (
    <div
      className="garment-passport"
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        backgroundColor: 'var(--otaru-ink)',
        border: '1px solid var(--otaru-line-strong)',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        position: 'relative',
        color: 'var(--otaru-parchment)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Archival Header Header Plate */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
            GARMENT PASSPORT / デジタル証明
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.2rem 0 0', fontWeight: 400 }}>
            {productName}
          </h1>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)' }}>
            {chapter} · {editionPiece}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.12em', color: 'var(--otaru-gold)' }}>
            {serialNumber}
          </span>
          <div style={{ marginTop: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(217,189,131,0.3)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            <span style={{ color: '#52b788' }}>✓</span> AUTHENTICATED
          </div>
        </div>
      </div>

      {/* Craft & Provenance Specification Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)' }}>Atelier Origin</span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{origin}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)' }}>Weave Specification</span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{loomSpec}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)' }}>Dye Process</span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{dyeMethod}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)' }}>Pattern Cutter</span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{cutter}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)' }}>Inspected & Sealed</span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{inspectedAt}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)' }}>Archival Status</span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: isOwner ? '#52b788' : 'inherit' }}>
            {isOwner ? 'In Active Private Archive' : 'Recorded in Ledger'}
          </p>
        </div>
      </div>

      {/* Cryptographic Seal */}
      <div style={{ backgroundColor: 'rgba(23, 41, 62, 0.4)', padding: '1rem', border: '1px solid var(--otaru-line)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)' }}>
            CRYPTOGRAPHIC LEDGER SEAL (SHA-256)
          </span>
          <span style={{ fontSize: '0.65rem', color: '#52b788' }}>VERIFIED ON POSTGRESQL</span>
        </div>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--otaru-parchment-dim)' }}>
          {authenticityHash}
        </p>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--otaru-line)', paddingTop: '1.2rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--otaru-horizon)' }}>
          Physical QR / NFC Tag Synchronized
        </span>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: 'none',
              border: '1px solid var(--otaru-line-strong)',
              color: 'var(--otaru-parchment)',
              padding: '0.4rem 0.8rem',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            PRINT DEED
          </button>
        </div>
      </div>
    </div>
  );
}
