import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const TEAM = [
  { name: "Aiko Nakamura", role: "Dye master — 11 years" },
  { name: "Ren Takahashi", role: "Pattern cutting — 9 years" },
  { name: "Sana Miyazaki", role: "Finishing & repair — 11 years" },
  { name: "Jun Watanabe", role: "Studio lead — 14 years" },
];

export function TeamGrid() {
  return (
    <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
      {TEAM.map((person) => (
        <li key={person.name} className="list-none">
          <ImagePlaceholder ratio="square" label="Portrait" className="rounded-full" />
          <p className="mt-3 text-sm text-[var(--otaru-parchment)]">{person.name}</p>
          <p className="mt-0.5 text-[0.76rem] text-[var(--otaru-parchment-dim)]">{person.role}</p>
        </li>
      ))}
    </ul>
  );
}
