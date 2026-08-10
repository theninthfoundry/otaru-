import { ReturnForm } from "@/components/orders/ReturnForm";

export const metadata = { title: "Returns — Otaru" };

export default function ReturnsPage() {
  return (
    <div className="otaru-container pt-36 pb-24">
      <p className="otaru-eyebrow mb-4">Logistics</p>
      <h1 className="font-display text-display-lg mb-12 max-w-2xl">Returns Portal</h1>
      <ReturnForm />
    </div>
  );
}
