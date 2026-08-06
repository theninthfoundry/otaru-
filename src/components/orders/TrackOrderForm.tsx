"use client";

import { useState, useTransition } from "react";
import { trackOrderAction } from "@/actions/tracking";
import { Button } from "@/components/ui/Button";

export function TrackOrderForm() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof trackOrderAction>> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await trackOrderAction(value);
      setResult(res);
    });
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Order ID or AWB number"
          className="h-12 flex-1 rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
        />
        <Button type="submit" disabled={isPending}>{isPending ? "…" : "Track"}</Button>
      </form>

      {result && !result.success && <p className="text-body-sm text-error">{result.error}</p>}

      {result?.success && (
        <div className="space-y-4">
          <p className="text-body-md">Status: <span className="font-medium">{result.status}</span></p>
          <ol className="space-y-3 border-l border-border pl-4">
            {result.history?.map((h, i) => (
              <li key={i} className="text-body-sm">
                <p>{h.status}</p>
                <p className="text-caption text-foreground-muted">
                  {new Date(h.timestamp).toLocaleString()} {h.location && `· ${h.location}`}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
