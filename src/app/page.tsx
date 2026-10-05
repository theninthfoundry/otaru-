import React from 'react';
import { HeldHero } from '@/components/home/HeldHero';
import { ObjectReveal } from '@/components/home/ObjectReveal';
import { BatchSection } from '@/components/home/BatchSection';
import { MaterialMacroSection } from '@/components/home/MaterialMacroSection';
import { WhyThisObject } from '@/components/home/WhyThisObject';
import { ChaptersScrollSnap } from '@/components/home/ChaptersScrollSnap';
import { StudioStorySection } from '@/components/home/StudioStorySection';
import { ObjectLifeTimeline } from '@/components/home/ObjectLifeTimeline';
import { PermanentArchiveCta } from '@/components/home/PermanentArchiveCta';
import { JournalThreeCards } from '@/components/home/JournalThreeCards';
import { MadeToRemain } from '@/components/home/MadeToRemain';
import { CircleEmailSection } from '@/components/home/CircleEmailSection';

/**
 * Homepage (12 Movement Sequenced Experience)
 * 
 * Psychological Arc: ATMOSPHERE → DISCOVERY → DESIRE → PROOF → PURCHASE
 * 
 * 01. Hero: "The mountain remembers." (Cinematic backlit living cloth surface)
 * 02. Signature Object Reveal: Object 041 Yama Field Jacket quiet emergence
 * 03. Current Batch: Asymmetric 4-object editorial allocation
 * 04. Material Study: Interactive macro fiber & weave zone exploration
 * 05. Why This Object Exists: Uncompromising material & architectural justification
 * 06. Chapter Worlds: Seasonal archives in horizontal scroll sequence
 * 07. Studio & Hands: 1907 Otaru canal stone warehouse, living dye vats & artisans
 * 08. Object Life Timeline: Day 01 → Year 05 patina and boro mending lifecycle
 * 09. Permanent Archive: Complete 10-piece historical ledger invitation
 * 10. Studio Journal: Field notes bridging craft philosophy to physical garments
 * 11. Made to Remain: Lifetime canal studio repair ledger commitment
 * 12. The Circle: Calm priority cutting reservation
 */
export default function HomePage() {
  return (
    <>
      <HeldHero />
      <ObjectReveal />
      <BatchSection />
      <MaterialMacroSection />
      <WhyThisObject />
      <ChaptersScrollSnap />
      <StudioStorySection />
      <ObjectLifeTimeline />
      <PermanentArchiveCta />
      <JournalThreeCards />
      <MadeToRemain />
      <CircleEmailSection />
    </>
  );
}
