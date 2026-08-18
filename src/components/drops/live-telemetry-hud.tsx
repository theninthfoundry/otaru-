"use client";

import { useDropTelemetry } from "@/hooks/use-drop-telemetry";

export function LiveTelemetryHUD() {
  const { telemetry, isConnected } = useDropTelemetry();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-border/70 bg-secondary/30 px-4 py-2.5 font-mono text-[11px] backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            isConnected ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
          }`}
        />
        <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
          {isConnected ? "LIVE TELEMETRY STREAM" : "TELEMETRY CACHED"}
        </span>
      </div>

      <div className="flex items-center gap-6 text-muted-foreground">
        <div>
          <span className="text-muted-foreground/60 mr-1.5">PATRONS:</span>
          <span className="font-bold text-foreground">{telemetry.liveViewers}</span>
        </div>

        <div>
          <span className="text-muted-foreground/60 mr-1.5">CART LOCKS:</span>
          <span className="font-bold text-foreground">{telemetry.cartReservations}</span>
        </div>

        <div>
          <span className="text-muted-foreground/60 mr-1.5">STATE:</span>
          <span
            className={`font-semibold ${
              telemetry.inventoryStatus === "HIGH_CONTENTION"
                ? "text-amber-500"
                : "text-emerald-400"
            }`}
          >
            {telemetry.inventoryStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
