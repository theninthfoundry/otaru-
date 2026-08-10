"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

interface Certificate {
  serial: string;
  artifactTitle: string;
  productionBatch: string;
  artisanSignature: string;
  verifiedAt: string;
}

// Roadmap note: replace with a real lookup (Shopify metafield or dedicated
// authenticity service) keyed by serial/NFC tag once available.
async function mockVerify(serial: string): Promise<Certificate | null> {
  await new Promise((r) => setTimeout(r, 500));
  if (!serial.trim()) return null;
  return {
    serial,
    artifactTitle: "Raw Denim Chore Coat",
    productionBatch: "B-2026-03-014",
    artisanSignature: "R. Bose",
    verifiedAt: new Date().toISOString(),
  };
}

export function AuthenticityCard({ initialSerial }: { initialSerial?: string }) {
  const [serial, setSerial] = useState(initialSerial ?? "");
  const [cert, setCert] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isPending, startTransition] = useTransition();

  function runVerify(value: string) {
    startTransition(async () => {
      const result = await mockVerify(value);
      setCert(result);
      setNotFound(!result);
    });
  }

  // Auto-verify when arriving via an NFC tap (?serial=... in the URL).
  useEffect(() => {
    if (initialSerial) runVerify(initialSerial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSerial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runVerify(serial);
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Enter garment serial number"
          className="h-12 flex-1 rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
        />
        <Button type="submit" disabled={isPending}>{isPending ? "…" : "Verify"}</Button>
      </form>

      {notFound && <p className="text-body-sm text-error">No Artifact found for that serial number.</p>}

      {cert && (
        <div className="rounded-sm border border-border p-6 space-y-3">
          <p className="otaru-eyebrow">Certificate of Authenticity</p>
          <p className="font-display text-display-sm">{cert.artifactTitle}</p>
          <dl className="text-body-sm text-foreground-muted space-y-1">
            <div className="flex justify-between"><dt>Serial</dt><dd>{cert.serial}</dd></div>
            <div className="flex justify-between"><dt>Production Batch</dt><dd>{cert.productionBatch}</dd></div>
            <div className="flex justify-between"><dt>Artisan Signature</dt><dd>{cert.artisanSignature}</dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}
