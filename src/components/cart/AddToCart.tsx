"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "./CartContext";

export function AddToCart({ merchandiseId, disabled }: { merchandiseId: string | null; disabled?: boolean }) {
  const { addItem, isPending } = useCart();

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
