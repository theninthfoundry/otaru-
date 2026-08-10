"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NDEFReadingEventLike { message: { records: { recordType: string; data?: ArrayBuffer }[] } }
interface NDEFReaderLike {
  scan: () => Promise<void>;
  addEventListener: (type: "reading", listener: (event: NDEFReadingEventLike) => void) => void;
}

export function NfcScanButton() {
  const [status, setStatus] = useState<"idle" | "scanning" | "unsupported" | "error">(
    typeof window !== "undefined" && "NDEFReader" in window ? "idle" : "unsupported"
  );

  async function startScan() {
    setStatus("scanning");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reader = new (window as any).NDEFReader() as NDEFReaderLike;
      await reader.scan();
      reader.addEventListener("reading", (event) => {
        const textRecord = event.message.records.find((r) => r.recordType === "url" || r.recordType === "text");
        if (textRecord?.data) {
          const decoded = new TextDecoder().decode(textRecord.data);
          const serialMatch = decoded.match(/serial=([\w-]+)/);
          if (serialMatch) {
            window.location.href = `/verify?serial=${serialMatch[1]}`;
          }
        }
      });
    } catch {
      setStatus("error");
    }
  }

  if (status === "unsupported") return null;

  return (
    <div className="mt-4">
      <Button variant="secondary" onClick={startScan} disabled={status === "scanning"}>
        {status === "scanning" ? "Hold garment tag near device…" : "Tap to Verify (NFC)"}
      </Button>
      {status === "error" && <p className="mt-2 text-caption text-error">NFC scan failed or was cancelled.</p>}
    </div>
  );
}
