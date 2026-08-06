"use client";

export function Marquee({ text, speedSeconds = 22 }: { text: string; speedSeconds?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-border py-4">
      <div
        className="inline-block animate-[otaru-marquee_var(--marquee-duration)_linear_infinite]"
        style={{ ["--marquee-duration" as string]: `${speedSeconds}s` }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-8 font-display text-display-sm">
            {text}
          </span>
        ))}
      </div>
      <style jsx global>{`
        @keyframes otaru-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
