"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Otaru primary button. Uses a magnetic hover micro-interaction (subtle
 * translate on pointer proximity) layered on top of standard Tailwind
 * tokens — see motion tier L1 (150–300ms).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm font-body tracking-tight transition-all duration-1 ease-standard",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-otaru-ink disabled:opacity-40 disabled:pointer-events-none",
          variant === "primary" && "bg-otaru-ink text-otaru-chalk hover:opacity-90 active:scale-[0.98]",
          variant === "secondary" && "border border-border-strong text-foreground hover:bg-otaru-ink hover:text-otaru-chalk hover:border-otaru-ink",
          variant === "ghost" && "text-foreground hover:text-foreground-muted",
          size === "sm" && "h-9 px-4 text-body-sm",
          size === "md" && "h-12 px-6 text-body-md",
          size === "lg" && "h-14 px-8 text-body-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
