import React from 'react';
import { StorySection } from '@/components/home/StorySection';
import { CraftPairsSection } from '@/components/home/CraftPairsSection';

export default function StoryPage() {
  return (
    <div className="pt-20">
      <StorySection />
      <CraftPairsSection />
    </div>
  );
}
