"use client";

import { useEffect, useState } from "react";

function getTimeParts(target: Date) {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function DropCountdown({ dropDate }: { dropDate: string }) {
  const [parts, setParts] = useState(() => getTimeParts(new Date(dropDate)));

  useEffect(() => {
    const interval = setInterval(() => setParts(getTimeParts(new Date(dropDate))), 1000);
    return () => clearInterval(interval);
  }, [dropDate]);

  return (
    <div className="flex gap-8">
      {Object.entries(parts).map(([label, value]) => (
        <div key={label} className="text-center">
          <p className="font-display text-display-md tabular-nums">{String(value).padStart(2, "0")}</p>
          <p className="otaru-eyebrow mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
