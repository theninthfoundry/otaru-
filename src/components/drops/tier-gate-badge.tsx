"use client";

import { useMemo } from "react";
import { type MembershipTier, isTierEligibleForDrop, TIER_PRIVILEGES } from "@/lib/membership/privileges";

interface TierGateBadgeProps {
  releaseDate: string | Date;
  userTier?: MembershipTier;
}

export function TierGateBadge({ releaseDate, userTier = "INITIATE" }: TierGateBadgeProps) {
  const eligibility = useMemo(
    () => isTierEligibleForDrop(releaseDate, userTier),
    [releaseDate, userTier]
  );

  const privilege = TIER_PRIVILEGES[userTier];

  if (eligibility.isEligible) {
    return (
      <div className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        {privilege.displayName} Access Active
      </div>
    );
  }

  const hoursRemaining = Math.ceil(eligibility.timeRemainingMs / (1000 * 60 * 60));

  return (
    <div className="inline-flex items-center gap-1.5 border border-border bg-secondary/50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
      <span className="text-[10px]">🔒</span>
      {privilege.displayName} Unlocks in {hoursRemaining}h
    </div>
  );
}
