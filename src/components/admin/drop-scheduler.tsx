"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { type ScheduledDrop } from "@/lib/admin/drop-service";

interface DropSchedulerProps {
  initialDrops: ScheduledDrop[];
}

export function DropScheduler({ initialDrops }: DropSchedulerProps) {
  const [drops, setDrops] = useState<ScheduledDrop[]>(initialDrops);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [chapterSlug, setChapterSlug] = useState("chapter-01");
  const [releaseDate, setReleaseDate] = useState("");
  const [units, setUnits] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !releaseDate) return;

    setIsSubmitting(true);
    const newDrop: ScheduledDrop = {
      id: `DROP-${String(drops.length + 1).padStart(3, "0")}`,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      chapterSlug,
      publicReleaseDate: new Date(releaseDate).toISOString(),
      vanguardEarlyHours: 24,
      patronEarlyHours: 12,
      totalAllocationUnits: units,
      remainingUnits: units,
      status: "SCHEDULED",
      skuHandles: ["garment-sku-1", "garment-sku-2"],
    };

    setDrops([newDrop, ...drops]);
    setTitle("");
    setSlug("");
    setReleaseDate("");
    setIsSubmitting(false);
  };

  const handleStatusChange = (dropId: string, status: ScheduledDrop["status"]) => {
    setDrops(drops.map((d) => (d.id === dropId ? { ...d, status } : d)));
  };

  return (
    <div className="space-y-8">
      {/* Create New Drop Form */}
      <div className="rounded border border-border bg-card p-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
          SCHEDULE NEW ARTIFACT DROP
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Drop Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 02: 18oz Heavy Melton Wool"
              className="w-full bg-secondary/50 border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Public Release Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full bg-secondary/50 border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Chapter Slug
            </label>
            <input
              type="text"
              required
              value={chapterSlug}
              onChange={(e) => setChapterSlug(e.target.value)}
              className="w-full bg-secondary/50 border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Total Allocation Units
            </label>
            <input
              type="number"
              required
              min={1}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="w-full bg-secondary/50 border border-border px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "REGISTERING DROP..." : "REGISTER DROP CAMPAIGN"}
            </Button>
          </div>
        </form>
      </div>

      {/* Active & Scheduled Drops Table */}
      <div className="rounded border border-border bg-card p-6 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-accent">
          ACTIVE & SCHEDULED RELEASES ({drops.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="pb-3">ID</th>
                <th className="pb-3">TITLE</th>
                <th className="pb-3">RELEASE DATE</th>
                <th className="pb-3">STOCK</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {drops.map((drop) => (
                <tr key={drop.id} className="text-xs">
                  <td className="py-3 font-semibold text-foreground">{drop.id}</td>
                  <td className="py-3">{drop.title}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(drop.publicReleaseDate).toLocaleString()}
                  </td>
                  <td className="py-3">
                    {drop.remainingUnits} / {drop.totalAllocationUnits}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded ${
                        drop.status === "LIVE"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : drop.status === "SCHEDULED"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {drop.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    {drop.status !== "LIVE" ? (
                      <button
                        onClick={() => handleStatusChange(drop.id, "LIVE")}
                        className="text-[10px] uppercase tracking-widest text-emerald-400 hover:underline"
                      >
                        TRIGGER LIVE
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(drop.id, "PAUSED")}
                        className="text-[10px] uppercase tracking-widest text-amber-400 hover:underline"
                      >
                        PAUSE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
