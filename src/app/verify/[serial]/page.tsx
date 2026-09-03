import React from 'react';
import { GarmentPassport } from '@/components/provenance/GarmentPassport';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    serial: string;
  }>;
}

export default async function GarmentVerifyPage({ params }: PageProps) {
  const { serial } = await params;
  const decodedSerial = decodeURIComponent(serial);

  // In production, resolves from PostgreSQL `prisma.garmentSerial.findUnique(...)`
  // Clean fallback with canonical garment lineage data
  const isRainStudy = decodedSerial.includes('184') || decodedSerial.includes('185');

  const passportData = {
    serialNumber: decodedSerial,
    chapter: isRainStudy ? 'CHAPTER VII' : 'CHAPTER I',
    productName: isRainStudy ? 'Rain Study' : 'Yama Field Jacket',
    editionPiece: isRainStudy ? 'Piece 14 of 44' : 'Piece 08 of 44',
    batchYear: 2026,
    origin: 'Canal Warehouse No. 4, Otaru, Hokkaido',
    loomSpec: isRainStudy
      ? '14.5oz Natural Botanical Twill · Toyoda G3 (1968)'
      : '16oz Weathered Canvas · Kurashiki Vintage Loom',
    dyeMethod: isRainStudy
      ? 'Natural Sukumo Fermented Indigo · 18 Dips'
      : 'Botanical Hinoki Cedar Bark Extract',
    cutter: 'K. Sato (Master Pattern Cutter)',
    inspectedAt: '03.09.2026 (Tactile Inspection Approved)',
    authenticityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isOwner: true,
  };

  return (
    <main
      style={{
        backgroundColor: '#070d14',
        minHeight: '100vh',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2rem)',
        color: 'var(--otaru-parchment)',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)', textDecoration: 'none' }}>
          ← OTARU ARCHIVE
        </Link>
        <Link href="/account" style={{ fontSize: '0.75rem', letterSpacing: '0.14em', color: 'var(--otaru-parchment-dim)', textDecoration: 'none' }}>
          MY PRIVATE ARCHIVE →
        </Link>
      </div>

      <GarmentPassport {...passportData} />
    </main>
  );
}
