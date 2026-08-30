import React from 'react';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { STUDIO_TEAM } from '@/lib/catalog';

export function StudioTeam() {
  return (
    <ul
      className="team-grid reveal-stagger"
      style={{
        marginTop: '2.5rem',
        listStyle: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {STUDIO_TEAM.map((member, i) => (
        <RevealOnScroll key={member.name} staggerIndex={i}>
          <li>
            <ImagePlaceholder ratio="square" label="Portrait" className="rounded-full" />
            <p style={{ marginTop: '0.8rem', fontSize: '0.92rem', color: 'var(--otaru-parchment)', margin: '0.8rem 0 0' }}>
              {member.name}
            </p>
            <p style={{ marginTop: '0.2rem', fontSize: '0.78rem', color: 'var(--otaru-parchment-dim)', margin: '0.2rem 0 0' }}>
              {member.role}
            </p>
          </li>
        </RevealOnScroll>
      ))}
    </ul>
  );
}
