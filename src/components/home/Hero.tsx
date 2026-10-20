'use client';

/**
 * House of Otaru — Hero Component
 * Re-exports the atmospheric HeldHero implementation for backwards compatibility.
 */
export { HeldHero as Hero } from './HeldHero';
export default function LegacyHeroWrapper() {
  return null;
}
