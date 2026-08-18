"use client";

import { useCallback } from "react";
import { tactileAudio } from "@/lib/audio/tactile-audio";

export type HapticStyle = "light" | "medium" | "heavy" | "success" | "nfcPulse" | "error";

export function useHaptics() {
  const triggerHaptic = useCallback((style: HapticStyle = "light", playSound = true) => {
    // 1. Play procedural tactile audio
    if (playSound) {
      if (style === "success" || style === "nfcPulse") {
        tactileAudio.playProvenanceChime();
      } else {
        tactileAudio.playClick(style === "heavy" ? 900 : 1400);
      }
    }

    // 2. Trigger Navigator Vibration API on mobile devices
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        switch (style) {
          case "light":
            navigator.vibrate(10);
            break;
          case "medium":
            navigator.vibrate(25);
            break;
          case "heavy":
            navigator.vibrate(50);
            break;
          case "success":
            navigator.vibrate([20, 40, 30]);
            break;
          case "nfcPulse":
            navigator.vibrate([40, 60, 100]);
            break;
          case "error":
            navigator.vibrate([50, 50, 50]);
            break;
        }
      } catch {}
    }
  }, []);

  return { triggerHaptic };
}
