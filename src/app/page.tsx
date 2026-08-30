import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { NewDrops } from '@/components/home/NewDrops';
import { ChapterShowcase } from '@/components/home/ChapterShowcase';
import { ArchiveTeaser } from '@/components/home/ArchiveTeaser';
import { StoryJourney } from '@/components/home/StoryJourney';
import { Craftsmanship } from '@/components/home/Craftsmanship';
import { Philosophy } from '@/components/home/Philosophy';
import { MembershipTeaser } from '@/components/home/MembershipTeaser';
import { JournalTeaser } from '@/components/home/JournalTeaser';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Otaru — Living Image Archive',
  description:
    'The mountain remembers. A world of water, timber, cloth, and the objects that pass through it.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="section-connector" />
      <NewDrops />
      <div className="section-connector" />
      <ChapterShowcase />
      <div className="section-connector" />
      <ArchiveTeaser />
      <div className="section-connector" />
      <StoryJourney />
      <Craftsmanship />
      <Philosophy />
      <div className="section-connector" />
      <MembershipTeaser />
      <div className="section-connector" />
      <JournalTeaser />
      <div className="section-connector" />
      <NewsletterSignup />
    </>
  );
}
