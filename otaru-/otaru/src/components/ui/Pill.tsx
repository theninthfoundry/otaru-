import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Pill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-caption tracking-widest uppercase text-foreground-muted",
        className
      )}
      {...props}
    />
  );
}
