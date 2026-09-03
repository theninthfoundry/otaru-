'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SashikoGrid, VerticalKanjiStamp, JapaneseCornerBorder } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { isNfcSupported } from '@/lib/provenance/nfc';
import type { GarmentProvenanceCertificate } from '@/lib/provenance/verification';

export default function VerifyPiecePage() {
  const [tagCode, setTagCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<GarmentProvenanceCertificate | null>(null);
  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcAvailable, setNfcAvailable] = useState(false);

  useEffect(() => {
    setNfcAvailable(isNfcSupported());
  }, []);

  const handleVerify = async (serialToVerify: string) => {
    if (!serialToVerify.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/provenance/verify?serial=${encodeURIComponent(serialToVerify.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Verification failed. Serial number not recognized.');
        setCertificate(null);
      } else {
        setCertificate(data.certificate);
      }
    } catch {
      setError('Unable to reach provenance verification registry.');
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(tagCode);
  };

  const startNfcScan = async () => {
    if (!('NDEFReader' in window)) {
      setError('Web NFC is not supported on this browser/device. Please enter the serial number manually.');
      return;
    }

    try {
      setNfcScanning(true);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ndef.addEventListener('reading', ({ serialNumber, message }: any) => {
        setNfcScanning(false);
        let serialText = '';
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding);
            serialText = textDecoder.decode(record.data);
          }
        }
        const finalSerial = serialText || `OTARU-041-${serialNumber || '014'}`;
        setTagCode(finalSerial);
        handleVerify(finalSerial);
      });
    } catch (err) {
      console.warn('[NFC Scan Error]:', err);
      setNfcScanning(false);
      setError('NFC permission denied or scan interrupted.');
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <ArtBackgroundPlate artName="cherry-blossom" position="top-right" opacity={0.16} maxWidth="780px" maxHeight="580px" />
      <SashikoGrid opacity={0.035} />
      <VerticalKanjiStamp text="真贋証明" subtext="AUTHENTICITY PROVENANCE" top="12%" right="3%" opacity={0.05} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '740px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>Provenance & Authenticity</span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            [ CRYPTOGRAPHIC REGISTRY ]
          </span>
        </div>

        <h1 className="section-title">Verify authenticity</h1>
        <p className="section-lede">
          Every Otaru garment includes an NFC-woven tag into the care label with an immutable cryptographic serial number.
          Tap or enter your tag code to inspect its limited edition number, master craftsman attribution, and dye bath provenance.
        </p>

        {/* Scan & Search Card */}
        {!certificate ? (
          <div style={{ marginTop: '2.5rem', padding: '2rem', border: '1px solid var(--otaru-line)', backgroundColor: 'var(--otaru-dusk)' }}>
            {nfcAvailable && (
              <div style={{ marginBottom: '2rem', paddingBottom: '1.8rem', borderBottom: '1px dashed var(--otaru-line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      Web NFC Device Detected
                    </span>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--otaru-parchment)' }}>
                      Hold your device against the care label sewn into the garment seam.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startNfcScan}
                    disabled={nfcScanning}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.4rem', fontSize: '0.82rem' }}
                  >
                    {nfcScanning ? 'Scanning for NFC Tag...' : '📡 Tap to Scan NFC Tag'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label
                  htmlFor="tag-code-input"
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--otaru-gold)',
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontFamily: 'monospace',
                  }}
                >
                  Garment Serial / Stamped Tag Code
                </label>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <input
                    id="tag-code-input"
                    type="text"
                    required
                    value={tagCode}
                    onChange={(e) => setTagCode(e.target.value)}
                    placeholder="e.g. OTARU-041-014 or OT-041-TOKUSHIMA"
                    style={{
                      flex: '1 1 240px',
                      background: 'var(--otaru-black)',
                      border: '1px solid var(--otaru-line-strong)',
                      padding: '0.85rem 1rem',
                      color: 'var(--otaru-parchment)',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                    style={{
                      padding: '0.85rem 1.6rem',
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Piece →'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--otaru-parchment-dim)' }}>Sample serial codes:</span>
                {['OTARU-041-014', 'OTARU-042-008', 'OTARU-038-001'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setTagCode(code);
                      handleVerify(code);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--otaru-gold)',
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontFamily: 'monospace',
                    }}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </form>

            {error && (
              <div style={{ marginTop: '1.2rem', padding: '0.8rem', backgroundColor: 'rgba(181, 73, 50, 0.12)', border: '1px solid #b54932', color: '#f4efe2', fontSize: '0.82rem' }}>
                ⚠ {error}
              </div>
            )}
          </div>
        ) : (
          /* Provenance Certificate Display */
          <div style={{ marginTop: '2.5rem' }}>
            <JapaneseCornerBorder>
              <div
                style={{
                  padding: '2.4rem',
                  border: '1px solid var(--otaru-gold)',
                  backgroundColor: 'var(--otaru-dusk)',
                  position: 'relative',
                }}
              >
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--otaru-gold)', fontFamily: 'monospace' }}>
                      ✓ Verified Archival Artifact
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--otaru-parchment)', margin: '0.3rem 0 0.1rem' }}>
                      {certificate.title}
                    </h2>
                    <span style={{ fontSize: '0.78rem', color: 'var(--otaru-parchment-dim)', fontFamily: 'monospace' }}>
                      NO. {certificate.objectNumber} · {certificate.category}
                    </span>
                  </div>

                  {/* Hankō Atelier Stamp */}
                  <div
                    title="Otaru Master Atelier Seal"
                    style={{
                      width: '46px',
                      height: '46px',
                      border: '2px solid #b54932',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(181, 73, 50, 0.15)',
                      color: '#b54932',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'rotate(-4deg)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    樽印
                  </div>
                </div>

                {/* Edition & Provenance Details Grid */}
                <div
                  style={{
                    marginTop: '2rem',
                    paddingTop: '1.6rem',
                    borderTop: '1px solid var(--otaru-line)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.4rem',
                    fontSize: '0.86rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--otaru-gold)', letterSpacing: '0.1em', display: 'block', fontFamily: 'monospace' }}>
                      Edition Piece
                    </span>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--otaru-parchment)', fontWeight: 600 }}>
                      {certificate.editionPiece}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--otaru-gold)', letterSpacing: '0.1em', display: 'block', fontFamily: 'monospace' }}>
                      Dye Master
                    </span>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--otaru-parchment)' }}>
                      {certificate.artisanMaster}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--otaru-gold)', letterSpacing: '0.1em', display: 'block', fontFamily: 'monospace' }}>
                      Pattern Cutter
                    </span>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--otaru-parchment)' }}>
                      {certificate.patternCutter}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--otaru-gold)', letterSpacing: '0.1em', display: 'block', fontFamily: 'monospace' }}>
                      Dye Bath Batch
                    </span>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--otaru-parchment)', fontFamily: 'monospace' }}>
                      {certificate.dyeBath}
                    </p>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--otaru-gold)', letterSpacing: '0.1em', display: 'block', fontFamily: 'monospace' }}>
                      Loom & Fiber Specification
                    </span>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--otaru-parchment-dim)' }}>
                      {certificate.loomSpecification}
                    </p>
                  </div>
                </div>

                {/* Certificate Footer Stamp */}
                <div
                  style={{
                    marginTop: '2rem',
                    paddingTop: '1.4rem',
                    borderTop: '1px dashed var(--otaru-line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', display: 'block', fontFamily: 'monospace' }}>
                      Cryptographic Hash
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--otaru-gold)', fontFamily: 'monospace' }}>
                      {certificate.authenticityHash}
                    </span>
                  </div>

                  <Link href="/returns" className="cta-link" style={{ fontSize: '0.8rem', color: 'var(--otaru-gold)' }}>
                    Lifetime Free Repair Policy →
                  </Link>
                </div>
              </div>
            </JapaneseCornerBorder>

            <div style={{ marginTop: '1.6rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setCertificate(null)}
                className="cta-link"
                style={{ fontSize: '0.82rem' }}
              >
                ← Verify another garment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
