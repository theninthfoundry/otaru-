import { AuthenticityCard } from "@/components/verify/AuthenticityCard";

export const metadata = { title: "Verify Authenticity — Otaru" };

export default function VerifyPage() {
  return (
    <div className="otaru-container pt-32 pb-24">
      <p className="otaru-eyebrow mb-4">Provenance</p>
      <h1 className="font-display text-display-lg mb-4 max-w-2xl">Verify Authenticity</h1>
      <p className="max-w-lg text-body-md text-foreground-muted mb-12">
        Every Artifact carries a unique serial number. Enter it below, or tap your garment's NFC tag
        on a supported device, to view its digital Certificate of Authenticity.
      </p>
      <AuthenticityCard />
      <p className="mt-8 text-caption text-foreground-muted max-w-md">
        Roadmap: direct Web NFC tap-to-verify is planned for Phase 3 — see the architecture report.
      </p>
    </div>
  );
}
