import Link from "next/link";
import { getArtifacts } from "@/lib/shopify";
import { getChapters, getJournalEntries } from "@/lib/sanity";
import { ArtifactCard } from "@/components/artifact/ArtifactCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { ChapterSpotlight } from "@/components/home/ChapterSpotlight";
import { JournalCard } from "@/components/journal/JournalCard";
import { SplitText } from "@/components/animations/SplitText";

export default async function HomePage() {
  const [artifacts, chapters, journal] = await Promise.all([getArtifacts(), getChapters(), getJournalEntries()]);
  const latestChapter = chapters[0];

  return (
    <>
      <section className="otaru-container flex min-h-screen flex-col justify-end pb-16 pt-40">
        <h1 className="max-w-4xl font-display text-display-xl leading-tight tracking-tighter">
          <SplitText text="Garments worth keeping." />
        </h1>
        <p className="mt-6 max-w-md text-body-lg text-foreground-muted">
          An editorial archive of numbered Chapters — not seasonal collections.
        </p>
      </section>

      <ManifestoSection />

      {latestChapter && <ChapterSpotlight chapter={latestChapter} />}

      <section className="otaru-container py-24">
        <SectionHeading eyebrow="Latest Chapter" title="Recent Artifacts" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {artifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
        <Link href="/archive" className="mt-12 inline-block text-body-sm underline underline-offset-4">
          View full Archive →
        </Link>
      </section>

      {journal.length > 0 && (
        <section className="otaru-container py-24">
          <SectionHeading eyebrow="Journal" title="From the Studio" />
          <div className="grid gap-8 md:grid-cols-3">
            {journal.map((entry) => (
              <JournalCard key={entry._id} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
