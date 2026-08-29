import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

const MATERIALS = [
  { name: "Indigo cotton twill", origin: "Tokushima" },
  { name: "Raw hemp canvas", origin: "Ōmi" },
  { name: "Boiled wool", origin: "Biratori" },
  { name: "Washed silk", origin: "Kiryū" },
];

export function Craftsmanship() {
  return (
    <section className="border-t border-[var(--otaru-line)] bg-[var(--otaru-ink)] py-[var(--space-section)]" aria-labelledby="craft-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <Eyebrow>Materials on hand</Eyebrow>
          <SectionTitle className="max-w-[20ch]">
            <span id="craft-heading">Four materials, sourced by hand, this season.</span>
          </SectionTitle>
        </RevealOnScroll>

        <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {MATERIALS.map((m, i) => (
            <RevealOnScroll key={m.name} index={i}>
              <li className="list-none">
                <ImagePlaceholder ratio="swatch" label="Swatch" />
                <p className="mt-3 text-sm text-[var(--otaru-parchment)]">{m.name}</p>
                <p className="mt-0.5 text-[0.72rem] text-[var(--otaru-parchment-dim)]">{m.origin}</p>
              </li>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
