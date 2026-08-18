import { DropScheduler } from "@/components/admin/drop-scheduler";
import { listScheduledDrops } from "@/lib/admin/drop-service";

export const dynamic = "force-dynamic";

export default function AdminDropsPage() {
  const drops = listScheduledDrops();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
      <header className="border-b border-border pb-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          OTARU ADMINISTRATIVE CONTROL PLANE
        </span>
        <h1 className="font-serif text-3xl tracking-tight text-foreground mt-1">
          Drop Allocation & Release Scheduler
        </h1>
      </header>

      <main>
        <DropScheduler initialDrops={drops} />
      </main>
    </div>
  );
}
