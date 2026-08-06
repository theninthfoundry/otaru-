import { formatMoney } from "@/lib/utils";
import type { Artifact } from "@/types/shopify";
import { cn } from "@/lib/utils";

export function ArtifactPrice({ artifact, className }: { artifact: Artifact; className?: string }) {
  const { minVariantPrice } = artifact.priceRange;
  const compareAt = artifact.variants.find((v) => v.compareAtPrice)?.compareAtPrice;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-body-md">{formatMoney(minVariantPrice.amount, minVariantPrice.currencyCode)}</span>
      {compareAt && (
        <span className="text-body-sm text-foreground-muted line-through">
          {formatMoney(compareAt.amount, compareAt.currencyCode)}
        </span>
      )}
    </div>
  );
}
