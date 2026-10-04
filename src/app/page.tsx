import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { StorySection } from '@/components/home/StorySection';
import { CraftPairsSection } from '@/components/home/CraftPairsSection';
import { DropSection } from '@/components/home/DropSection';
import { ResidentsSection } from '@/components/home/ResidentsSection';
import { FieldNotesSection } from '@/components/home/FieldNotesSection';
import { ClosingSection } from '@/components/home/ClosingSection';
import { Thread } from '@/components/ui/Thread';

export default function HomePage() {
  return (
    <>
      <Thread />
      <HeroSection />
      <StorySection />
      <CraftPairsSection />
      <DropSection />
      <ResidentsSection />
      <FieldNotesSection />
      <ClosingSection />
    </>
  );
}
