const MILESTONES = [
  { year: "1907", text: "The Otaru harbor warehouse is built to store coal and herring bound for Honshu." },
  { year: "2015", text: "The warehouse sits empty for the third year running. The studio's founders lease it for storage." },
  { year: "2018", text: "First run: eleven jackets, sold at a single trunk show in Sapporo." },
  { year: "2021", text: "The studio moves its dye work in-house, drawing water from the original harbor canal." },
  { year: "2026", text: "Chapter III releases. The archive passes 400 cataloged objects." },
];

export function Timeline() {
  return (
    <ol className="mt-10 border-l border-[var(--otaru-line)]">
      {MILESTONES.map((m) => (
        <li key={m.year} className="relative pb-10 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--otaru-gold)]"
          />
          <span className="font-display text-lg italic text-[var(--otaru-gold)]">{m.year}</span>
          <p className="mt-1.5 max-w-[52ch] leading-relaxed text-[var(--otaru-parchment-dim)]">{m.text}</p>
        </li>
      ))}
    </ol>
  );
}
