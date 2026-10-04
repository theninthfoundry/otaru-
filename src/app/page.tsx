import React from 'react';
import { HeldHero } from '@/components/home/HeldHero';
import { BatchSection } from '@/components/home/BatchSection';
import { ChaptersScrollSnap } from '@/components/home/ChaptersScrollSnap';
import { MaterialMacroSection } from '@/components/home/MaterialMacroSection';
import { StudioStorySection } from '@/components/home/StudioStorySection';
import { JournalThreeCards } from '@/components/home/JournalThreeCards';
import { CircleEmailSection } from '@/components/home/CircleEmailSection';

/**
 * Homepage (Refined 7-Movement Order per Prompt 4)
 * 1. Hero: "Held up to the window" (100svh backlit raw indigo cloth)
 * 2. This week's batch: 4 products in asymmetric 12-col layout
 * 3. Chapters: Full-width horizontal scroll-snap
 * 4. Material study: One focused interactive swatch with macro zoom
 * 5. Studio story: Quiet stone warehouse heritage
 * 6. Journal: 3 editorial field note cards
 * 7. Circle + email: Calm reservation
 */
export default function HomePage() {
  return (
    <>
      <HeldHero />
      <BatchSection />
      <ChaptersScrollSnap />
      <MaterialMacroSection />
      <StudioStorySection />
      <JournalThreeCards />
      <CircleEmailSection />
    </>
  );
}
