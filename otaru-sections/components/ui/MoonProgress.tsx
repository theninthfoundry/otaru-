"use client";

/**
 * MoonProgress
 * -----------------------------------------------------------------
 * Fixed bottom-right scroll indicator shaped like the moon in the
 * hero, filling from new moon (top of page) to full moon (bottom of
 * page). Ties back to the hero's "MMXXVI" / lunar framing instead of
 * a generic progress bar.
 *
 * Mount once near the root layout, outside the Sign In route (pass
 * `hidden` there so the auth flow stays undistracted — see
 * INTEGRATION.md).
 */
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function MoonProgress({ hidden = false }: { hidden?: boolean }) {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const x = useTransform(smooth, [0, 1], ["0%", "100%"]);

  if (hidden) return null;

  return (
    <div
      role="img"
      aria-label="Scroll progress"
      className="fixed bottom-6 right-6 z-40 h-10 w-10 overflow-hidden rounded-full shadow-[0_6px_18px_rgba(0,0,0,.35)] ring-1 ring-[var(--otaru-line-strong)]"
      style={{ backgroundColor: "var(--otaru-gold)" }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "var(--otaru-ink)", x }}
      />
    </div>
  );
}
