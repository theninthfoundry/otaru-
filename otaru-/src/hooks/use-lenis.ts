'use client';

import { useContext } from 'react';
import { LenisContext } from '@/components/common/lenis-provider';

/**
 * Access the Lenis smooth-scroll instance for programmatic control.
 *
 * @example
 * const lenis = useLenis();
 * lenis?.scrollTo('#section', { duration: 1.2 });
 */
export function useLenis() {
  return useContext(LenisContext);
}
