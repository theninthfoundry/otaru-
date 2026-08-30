'use client';

import { createContext, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LenisContext = createContext<any>(null);

export function useLenis() {
  return useContext(LenisContext);
}
