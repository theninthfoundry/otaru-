"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletterAction } from "@/actions/newsletter";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await subscribeNewsletterAction(email);
      setStatus(result.success ? "success" : "error");
      if (result.success) setEmail("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex max-w-sm gap-2", className)}>
      <input
        type="email"
        required
        placeholder="Private Access — email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 flex-1 rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
      />
      <button
        type="submit"
        disabled={isPending}
        className="h-11 shrink-0 rounded-sm bg-otaru-ink px-4 text-body-sm text-otaru-chalk disabled:opacity-40"
      >
        {isPending ? "…" : "Join"}
      </button>
      {status === "success" && <span className="sr-only">Subscribed</span>}
    </form>
  );
}
