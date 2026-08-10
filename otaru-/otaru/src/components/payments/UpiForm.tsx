"use client";

import { useState } from "react";

/** UPI (India) — VPA entry or QR fallback, the dominant checkout method in the Indian market alongside COD. */
export function UpiForm() {
  const [vpa, setVpa] = useState("");
  const isValid = /^[\w.-]+@[\w.-]+$/.test(vpa);

  return (
    <div className="space-y-4">
      <input
        placeholder="yourname@upi"
        value={vpa}
        onChange={(e) => setVpa(e.target.value)}
        className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink"
      />
      {vpa && !isValid && <p className="text-caption text-error">Enter a valid UPI ID (e.g. name@bank).</p>}
      <p className="text-caption text-foreground-muted">
        You'll receive a payment request on your UPI app to approve. Or scan the QR code shown after you place the order.
      </p>
    </div>
  );
}
