"use client";

import { useState, useEffect } from "react";

export interface DropTelemetryData {
  timestamp: string;
  liveViewers: number;
  cartReservations: number;
  stockDepletionRate: number;
  inventoryStatus: "NOMINAL" | "HIGH_CONTENTION";
}

export function useDropTelemetry() {
  const [telemetry, setTelemetry] = useState<DropTelemetryData>({
    timestamp: new Date().toISOString(),
    liveViewers: 36,
    cartReservations: 12,
    stockDepletionRate: 0.8,
    inventoryStatus: "NOMINAL",
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource("/api/telemetry/stream");

      eventSource.addEventListener("connected", () => {
        setIsConnected(true);
      });

      eventSource.addEventListener("telemetry", (event) => {
        try {
          const data: DropTelemetryData = JSON.parse(event.data);
          setTelemetry(data);
        } catch (err) {
          console.error("Failed to parse SSE telemetry packet", err);
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource?.close();
      };
    } catch {
      setIsConnected(false);
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  return { telemetry, isConnected };
}
