import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { StudioTimeline } from '@/components/studio/StudioTimeline';
import { StudioValues } from '@/components/studio/StudioValues';
import { StudioTeam } from '@/components/studio/StudioTeam';
import { SashikoGrid, VerticalKanjiStamp, JapaneseCornerBorder } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

export default function StudioPage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Japanese Woodblock Art Plates */}
      <ArtBackgroundPlate artName="great-wave" position="top-right" opacity={0.19} maxWidth="850px" maxHeight="600px" />
      <ArtBackgroundPlate artName="poppies" position="center-left" opacity={0.16} maxWidth="680px" maxHeight="560px" />
      <ArtBackgroundPlate artName="cherry-blossom" position="bottom-right" opacity={0.17} maxWidth="720px" maxHeight="580px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="工房理念" subtext="ATELIER PHILOSOPHY MMXXVI" top="8%" right="2.5%" opacity={0.05} />
      <VerticalKanjiStamp text="北海船着" subtext="HOKKAIDO CANAL DOCK" top="42%" left="2%" opacity={0.045} />
      <VerticalKanjiStamp text="匠心永久" subtext="FOUR CRAFTSMEN · LIFETIME CARE" top="75%" right="2.5%" opacity={0.045} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
            <span className="eyebrow" style={{ margin: 0 }}>The studio</span>
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              [ HOKKAIDO CANAL WAREHOUSE ]
            </span>
          </div>
          <h1 className="section-title" style={{ maxWidth: '20ch' }}>
            What if we made garments differently?
          </h1>
          <p className="section-lede" style={{ maxWidth: '58ch' }}>
            A coat remembered the winters it carried you through. A shirt softened where your hands touched it most. Somewhere along the way, clothing became temporary — made quickly, consumed quickly, forgotten quickly. Otaru began with a simple refusal.
          </p>
        </RevealOnScroll>

        {/* The Idea */}
        <div style={{ marginTop: '6rem' }}>
          <RevealOnScroll>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2.5rem, 6vw, 5rem)',
                alignItems: 'center',
              }}
            >
              <div>
                <span className="eyebrow">The idea</span>
                <h2 style={{ marginTop: '0.9rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', lineHeight: 1.25, color: 'var(--otaru-parchment)' }}>
                  A good garment should have a life longer than its first impression.
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--otaru-parchment-dim)', lineHeight: 1.75 }}>
                <p style={{ margin: 0 }}>
                  We believe beauty is not always found in perfection. It can be found in a softened collar, a crease that returns, a repaired seam, a faded surface — the marks left behind by the person who wore it.
                </p>
                <p style={{ margin: 0 }}>
                  These are not failures of a garment. They are its biography.
                </p>
                <p style={{ margin: 0 }}>
                  So we design with time in mind: materials that can age, construction that can endure, forms that don&apos;t depend on a single moment.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* The Name */}
        <div style={{ marginTop: '6rem' }}>
          <RevealOnScroll>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2.5rem, 6vw, 5rem)',
                alignItems: 'center',
              }}
            >
              <div style={{ order: 1 }}>
                <JapaneseCornerBorder>
                  <div style={{ border: '1px solid var(--otaru-line)', borderRadius: '2px', overflow: 'hidden' }}>
                    <ImagePlaceholder ratio="wide" label="Otaru Harbor — 1600×1000" />
                  </div>
                </JapaneseCornerBorder>
              </div>
              <div style={{ order: 2 }}>
                <span className="eyebrow">The name</span>
                <h2 style={{ marginTop: '0.9rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', lineHeight: 1.25, color: 'var(--otaru-parchment)' }}>
                  A northern port where things arrived, waited, and sometimes remained.
                </h2>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--otaru-parchment-dim)', lineHeight: 1.75 }}>
                  <p style={{ margin: 0 }}>
                    Otaru is a name borrowed from a real place — a port city where warehouses, stone, water, timber, glass, and weather exist together.
                  </p>
                  <p style={{ margin: 0 }}>
                    A garment can be like a port. It arrives in your life as an object, then begins to collect places, seasons, movements, people, years, memories. The garment changes. So do you. Eventually, neither of you is quite the same as when you met.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Timeline */}
        <div style={{ marginTop: '6.5rem', paddingTop: '4rem', borderTop: '1px solid var(--otaru-line)' }}>
          <RevealOnScroll>
            <span className="eyebrow">A short history</span>
            <h2 className="section-title">Established MMXXVI, developing garments in Hokkaido since 2023.</h2>
          </RevealOnScroll>
          <StudioTimeline />
        </div>

        {/* Values */}
        <div style={{ marginTop: '6.5rem', paddingTop: '4rem', borderTop: '1px solid var(--otaru-line)' }}>
          <RevealOnScroll>
            <span className="eyebrow">How we work</span>
            <h2 className="section-title">Four principles that don&apos;t change with the season.</h2>
          </RevealOnScroll>
          <StudioValues />
        </div>

        {/* Who it's for */}
        <div style={{ marginTop: '6rem' }}>
          <RevealOnScroll>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2.5rem, 6vw, 5rem)',
                alignItems: 'center',
              }}
            >
              <div>
                <span className="eyebrow">Who it&apos;s for</span>
                <h2 style={{ marginTop: '0.9rem', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', lineHeight: 1.25, color: 'var(--otaru-parchment)' }}>
                  Not an imaginary perfect customer. People who notice.
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--otaru-parchment-dim)', lineHeight: 1.75 }}>
                <p style={{ margin: 0 }}>
                  People who keep the same notebook for years. Who remember where they bought something. Who repair objects instead of immediately replacing them.
                </p>
                <p style={{ margin: 0 }}>
                  Who understand the difference between something expensive and something considered — and that the things around us quietly become part of our lives. The garment is only the beginning.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Team */}
        <div style={{ marginTop: '6.5rem', paddingTop: '4rem', borderTop: '1px solid var(--otaru-line)' }}>
          <RevealOnScroll>
            <span className="eyebrow">The people</span>
            <h2 className="section-title">Four names on every care label.</h2>
          </RevealOnScroll>
          <StudioTeam />
        </div>

        {/* Visit Section */}
        <div
          style={{
            marginTop: '6.5rem',
            paddingTop: '3.5rem',
            borderTop: '1px solid var(--otaru-line)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ margin: 0, maxWidth: '28ch', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--otaru-parchment)' }}>
              The studio is open to visitors by appointment, most Fridays.
            </h2>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.86rem', color: 'var(--otaru-parchment-dim)' }}>
              Otaru, Hokkaido — exact address on request.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:studio@otaru.in"
              style={{
                border: '1px solid var(--otaru-line-strong)',
                padding: '0.85rem 1.4rem',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--otaru-parchment)',
                textDecoration: 'none',
              }}
            >
              Request a visit
            </a>
            <Link
              href="/journal"
              className="cta-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--otaru-parchment)',
                borderBottom: '1px solid var(--otaru-gold-dim)',
                paddingBottom: '0.2rem',
              }}
            >
              Read the journal <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
