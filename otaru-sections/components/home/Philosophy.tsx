import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Philosophy() {
  return (
    <section
      className="border-y border-[var(--otaru-line)] py-[var(--space-section)] text-center"
      style={{ background: "linear-gradient(180deg,#0e1c2c,#0b1420)" }}
      aria-label="Studio philosophy"
    >
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <RevealOnScroll>
          <blockquote className="mx-auto max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,2.7rem)] font-normal italic leading-[1.4] text-[var(--otaru-parchment)]">
            &ldquo;We are not making clothes for a season. We are making objects that remember the day you bought
            them.&rdquo;
          </blockquote>
          <cite className="mt-6 block text-[0.72rem] not-italic uppercase tracking-[0.14em] text-[var(--otaru-gold-dim)]">
            — The Studio, MMXXVI
          </cite>
        </RevealOnScroll>
      </div>
    </section>
  );
}
