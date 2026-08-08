import { Accordion } from "@/components/ui/Accordion";
import type { Artifact } from "@/types/shopify";

export function ProductAccordion({ artifact }: { artifact: Artifact }) {
  return (
    <Accordion
      items={[
        {
          id: "description",
          title: "Description",
          content: <div dangerouslySetInnerHTML={{ __html: artifact.descriptionHtml }} />,
        },
        {
          id: "construction",
          title: "Fabric & Construction",
          content: "Full material composition and construction notes are published per-Artifact in the Studio material library.",
        },
        {
          id: "provenance",
          title: "Provenance",
          content: `Designed and produced under the ${artifact.vendor} atelier. Each unit is serialized — verify authenticity at /verify.`,
        },
        {
          id: "fit",
          title: "Size & Fit Guide",
          content: "True to size. For a relaxed drape, size up. Full measurements available on request.",
        },
      ]}
    />
  );
}
