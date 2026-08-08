interface AuthenticityCardProps {
  serialNumber: string;
  artifactName: string;
  artifactNumber?: string;
  gsm?: string;
  wash?: string;
  construction?: string;
  productionBatch?: string;
  issuedDate?: string;
}

export function AuthenticityCard({
  serialNumber,
  artifactName,
  artifactNumber = '007',
  gsm = '420 GSM Heavy French Terry',
  wash = 'Reactive Garment Dye · Silicone Wash',
  construction = 'Triple Needle Construction',
  productionBatch = 'Batch 01 of 150',
  issuedDate = 'MMXXIV',
}: AuthenticityCardProps) {
  return (
    <div className="relative bg-otaru-chalk border-2 border-otaru-ink p-8 md:p-12 rounded-sm space-y-8 max-w-2xl mx-auto shadow-xl font-sans animate-fadeIn">
      <div className="flex items-center justify-between border-b-2 border-otaru-ink pb-6">
        <div className="space-y-1">
          <span className="text-overline uppercase tracking-widest text-otaru-ink font-bold text-[11px] block">
            Official Registry Document
          </span>
          <h3 className="text-display-sm font-bold tracking-tight text-otaru-ink">
            Certificate of Authenticity
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-otaru-ink flex items-center justify-center font-mono font-bold text-xs shrink-0">
          OTARU
        </div>
      </div>

      <div className="bg-otaru-cream/80 border border-otaru-border p-4 text-center rounded-xs space-y-1">
        <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[9px] block">
          Unique Archival Serial Number
        </span>
        <span className="text-heading-md font-mono font-bold tracking-widest text-otaru-ink block">
          {serialNumber}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-caption text-xs border-y border-otaru-border/40 py-6">
        <div>
          <span className="text-otaru-ink-subtle uppercase text-[10px] block">Garment Name</span>
          <span className="font-semibold text-otaru-ink text-body-sm">{artifactName}</span>
        </div>
        <div>
          <span className="text-otaru-ink-subtle uppercase text-[10px] block">Artifact Catalog</span>
          <span className="font-mono text-otaru-ink text-body-sm">Artifact {artifactNumber}</span>
        </div>
        <div>
          <span className="text-otaru-ink-subtle uppercase text-[10px] block">Textile Spec</span>
          <span className="font-medium text-otaru-ink">{gsm}</span>
        </div>
        <div>
          <span className="text-otaru-ink-subtle uppercase text-[10px] block">Wash & Treatment</span>
          <span className="font-medium text-otaru-ink">{wash}</span>
        </div>
        <div>
          <span className="text-otaru-ink-subtle uppercase text-[10px] block">Tailoring Standard</span>
          <span className="font-medium text-otaru-ink">{construction}</span>
        </div>
        <div>
          <span className="text-otaru-ink-subtle uppercase text-[10px] block">Production Sequence</span>
          <span className="font-mono text-otaru-ink">{productionBatch}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-caption text-xs text-otaru-ink-subtle pt-2">
        <span>Verified by Otaru Archival System</span>
        <span>Issued: {issuedDate}</span>
      </div>
    </div>
  );
}
