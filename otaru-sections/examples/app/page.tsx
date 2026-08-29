/**
 * Example homepage composition.
 * -----------------------------------------------------------------
 * Drop your existing <Hero /> in exactly as it is today — nothing
 * about it changes. Everything below it is new. Reorder freely;
 * this is the sequence used in preview.html.
 */
import { Hero } from "@/components/home/Hero"; // your existing component — untouched
import { NewDrops } from "@/components/home/NewDrops";
import { ChapterShowcase } from "@/components/home/ChapterShowcase";
import { ArchiveTeaser } from "@/components/home/ArchiveTeaser";
import { StoryJourney } from "@/components/home/StoryJourney";
import { Craftsmanship } from "@/components/home/Craftsmanship";
import { Philosophy } from "@/components/home/Philosophy";
import { MembershipTeaser } from "@/components/home/MembershipTeaser";
import { JournalTeaser } from "@/components/home/JournalTeaser";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewDrops />
      <ChapterShowcase />
      <ArchiveTeaser />
      <StoryJourney />
      <Craftsmanship />
      <Philosophy />
      <MembershipTeaser />
      <JournalTeaser />
      <NewsletterSignup />
    </>
  );
}
