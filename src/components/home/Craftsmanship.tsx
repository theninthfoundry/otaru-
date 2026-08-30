'use client';

import React from 'react';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { useMaterialInspector, MATERIAL_DATA } from '@/components/ui/MaterialInspectorModal';
import { SashikoGrid, VerticalKanjiStamp, AsciiLoomBlueprint } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

interface Material {
  name: string;
  origin: string;
}

const MATERIALS: Material[] = [
  { name: 'Indigo cotton twill', origin: 'Tokushima' },
  { name: 'Raw hemp canvas', origin: 'Ōmi' },
  { name: 'Boiled wool', origin: 'Biratori' },
  { name: 'Washed silk', origin: 'Kiryū' },
];

export function Craftsmanship() {
  const { inspectMaterial } = useMaterialInspector();

  return (
    <section className="block on-ink" id="craft" style={{ paddingTop: 0, position: 'relative', overflow: 'hidden' }} aria-labelledby="craft-heading">
      {/* Background Floral Art Plate */}
      <ArtBackgroundPlate artName="poppies" position="top-right" opacity={0.17} maxWidth="720px" maxHeight="540px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.03} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="生織布染" subtext="WEAVING & BOTANICAL VAT" top="8%" right="2.5%" opacity={0.045} />
      <VerticalKanjiStamp text="小樽製織" subtext="1968 TOYODA G3 LOOM" top="55%" left="2%" opacity={0.04} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <hr className="hairline" style={{ marginBottom: 'var(--space-section)' }} />
        <RevealOnScroll>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                <span className="eyebrow" style={{ margin: 0 }}>Materials on Hand</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  [ BATCH MMXXVI ]
                </span>
              </div>
              <h2 className="section-title" id="craft-heading" style={{ maxWidth: '20ch' }}>
                Four materials, sourced by hand, this season.
              </h2>
            </div>
            <p className="section-lede" style={{ margin: 0 }}>
              Click any textile swatch to inspect yarn scan, shuttle loom specifications, and botanical vat data.
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="materials-grid reveal-stagger"
          style={{
            marginTop: '2.8rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.6rem',
          }}
        >
          {MATERIALS.map((item, i) => {
            const data = MATERIAL_DATA[item.name];

            return (
              <RevealOnScroll key={item.name} staggerIndex={i}>
                <div
                  onClick={() => inspectMaterial(item.name)}
                  className="material-card group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      inspectMaterial(item.name);
                    }
                  }}
                  aria-label={`Inspect ${item.name} from ${item.origin}`}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '2px',
                      border: '1px solid var(--otaru-line)',
                      backgroundColor: data?.accentColor || 'var(--otaru-dusk)',
                      aspectRatio: '1/1',
                    }}
                  >
                    <ImagePlaceholder ratio="swatch" label={item.name} />

                    {/* Inspect Badge Overlay on hover */}
                    <div
                      className="swatch-overlay"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(11,20,32,0.65)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0,
                        transition: 'opacity var(--duration-fast)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2rem', color: 'var(--otaru-parchment)' }}>
                        {data?.kanji}
                      </span>
                      <span
                        style={{
                          marginTop: '0.6rem',
                          fontSize: '0.62rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--otaru-gold)',
                          border: '1px solid var(--otaru-gold-dim)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '20px',
                        }}
                      >
                        Inspect Weave ↗
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--otaru-parchment)', fontWeight: 500 }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: '0.74rem', color: 'var(--otaru-gold-dim)', marginTop: '0.2rem' }}>
                        {item.origin}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                      {data?.weight.split('·')[0]}
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Minimalist Loom Craft Blueprint Diagram in Empty Space */}
        <RevealOnScroll style={{ marginTop: '3.5rem' }}>
          <div
            style={{
              padding: '1.6rem 2rem',
              backgroundColor: 'rgba(14, 23, 36, 0.35)',
              border: '1px dashed var(--otaru-line-strong)',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                TECHNICAL LOOM BLUEPRINT · MMXXVI
              </span>
              <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--otaru-line)' }} />
              <span style={{ fontSize: '0.6rem', color: 'var(--otaru-parchment-dim)', opacity: 0.5, fontFamily: 'monospace' }}>
                43.1907° N, 140.9947° E
              </span>
            </div>
            <AsciiLoomBlueprint opacity={0.5} />
          </div>
        </RevealOnScroll>
      </div>

      <style jsx>{`
        .material-card:hover .swatch-overlay {
          opacity: 1;
        }
        .material-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </section>
  );
}
