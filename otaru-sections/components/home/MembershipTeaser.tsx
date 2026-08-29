import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, SectionTitle } from "@/components/ui/SectionHeading";

const TIERS = [
  { name: "Vanguard", desc: "Early access to new chapters, 48 hours before public release.", price: "Free with an account" },
  { name: "Archival", desc: "Everything in Vanguard, plus first refusal on restocks and a standing archive concierge.", price: "$120 / year" },
  { name: "Atelier", desc: "By application. Custom commissions, studio visits, and a seat at two fittings a year.", price: "By invitation" },
];

export function MembershipTeaser() {
  return (
    <section className="bg-[var(--otaru-ink)] py-[var(--space-section)]" aria-labelledby="membership-heading">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <Eyebrow>Archive access</Eyebrow>
          <SectionTitle>
            <span id="membership-heading">Three ways to keep the archive close.</span>
          </SectionTitle>
        </RevealOnScroll>

        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <RevealOnScroll key={tier.name} index={i}>
              <li className="list-none rounded-sm border border-[var(--otaru-line)] p-8 transition-colors hover:border-[var(--otaru-gold-dim)]">
                <h3 className="font-display text-xl text-[var(--otaru-parchment)]">{tier.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--otaru-parchment-dim)]">{tier.desc}</p>
                <p className="mt-4 text-[0.78rem] tracking-[0.06em] text-[var(--otaru-gold-dim)]">{tier.price}</p>
              </li>
            </RevealOnScroll>
          ))}
        </ul>

        <RevealOnScroll className="mt-10 text-center">
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] transition-[gap,border-color] hover:gap-3 hover:border-[var(--otaru-gold)]"
          >
            Compare tiers <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
