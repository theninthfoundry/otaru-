"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart-store";

export function AddToCart({ merchandiseId, disabled }: { merchandiseId: string | null; disabled?: boolean }) {
  const { addItem, isPending } = useCartStore((s) => ({ addItem: s.addItem, isPending: s.isPending }));

  return (
    <Button
      className="w-full"
      disabled={disabled || !merchandiseId || isPending}
      onClick={() => merchandiseId && addItem(merchandiseId)}
    >
      {disabled ? "Archive Sold" : isPending ? "Adding…" : "Add to Bag"}
    </Button>
  );
}
