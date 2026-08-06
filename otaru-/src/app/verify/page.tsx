import type { Metadata } from 'next';
import { AuthenticityCard } from '@/components/provenance/authenticity-card';
import { NfcScanner } from '@/components/provenance/nfc-scanner';

export const metadata: Metadata = {
  title: 'Garment Authenticity Verification — Otaru',
  description: 'Verify the authenticity, serial number, and textile provenance of your Otaru garments.',
};

import { getProducts } from '@/lib/shopify/queries/products';

interface VerifyPageProps {
  searchParams: Promise<{ serial?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { serial } = await searchParams;
  const serialQuery = serial?.trim() || '';

  // 1. Fetch active artifacts (automatically falls back to mocks if Shopify is offline)
  const { artifacts } = await getProducts({ first: 50 }).catch(() => ({ artifacts: [], pageInfo: { hasNextPage: false, endCursor: null } }));

  let matchedArtifact = null;
  let unitNumber = '';
  let isValidFormat = false;
  let artifactNumStr = '';

  const match = serialQuery.match(/^OTARU-(\d{3})-(\d{1,4})$/i);
  if (match) {
    isValidFormat = true;
    artifactNumStr = match[1];
    unitNumber = parseInt(match[2], 10).toString();

    const targetNum = parseInt(artifactNumStr, 10);

    matchedArtifact = artifacts.find(art => {
      // Check ID segment
      const idPart = art.id.split('/').pop() || '';
      const cleanId = idPart.replace(/\D/g, '');
      const cleanIdNum = parseInt(cleanId, 10);

      // Check pattern in title or handle
      const hasNumberInHandle = art.handle.includes(`-${artifactNumStr}-`) || art.handle.endsWith(`-${artifactNumStr}`);
      const hasNumberInTitle = art.title.includes(`#${artifactNumStr}`) || art.title.includes(`#${targetNum}`);

      return cleanIdNum === targetNum || hasNumberInHandle || hasNumberInTitle;
    });
  }

  // Helper to clean up titles for the certificate
  const getCleanTitle = (title: string) => {
    return title.replace(/^Artifact\s+#\d+\s+—\s+/i, '');
  };

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
          isValidFormat && matchedArtifact ? (
            <AuthenticityCard
              serialNumber={serialQuery.toUpperCase()}
              artifactName={getCleanTitle(matchedArtifact.title)}
              artifactNumber={artifactNumStr}
              gsm={matchedArtifact.metafields?.materialComposition || 'Premium Textile Blend'}
              wash={matchedArtifact.metafields?.careInstructions || 'Dry Clean Suggested'}
              construction={matchedArtifact.metafields?.provenanceCountry || 'Handcrafted Design'}
              productionBatch={`Unit ${unitNumber.padStart(3, '0')} of ${matchedArtifact.metafields?.editionSize || 100} (Chapter ${matchedArtifact.metafields?.chapterNumber || '01'})`}
              issuedDate={new Date(matchedArtifact.createdAt || '2026-01-01').getFullYear().toString()}
            />
          ) : (
            <div className="p-8 bg-red-50/50 border border-red-200 rounded-sm text-center space-y-3 animate-fadeIn">
              <span className="text-body-sm font-semibold text-red-800 block">
                Unverified Serial Document
              </span>
              <p className="text-caption text-xs text-red-700 max-w-md mx-auto">
                The serial number <code className="font-mono bg-red-100/50 px-1 py-0.5 rounded-xs font-bold text-red-900">{serialQuery.toUpperCase()}</code> could not be located in Otaru&rsquo;s official registry. Please confirm the code printed on the care tag inside the garment.
              </p>
            </div>
          )
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
