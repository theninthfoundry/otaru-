"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export interface ContactData {
  email: string;
  marketingOptIn: boolean;
}

/** Guest-checkout-first (Baymard/CXL: forced registration is the #2 abandonment cause). No "Register" language up front. */
export function ContactStep({ initial, onContinue }: { initial: ContactData; onContinue: (data: ContactData) => void }) {
  const [email, setEmail] = useState(initial.email);
  const [marketingOptIn, setMarketingOptIn] = useState(initial.marketingOptIn);
  const [touched, setTouched] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-body-sm text-foreground-muted mb-1">
          Already have an account? <button className="underline underline-offset-2 text-foreground">Sign in</button>
        </p>
      </div>

      <div>
        <label className="otaru-eyebrow mb-2 block">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@example.com"
          className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink"
        />
        {touched && !isValid && <p className="mt-1 text-caption text-error">Enter a valid email address.</p>}
      </div>

      <label className="flex items-center gap-2 text-body-sm">
        <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="h-4 w-4" />
        Email me with news and offers
      </label>

      <Button className="w-full" disabled={!isValid} onClick={() => onContinue({ email, marketingOptIn })}>
        Continue to Shipping
      </Button>
    </div>
  );
}
