import { notFound } from "next/navigation";
import { getArtifactByHandle, getArtifacts } from "@/lib/shopify";
import { ArtifactGallery } from "@/components/artifact/ArtifactGallery";
import { ArtifactVariants } from "@/components/artifact/ArtifactVariants";
import { ArtifactPrice } from "@/components/artifact/ArtifactPrice";
import { ProductAccordion } from "@/components/artifact/ProductAccordion";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Artifact3DViewer } from "@/components/three/Artifact3DViewer";
import { CompleteTheLook } from "@/components/artifact/CompleteTheLook";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const artifact = await getArtifactByHandle(handle);
  return { title: artifact ? `${artifact.title} — Otaru` : "Artifact — Otaru" };
}

export async function generateStaticParams() {
  const artifacts = await getArtifacts();
  return artifacts.map((a) => ({ handle: a.handle }));
}

export default async function ArtifactPage({ params }: PageProps) {
  const { handle } = await params;
  const [artifact, allArtifacts] = await Promise.all([getArtifactByHandle(handle), getArtifacts()]);
  if (!artifact) notFound();

  const completeTheLook = allArtifacts.filter((a) => a.handle !== artifact.handle).slice(0, 4);

  return (
    <>
      <div className="otaru-container grid gap-12 pt-36 pb-24 md:grid-cols-2">
        <div className="relative">
          {/* Desktop-only ambient 3D canvas; CanvasWrapper self-hides on mobile/reduced-motion. */}
          <Artifact3DViewer className="pointer-events-none absolute -inset-8 -z-10 opacity-40" />
          <ArtifactGallery images={artifact.images} title={artifact.title} />
        </div>

        <div className="md:sticky md:top-32 md:self-start">
          <p className="otaru-eyebrow mb-2">{artifact.vendor}</p>
          <h1 className="font-display text-display-md mb-4">{artifact.title}</h1>
          <ArtifactPrice artifact={artifact} className="mb-8" />

          <ArtifactVariants artifact={artifact} />

          <div className="mt-4">
            <WishlistButton handle={artifact.handle} />
          </div>

          <div className="mt-12">
            <ProductAccordion artifact={artifact} />
          </div>
        </div>
      </div>

      <CompleteTheLook artifacts={completeTheLook} />
    </>
  );
}
