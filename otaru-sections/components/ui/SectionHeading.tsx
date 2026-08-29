import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--otaru-gold-dim)] before:h-px before:w-[1.1em] before:bg-[var(--otaru-gold-dim)] before:content-['']">
      {children}
    </span>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-3 max-w-[18ch] font-display text-[clamp(2rem,4.2vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.01em] text-[var(--otaru-parchment)] ${className ?? ""}`}>
      {children}
    </h2>
  );
}

export function SectionLede({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-[var(--otaru-parchment-dim)]">
      {children}
    </p>
  );
}
