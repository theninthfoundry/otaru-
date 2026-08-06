import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "sold" | "new";
}

/** Used for "Archive Sold" / "Latest Chapter" style status labels. */
export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-caption tracking-wide uppercase",
        tone === "default" && "bg-surface-alt text-foreground-muted",
        tone === "sold" && "bg-otaru-ink text-otaru-chalk",
        tone === "new" && "bg-otaru-chalk text-otaru-ink border border-otaru-ink",
        className
      )}
      {...props}
    />
  );
}
