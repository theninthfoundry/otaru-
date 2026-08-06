import type { Metadata } from 'next';
import { AuthenticityCard } from '@/components/provenance/authenticity-card';
import { NfcScanner } from '@/components/provenance/nfc-scanner';

export const metadata: Metadata = {
  title: 'Garment Authenticity Verification — Otaru',
  description: 'Verify the authenticity, serial number, and textile provenance of your Otaru garments.',
};

interface VerifyPageProps {
  searchParams: Promise<{ serial?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { serial } = await searchParams;
  const serialQuery = serial?.trim() || '';

  return (
    <section id="verify" aria-label="Authenticity Verification" className="py-12 md:py-20">
      <div className="grid-container max-w-3xl space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
            Archival Provenance
          </p>
          <h1 className="text-display-lg font-bold tracking-tight text-otaru-ink">
            Authenticity Verification
          </h1>
          <p className="text-body-lg text-otaru-ink-muted font-light leading-relaxed">
            Every Otaru garment is issued a unique archival serial number and physical NFC tag. Tap below or enter your code to inspect certificate details.
          </p>
        </header>

        {/* 1. Web NFC Direct Scan Module */}
        <NfcScanner />

        {/* 2. Manual Verification Query Form */}
        <form action="/verify" method="GET" className="flex flex-col sm:flex-row gap-3">
          <input
            name="serial"
            type="text"
            defaultValue={serialQuery}
            placeholder="Enter Serial Number (e.g. OTARU-007-104)"
            className="flex-1 bg-otaru-cream/50 border border-otaru-border rounded-full px-5 py-3 text-body-sm font-mono focus:outline-none focus:border-otaru-ink"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-otaru-ink text-otaru-chalk text-body-sm font-medium rounded-full hover:bg-otaru-ink-muted transition-colors shrink-0"
          >
            Verify Serial
          </button>
        </form>

        {/* Certificate Result */}
        {serialQuery ? (
          <AuthenticityCard
            serialNumber={serialQuery.toUpperCase()}
            artifactName="&ldquo;The Observer&rdquo; Heavy Hoodie"
            artifactNumber="007"
            gsm="420 GSM French Terry"
            wash="Reactive Garment Dye · Silicone Wash"
            construction="Triple Needle Construction"
            productionBatch="Batch 01 of 150 Units"
            issuedDate="2026"
          />
        ) : (
          <div className="p-8 bg-otaru-cream/30 border border-otaru-border/40 rounded-sm text-center space-y-2">
            <span className="text-caption text-xs font-medium text-otaru-ink block">
              Sample Serial Code: <code className="font-mono">OTARU-007-104</code>
            </span>
            <p className="text-caption text-xs text-otaru-ink-muted">
              Located on the interior care label of your garment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
