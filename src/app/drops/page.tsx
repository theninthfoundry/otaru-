import { DropCountdown } from "@/components/drops/DropCountdown";
import { WaitlistForm } from "@/components/drops/WaitlistForm";

export const metadata = { title: "Drops — Otaru" };

// Roadmap note: real drop schedule should come from Sanity once a `drop`
// schema exists; hardcoded here as the scaffold's single upcoming drop.
const NEXT_DROP = { slug: "chapter-03-priority-access", date: "2026-09-15T17:00:00Z", title: "Chapter 03 — Priority Access" };

export default function DropsPage() {
  return (
    <div className="otaru-container pt-32 pb-24">
      <p className="otaru-eyebrow mb-4">Limited Access</p>
      <h1 className="font-display text-display-lg mb-12 max-w-2xl">{NEXT_DROP.title}</h1>
      <DropCountdown dropDate={NEXT_DROP.date} />
      <div className="mt-16">
        <WaitlistForm dropSlug={NEXT_DROP.slug} />
      </div>
    </div>
  );
}
