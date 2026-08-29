/**
 * ImagePlaceholder
 * -----------------------------------------------------------------
 * Stands in for every photographic asset in the new sections below.
 * Swap it for a real <Image /> once art is ready — same aspect ratio
 * prop names are used across every section so the layout won't shift.
 *
 * Usage:
 *   <ImagePlaceholder ratio="portrait" label="Artifact 041 — 1200×1500" />
 *
 * When you have the real asset:
 *   <Image src={artifact.image} alt={artifact.name} fill
 *          className="object-cover" sizes="(min-width:1024px) 25vw, 50vw" />
 */
import { clsx } from "clsx"; // drop this import if your repo doesn't use clsx — replace with template strings
import type { ReactNode } from "react";

const RATIOS = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  wide: "aspect-video",
  tall: "aspect-[3/4]",
  swatch: "aspect-square rounded-sm",
} as const;

type Ratio = keyof typeof RATIOS;

export function ImagePlaceholder({
  ratio = "portrait",
  label,
  className,
  children,
}: {
  ratio?: Ratio;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label ? `Image placeholder: ${label}` : "Image placeholder"}
      className={clsx(
        RATIOS[ratio],
        "relative overflow-hidden border border-[var(--otaru-line)]",
        "bg-[linear-gradient(160deg,var(--otaru-dusk-2),var(--otaru-dusk))]",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(244,239,226,.05) 0 2px, transparent 2px 14px), linear-gradient(160deg, var(--otaru-dusk-2), var(--otaru-dusk))",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-[var(--otaru-line-strong)]"
      >
        ◇
      </span>
      {label && (
        <span className="absolute inset-x-3 bottom-3 font-body text-[0.62rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment-dim)]">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
