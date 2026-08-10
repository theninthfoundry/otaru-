"use client";

import { cn } from "@/lib/utils";

export type CheckoutStep = "contact" | "shipping" | "payment" | "review";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

/** Progress indicator — reveals one step at a time (Baymard: reduces perceived complexity vs. a long single-page form). */
export function CheckoutSteps({ current, onStepClick }: { current: CheckoutStep; onStepClick: (step: CheckoutStep) => void }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex items-center gap-2 text-caption tracking-wide uppercase mb-10">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => done && onStepClick(step.id)}
              disabled={!done}
              className={cn(
                "transition-colors duration-1",
                active && "text-foreground font-medium",
                done && "text-foreground-muted underline underline-offset-2 cursor-pointer",
                !done && !active && "text-foreground-muted/50"
              )}
            >
              {step.label}
            </button>
            {i < STEPS.length - 1 && <span className="text-foreground-muted/40">/</span>}
          </li>
        );
      })}
    </ol>
  );
}
