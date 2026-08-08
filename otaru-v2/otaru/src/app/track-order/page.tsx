import { TrackOrderForm } from "@/components/orders/TrackOrderForm";

export const metadata = { title: "Track Order — Otaru" };

export default function TrackOrderPage() {
  return (
    <div className="otaru-container pt-32 pb-24">
      <p className="otaru-eyebrow mb-4">Logistics</p>
      <h1 className="font-display text-display-lg mb-12 max-w-2xl">Track Order</h1>
      <TrackOrderForm />
    </div>
  );
}
