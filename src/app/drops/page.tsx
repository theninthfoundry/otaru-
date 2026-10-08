import React from 'react';
import type { Metadata } from 'next';
import { NewDrops } from '@/components/home/NewDrops';

export const metadata: Metadata = {
  title: 'Live Drops & Allocations',
  description: 'Recent archival acquisitions and limited single-edition garments cut between moon phases in Hokkaido.',
};

export default function DropsPage() {
  return (
    <div style={{ paddingTop: '5rem' }}>
      <NewDrops />
    </div>
  );
}
