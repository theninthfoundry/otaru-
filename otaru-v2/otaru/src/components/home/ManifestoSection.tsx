import { RevealText } from "@/components/animations/RevealText";

export function ManifestoSection() {
  return (
    <section className="otaru-container py-24 md:py-32">
      <RevealText>
        <p className="otaru-eyebrow mb-6">Studio Manifesto</p>
      </RevealText>
      <RevealText delay={0.1}>
        <p className="max-w-3xl font-display text-display-md leading-tight">
          We do not chase seasons. Every Artifact is designed with architectural precision, premium
          textiles, and permanent intention — built to be worn for a decade, not a quarter.
        </p>
      </RevealText>
    </section>
  );
}
