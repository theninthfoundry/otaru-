'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import clsx from 'clsx';

const TABS = ['Overview', 'Acquired Artifacts', 'Saved', 'Addresses', 'Membership'];

export function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="wrap profile-view" style={{ padding: '9rem 0 6rem' }}>
      <div
        className="profile-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '3rem',
        }}
      >
        <aside
          className="profile-side"
          style={{
            borderRight: '1px solid var(--otaru-line)',
            paddingRight: '2rem',
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden' }}>
            <ImagePlaceholder ratio="square" label="" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginTop: '1rem', color: 'var(--otaru-parchment)' }}>
            Member since MMXXV
          </h2>
          <p style={{ fontSize: '0.74rem', color: 'var(--otaru-parchment-dim)', marginTop: '0.2rem' }}>
            7 artifacts acquired
          </p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.8rem',
              fontSize: '0.64rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--otaru-gold)',
              border: '1px solid var(--otaru-gold-dim)',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
            }}
          >
            Archival Tier
          </span>

          <ul
            className="profile-tabs"
            role="tablist"
            aria-label="Profile sections"
            style={{
              listStyle: 'none',
              margin: '2.2rem 0 0',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <li key={tab}>
                  <button
                    type="button"
                    className={clsx(isActive && 'is-active')}
                    onClick={() => setActiveTab(tab)}
                    role="tab"
                    aria-selected={isActive}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.6rem 0.7rem',
                      fontSize: '0.84rem',
                      color: isActive ? 'var(--otaru-parchment)' : 'var(--otaru-parchment-dim)',
                      backgroundColor: isActive ? 'var(--otaru-dusk-2)' : 'transparent',
                      borderRadius: '2px',
                    }}
                  >
                    {tab}
                  </button>
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: '2rem' }}>
            <Link
              href="/"
              className="cta-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--otaru-parchment-dim)',
              }}
            >
              Sign out
            </Link>
          </div>
        </aside>

        <div>
          <h1 className="section-title" style={{ fontSize: '2rem', margin: 0 }}>
            {activeTab}
          </h1>

          <div
            className="stat-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.2rem',
              marginTop: '2rem',
            }}
          >
            <div className="stat-card" style={{ border: '1px solid var(--otaru-line)', padding: '1.4rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', margin: 0, color: 'var(--otaru-parchment)' }}>7</p>
              <p style={{ marginTop: '0.3rem', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Artifacts acquired
              </p>
            </div>
            <div className="stat-card" style={{ border: '1px solid var(--otaru-line)', padding: '1.4rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', margin: 0, color: 'var(--otaru-parchment)' }}>3</p>
              <p style={{ marginTop: '0.3rem', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Saved to wishlist
              </p>
            </div>
            <div className="stat-card" style={{ border: '1px solid var(--otaru-line)', padding: '1.4rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', margin: 0, color: 'var(--otaru-parchment)' }}>Archival</p>
              <p style={{ marginTop: '0.3rem', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Membership tier
              </p>
            </div>
          </div>

          <h3
            style={{
              marginTop: '3rem',
              fontSize: '0.9rem',
              letterSpacing: '0.06em',
              color: 'var(--otaru-parchment-dim)',
              textTransform: 'uppercase',
            }}
          >
            Recent activity
          </h3>

          <div style={{ marginTop: '1rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid var(--otaru-line)',
              }}
            >
              <div style={{ width: '56px', height: '70px', flexShrink: 0 }}>
                <ImagePlaceholder ratio="portrait" label="" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--otaru-parchment)' }}>
                  Yama Field Jacket
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)' }}>
                  Acquired · No. 041 · 18 Aug MMXXVI
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid var(--otaru-line)',
              }}
            >
              <div style={{ width: '56px', height: '70px', flexShrink: 0 }}>
                <ImagePlaceholder ratio="portrait" label="" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--otaru-parchment)' }}>
                  Kiryū Wrap Trouser
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)' }}>
                  Saved to wishlist · No. 042
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: 'none',
              }}
            >
              <div style={{ width: '56px', height: '70px', flexShrink: 0 }}>
                <ImagePlaceholder ratio="portrait" label="" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--otaru-parchment)' }}>
                  Biratori Overshirt
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)' }}>
                  Acquired · No. 043 · 02 Jul MMXXVI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
