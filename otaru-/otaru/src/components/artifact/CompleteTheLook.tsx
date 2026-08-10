import type { Artifact } from "@/types/shopify";
import { ArtifactCard } from "./ArtifactCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** LV/Palm Angels editorial cross-sell — styled pairings, not a generic "related products" algorithm dump. */
export function CompleteTheLook({ artifacts }: { artifacts: Artifact[] }) {
  if (artifacts.length === 0) return null;

  return (
    <section className="otaru-container py-24 border-t border-border">
      <SectionHeading eyebrow="Styled Together" title="Complete the Look" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {artifacts.map((artifact) => (
          <ArtifactCard key={artifact.id} artifact={artifact} />
        ))}
      </div>
    </section>
  );
}
