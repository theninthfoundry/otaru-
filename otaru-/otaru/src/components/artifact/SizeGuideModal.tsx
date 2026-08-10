"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

const SIZE_CHART = [
  { size: "XS", chest: "34–36", waist: "28–30", length: "26.5" },
  { size: "S", chest: "36–38", waist: "30–32", length: "27" },
  { size: "M", chest: "38–40", waist: "32–34", length: "27.5" },
  { size: "L", chest: "40–42", waist: "34–36", length: "28" },
  { size: "XL", chest: "42–44", waist: "36–38", length: "28.5" },
];

/** ASOS/Bluorng-style size guide: measurement chart + a quick fit-recommendation quiz. */
export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitPref, setFitPref] = useState<"true" | "relaxed">("true");
  const [recommendation, setRecommendation] = useState<string | null>(null);

  function computeRecommendation() {
    const h = parseInt(height, 10);
    if (!h) return;
    let idx = h < 165 ? 0 : h < 172 ? 1 : h < 179 ? 2 : h < 186 ? 3 : 4;
    if (fitPref === "relaxed") idx = Math.min(idx + 1, SIZE_CHART.length - 1);
    setRecommendation(SIZE_CHART[idx].size);
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-display-sm">Size Guide</h2>
          <button onClick={onClose} aria-label="Close" className="text-body-lg">×</button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="otaru-eyebrow mb-3">Measurements (inches)</p>
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-border text-caption text-foreground-muted">
                  <th className="text-left py-2">Size</th>
                  <th className="text-left py-2">Chest</th>
                  <th className="text-left py-2">Waist</th>
                  <th className="text-left py-2">Length</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className={row.size === recommendation ? "bg-surface-alt" : ""}>
                    <td className="py-2 font-medium">{row.size}</td>
                    <td className="py-2 text-foreground-muted">{row.chest}</td>
                    <td className="py-2 text-foreground-muted">{row.waist}</td>
                    <td className="py-2 text-foreground-muted">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <p className="otaru-eyebrow mb-3">Find your size</p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="h-11 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
              />
              <input
                type="number"
                placeholder="Weight (kg) — optional"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-11 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-sm focus:outline-none focus:border-otaru-ink"
              />
              <div className="flex gap-2">
                {(["true", "relaxed"] as const).map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setFitPref(pref)}
                    className={`h-11 flex-1 rounded-sm border text-body-sm capitalize ${fitPref === pref ? "border-otaru-ink bg-otaru-ink text-otaru-chalk" : "border-border-strong"}`}
                  >
                    {pref === "true" ? "True to size" : "Relaxed fit"}
                  </button>
                ))}
              </div>
              <button onClick={computeRecommendation} className="h-11 w-full rounded-sm bg-otaru-ink text-otaru-chalk text-body-sm">
                Get my size
              </button>
              {recommendation && (
                <p className="text-body-sm pt-2">
                  Recommended size: <span className="font-medium">{recommendation}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
