import { getJournalEntries } from "@/lib/sanity";
import { JournalCard } from "@/components/journal/JournalCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = { title: "Journal — Otaru" };

export default async function JournalIndexPage() {
  const entries = await getJournalEntries();

  return (
    <div className="otaru-container pt-36 pb-24">
      <SectionHeading eyebrow="Editorial" title="Journal" />
      <div className="grid gap-8 md:grid-cols-3">
        {entries.map((entry) => (
          <JournalCard key={entry._id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
