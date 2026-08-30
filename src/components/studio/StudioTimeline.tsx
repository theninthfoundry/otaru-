import React from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { STUDIO_TIMELINE } from '@/lib/catalog';

export function StudioTimeline() {
  return (
    <ol
      className="timeline reveal-stagger"
      style={{
        marginTop: '3rem',
        borderLeft: '1px dashed rgba(217, 189, 131, 0.4)',
        listStyle: 'none',
        padding: 0,
        marginLeft: '0.8rem',
      }}
    >
      {STUDIO_TIMELINE.map((item, i) => (
        <RevealOnScroll key={item.year} staggerIndex={i}>
          <li
            style={{
              position: 'relative',
              padding: '0 0 3rem 2.2rem',
            }}
          >
            {/* Diamond Node */}
            <span
              style={{
                position: 'absolute',
                left: '-5px',
                top: '0.3rem',
                width: '9px',
                height: '9px',
                transform: 'rotate(45deg)',
                backgroundColor: 'var(--otaru-gold)',
                boxShadow: '0 0 8px rgba(217,189,131,0.4)',
              }}
              aria-hidden="true"
            />
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--otaru-gold)' }}>
              {item.year}
            </span>
            <p style={{ marginTop: '0.5rem', maxWidth: '56ch', lineHeight: 1.75, color: 'var(--otaru-parchment-dim)', fontSize: '0.94rem' }}>
              {item.text}
            </p>
          </li>
        </RevealOnScroll>
      ))}
    </ol>
  );
}
