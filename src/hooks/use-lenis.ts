'use client';

import { useContext } from 'react';
import { LenisContext } from '@/components/common/lenis-provider';

export function useLenis() {
  return useContext(LenisContext);
}
