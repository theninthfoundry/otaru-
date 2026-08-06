import Image from "next/image";
import { formatMoney } from "@/lib/utils";
import type { CartLine } from "@/types/shopify";

export function CartItem({ line }: { line: CartLine }) {
  const image = line.merchandise.product.images[0];
  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {image && (
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-surface-alt">
          <Image src={image.url} alt={image.altText ?? line.merchandise.product.title} fill sizes="80px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-body-sm">{line.merchandise.product.title}</p>
          <p className="text-caption text-foreground-muted">{line.merchandise.title} · Qty {line.quantity}</p>
        </div>
        <p className="text-body-sm">{formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</p>
      </div>
    </div>
  );
}
