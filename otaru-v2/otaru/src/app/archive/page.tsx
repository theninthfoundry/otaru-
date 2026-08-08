import { getArtifacts } from "@/lib/shopify";
import { ArchiveGrid } from "@/components/artifact/ArchiveGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = { title: "Archive — Otaru" };

export default async function ArchivePage() {
  const artifacts = await getArtifacts();

  return (
    <div className="otaru-container pt-32 pb-24">
      <SectionHeading eyebrow="Full Catalog" title="Archive" />
      <ArchiveGrid artifacts={artifacts} />
    </div>
  );
}
