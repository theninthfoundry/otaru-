import { Accordion } from "@/components/ui/Accordion";

/** LV/Palm Angels pattern: delivery estimate + returns policy live directly on the PDP, not buried in a help center. */
export function DeliveryReturnsInfo() {
  return (
    <Accordion
      className="mt-6 border-t border-border pt-2"
      items={[
        {
          id: "delivery",
          title: "Delivery",
          content: (
            <div className="space-y-1">
              <p>Standard: 3–5 business days · Free over $300</p>
              <p>Express: 1–2 business days · $25</p>
              <p>International shipping available at checkout.</p>
            </div>
          ),
        },
        {
          id: "returns",
          title: "Returns",
          content: "Free returns within 30 days of delivery. Items must be unworn with tags attached. Start a return at /returns.",
        },
      ]}
    />
  );
}
