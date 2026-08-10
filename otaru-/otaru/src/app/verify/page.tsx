import { AuthenticityCard } from "@/components/verify/AuthenticityCard";
import { NfcScanButton } from "@/components/verify/NfcScanButton";

export const metadata = { title: "Verify Authenticity — Otaru" };

interface PageProps {
  searchParams: Promise<{ serial?: string }>;
}

export default async function VerifyPage({ searchParams }: PageProps) {
  const { serial } = await searchParams;

  return (
    <div className="otaru-container pt-36 pb-24">
      <p className="otaru-eyebrow mb-4">Provenance</p>
      <h1 className="font-display text-display-lg mb-4 max-w-2xl">Verify Authenticity</h1>
      <p className="max-w-lg text-body-md text-foreground-muted mb-8">
        Every Artifact carries a unique serial number. Enter it below, or tap your garment's NFC tag
        on a supported Android device, to view its digital Certificate of Authenticity.
      </p>
      <NfcScanButton />
      <div className="mt-8">
        <AuthenticityCard initialSerial={serial} />
      </div>
    </div>
  );
}
