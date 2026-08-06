import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const TIERS = [
  { name: "Vanguard", description: "Early access to Chapter drops and Journal previews.", perks: ["48-hour early Drop access", "Journal previews"] },
  { name: "Archival", description: "For collectors — provenance history and archive-only re-releases.", perks: ["Archive-only re-releases", "Provenance history access", "Vanguard perks"] },
  { name: "Atelier", description: "Direct line to the design studio, including bespoke commissions.", perks: ["Bespoke commission requests", "Studio visits by invitation", "Archival perks"] },
];

export const metadata = { title: "Membership — Otaru" };

export default function MembershipPage() {
  return (
    <div className="otaru-container pt-32 pb-24">
      <SectionHeading eyebrow="Private Access" title="Membership" />
      <div className="grid gap-8 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-sm border border-border p-8 flex flex-col">
            <h3 className="font-display text-display-sm mb-3">{tier.name}</h3>
            <p className="text-body-sm text-foreground-muted mb-6 flex-1">{tier.description}</p>
            <ul className="space-y-2 mb-8 text-body-sm">
              {tier.perks.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
            <Button variant="secondary">Request Access</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
