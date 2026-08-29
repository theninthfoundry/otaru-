"use client";

/**
 * RevealOnScroll
 * -----------------------------------------------------------------
 * Wrap any section child to get the fade+rise reveal used throughout
 * the new sections. Pass `index` inside a staggered group to offset
 * each child's delay (e.g. a 4-up product grid).
 *
 * Respects prefers-reduced-motion by disabling the transform and
 * cutting the duration to ~0, per section 15 of the build directive.
 */
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function RevealOnScroll({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.56,
        delay: reduceMotion ? 0 : index * 0.09,
        ease: [0.16, 1, 0.3, 1], // --ease-otaru
      }}
    >
      {children}
    </motion.div>
  );
}
