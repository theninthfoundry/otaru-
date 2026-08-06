"use client";

import { useState, useTransition } from "react";
import { joinWaitlistAction } from "@/actions/waitlist";
import { Button } from "@/components/ui/Button";

export function WaitlistForm({ dropSlug }: { dropSlug: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await joinWaitlistAction(email, dropSlug);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  if (status === "success") {
    return <p className="text-body-sm">You're on the priority waitlist. We'll notify you first.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
      <input
        type="email"
        required
        placeholder="Email for priority access"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 flex-1 rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
      />
      <Button type="submit" disabled={isPending}>{isPending ? "…" : "Notify Me"}</Button>
      {error && <p className="text-caption text-error">{error}</p>}
    </form>
  );
}
