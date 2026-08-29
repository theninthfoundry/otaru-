import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle, SectionLede } from "@/components/ui/SectionHeading";

/**
 * NewDrops
 * -----------------------------------------------------------------
 * Replace `DROPS` with the real query — most likely your existing
 * Shopify/Sanity fetch for the latest N artifacts, sorted by release
 * date. Kept as static data here so this drops in without a data
 * layer dependency; wire it up in your server component.
 */
type Artifact = {
  catalogNo: string;
  name: string;
  material: string;
  price: string;
  href: string;
};

const DROPS: Artifact[] = [
  { catalogNo: "No. 041", name: "Yama Field Jacket", material: "Raw indigo canvas", price: "$480", href: "/archive/yama-field-jacket" },
  { catalogNo: "No. 042", name: "Kiryū Wrap Trouser", material: "Washed silk blend", price: "$310", href: "/archive/kiryu-wrap-trouser" },
  { catalogNo: "No. 043", name: "Biratori Overshirt", material: "Boiled wool", price: "$395", href: "/archive/biratori-overshirt" },
  { catalogNo: "No. 044", name: "Ōmi Hemp Tote", material: "Raw hemp canvas", price: "$165", href: "/archive/omi-hemp-tote" },
];

export function NewDrops() {
  return (
    <section className="bg-[var(--otaru-ink)] py-[var(--space-section)]" aria-labelledby="new-drops-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Eyebrow>Archive entry — releasing now</Eyebrow>
              <SectionTitle>
                <span id="new-drops-heading">What arrived this week.</span>
              </SectionTitle>
            </div>
            <SectionLede>
              Four pieces, cut and dyed between the last full moon and this one. Once the run is gone, it does not return.
            </SectionLede>
          </div>
        </RevealOnScroll>

        <ul className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {DROPS.map((item, i) => (
            <RevealOnScroll key={item.catalogNo} index={i}>
              <li className="list-none">
                <Link href={item.href} className="group block">
                  <ImagePlaceholder ratio="portrait" label={`Artifact ${item.catalogNo.replace("No. ", "")} — 1200×1500`} />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.66rem] tracking-[0.1em] text-[var(--otaru-gold-dim)]">{item.catalogNo}</span>
                    <span className="rounded-full border border-[var(--otaru-torii)] px-2 py-0.5 text-[0.62rem] tracking-[0.1em] text-[var(--otaru-torii)]">
                      New
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-[1.15rem] text-[var(--otaru-parchment)]">{item.name}</h3>
                  <div className="mt-1 flex justify-between text-sm text-[var(--otaru-parchment-dim)]">
                    <span>{item.material}</span>
                    <span>{item.price}</span>
                  </div>
                </Link>
              </li>
            </RevealOnScroll>
          ))}
        </ul>

        <RevealOnScroll className="mt-12 text-center">
          <Link
            href="/archive?sort=new"
            className="inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] transition-[gap,border-color] hover:gap-3 hover:border-[var(--otaru-gold)]"
          >
            View the full drop <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
