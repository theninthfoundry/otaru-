import Link from "next/link";
import Image from "next/image";
import type { Artifact } from "@/types/shopify";
import { ArtifactPrice } from "./ArtifactPrice";
import { Badge } from "@/components/ui/Badge";

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const image = artifact.images[0];

  return (
    <Link href={`/artifact/${artifact.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-alt">
        {image && (
          <Image
            src={image.url}
            alt={image.altText ?? artifact.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-2 ease-out-expo group-hover:scale-[1.03]"
          />
        )}
        {!artifact.availableForSale && (
          <Badge tone="sold" className="absolute left-3 top-3">
            Archive Sold
          </Badge>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-body-md tracking-tight">{artifact.title}</h3>
        <ArtifactPrice artifact={artifact} />
      </div>
    </Link>
  );
}
