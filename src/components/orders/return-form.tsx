"use client";

import { useState, useTransition } from "react";
import { submitReturnAction } from "@/actions/returns";
import { Button } from "@/components/ui/button";

const REASONS = ["Wrong size", "Changed my mind", "Damaged on arrival", "Not as described", "Other"];

export function ReturnForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitReturnAction>> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitReturnAction({ orderId, email, reason, itemHandles: [] });
      setResult(res);
    });
  }

  if (result?.success) {
    return (
      <div className="max-w-md rounded-sm border border-border p-6">
        <p className="text-body-md">Return request submitted.</p>
        <p className="text-body-sm text-foreground-muted mt-2">Reference: {result.ticketId}</p>
        <p className="text-caption text-foreground-muted mt-4">
          A collection pickup will be scheduled via Shiprocket once dispatch is confirmed by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <input
        required
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Order ID"
        className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email used at checkout"
        className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
      />
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
      >
        {REASONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      {result && !result.success && <p className="text-body-sm text-error">{result.error}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting…" : "Submit Return"}
      </Button>
    </form>
  );
}
