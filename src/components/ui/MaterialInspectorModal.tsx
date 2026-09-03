'use client';

import React, { createContext, useContext, useState } from 'react';

export interface MaterialDetail {
  name: string;
  origin: string;
  kanji: string;
  type: string;
  weight: string;
  loom: string;
  dye: string;
  story: string;
  weaveType: 'twill' | 'canvas' | 'wool' | 'silk';
  accentColor: string;
}

export const MATERIAL_DATA: Record<string, MaterialDetail> = {
  'Indigo cotton twill': {
    name: 'Indigo cotton twill',
    origin: 'Tokushima Prefecture',
    kanji: '藍',
    type: '14.5oz Natural Botanical Twill',
    weight: '490 gsm · 3/1 Right-Hand Weave',
    loom: 'Toyoda G3 Vintage Shuttle Loom (1968)',
    dye: 'Natural Sukumo fermented indigo vat (14 dips)',
    story: 'Sourced from the Yoshino river basin in Tokushima. The yarn is dipped into fermented sukumo vats fourteen times over two weeks, then rinsed in cold canal water to fix the natural indigo. It fades with high-contrast character along natural friction points.',
    weaveType: 'twill',
    accentColor: '#1d3f5e',
  },
  'Raw hemp canvas': {
    name: 'Raw hemp canvas',
    origin: 'Ōmi (Shiga Prefecture)',
    kanji: '麻',
    type: '100% Unbleached Bast Fiber Canvas',
    weight: '380 gsm · Plain Balanced Weave',
    loom: 'High-tension rapier shuttle with wood beam',
    dye: 'Undyed · Natural river-washed bast flax',
    story: 'Grown along the shores of Lake Biwa using ancient Ōmi-asa techniques. The hemp stalks are retted in fresh spring water and spun without chemical bleaching, retaining the crisp architectural stiffness and golden straw undertones of raw bast fibers.',
    weaveType: 'canvas',
    accentColor: '#a8905f',
  },
  'Boiled wool': {
    name: 'Boiled wool',
    origin: 'Biratori, Hokkaido',
    kanji: '羊',
    type: 'Heavy Felted Melange Melton',
    weight: '620 gsm · Compact Felted Boucle',
    loom: 'Narrow-width woolen carding loom',
    dye: 'Oak gall & wild walnut husk extract',
    story: 'Woven from northern climate sheep fleeces raised in Biratori. After weaving, the cloth is tumbled in boiling mineral spring water for six hours to shrink the fibers by 35%, creating a dense, naturally windproof and water-repellent armor against snow.',
    weaveType: 'wool',
    accentColor: '#4a5359',
  },
  'Washed silk': {
    name: 'Washed silk',
    origin: 'Kiryū, Gunma Prefecture',
    kanji: '絹',
    type: 'Matte Sandwashed Habotai Blend',
    weight: '210 gsm · Satin Crepe Weave',
    loom: 'Historic Kiryū wooden jacquard loom',
    dye: 'Alder cone & iron mineral mordant',
    story: 'Produced in the traditional silk-weaving capital of Kiryū. Treated with a sand-wash tumbling process that strips the gloss, leaving a powdery, cool drape that breathes effortlessly while holding architectural folds.',
    weaveType: 'silk',
    accentColor: '#b0a996',
  },
};

interface MaterialContextType {
  selectedMaterial: MaterialDetail | null;
  inspectMaterial: (name: string) => void;
  closeInspector: () => void;
}

const MaterialContext = createContext<MaterialContextType>({
  selectedMaterial: null,
  inspectMaterial: () => {},
  closeInspector: () => {},
});

export function MaterialInspectorProvider({ children }: { children: React.ReactNode }) {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDetail | null>(null);

  const inspectMaterial = (name: string) => {
    const detail = MATERIAL_DATA[name] || Object.values(MATERIAL_DATA)[0] || null;
    setSelectedMaterial(detail);
  };

  const closeInspector = () => setSelectedMaterial(null);

  return (
    <MaterialContext.Provider value={{ selectedMaterial, inspectMaterial, closeInspector }}>
      {children}
      <MaterialInspectorModal />
    </MaterialContext.Provider>
  );
}

export function useMaterialInspector() {
  return useContext(MaterialContext);
}

function MaterialInspectorModal() {
  const { selectedMaterial, closeInspector } = useMaterialInspector();

  if (!selectedMaterial) return null;

  return (
    <div
      className="search-overlay is-open"
      onClick={closeInspector}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 140,
        backgroundColor: 'rgba(7, 13, 20, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: 'var(--otaru-dusk)',
          border: '1px solid var(--otaru-line-strong)',
          padding: '2.5rem',
          position: 'relative',
          borderRadius: '2px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeInspector}
          aria-label="Close material inspector"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            color: 'var(--otaru-parchment-dim)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1.2rem' }}>
          <div>
            <span className="eyebrow">Textile Provenance Ledger</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--otaru-parchment)', marginTop: '0.4rem' }}>
              {selectedMaterial.name}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--otaru-gold-dim)', marginTop: '0.2rem' }}>
              {selectedMaterial.origin}
            </p>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '3rem', color: 'rgba(217,189,131,0.25)', lineHeight: 1 }}>
            {selectedMaterial.kanji}
          </span>
        </div>

        {/* Microscopic Weave Simulation Visual */}
        <div
          style={{
            marginTop: '1.8rem',
            height: '140px',
            width: '100%',
            backgroundColor: selectedMaterial.accentColor,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '2px',
            border: '1px solid var(--otaru-line-strong)',
          }}
        >
          <svg width="100%" height="100%" style={{ opacity: 0.45 }}>
            <defs>
              <pattern id="weavePattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 0 4 L 16 4 M 0 12 L 16 12 M 4 0 L 4 16 M 12 0 L 12 16" stroke="#f4efe2" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="2" fill="#d9bd83" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#weavePattern)" />
          </svg>
          <div
            style={{
              position: 'absolute',
              bottom: '0.8rem',
              left: '1rem',
              fontSize: '0.62rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--otaru-parchment)',
              backgroundColor: 'rgba(11,20,32,0.7)',
              padding: '0.25rem 0.6rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            MICROSCOPIC YARN SCAN · {selectedMaterial.weight}
          </div>
        </div>

        {/* Technical Data Grid */}
        <div
          style={{
            marginTop: '1.8rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.2rem',
            backgroundColor: 'rgba(11,20,32,0.4)',
            padding: '1.2rem',
            border: '1px solid var(--otaru-line)',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '0.64rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
              Specification
            </p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: 'var(--otaru-parchment)' }}>
              {selectedMaterial.type}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.64rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
              Loom Setup
            </p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: 'var(--otaru-parchment)' }}>
              {selectedMaterial.loom}
            </p>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <p style={{ margin: 0, fontSize: '0.64rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
              Botanical Dyeing Method
            </p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: 'var(--otaru-parchment)' }}>
              {selectedMaterial.dye}
            </p>
          </div>
        </div>

        {/* Story */}
        <div style={{ marginTop: '1.6rem' }}>
          <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--otaru-parchment-dim)' }}>
            {selectedMaterial.story}
          </p>
        </div>

        {/* Footer Action */}
        <div style={{ marginTop: '2.2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={closeInspector}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.6rem',
              fontSize: '0.74rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
