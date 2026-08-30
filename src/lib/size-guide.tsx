'use client';

import React, { createContext, useContext, useState } from 'react';

interface SizeGuideContextType {
  isOpen: boolean;
  productId: string | null;
  openSizeGuide: (id: string) => void;
  closeSizeGuide: () => void;
}

const SizeGuideContext = createContext<SizeGuideContextType>({
  isOpen: false,
  productId: null,
  openSizeGuide: () => {},
  closeSizeGuide: () => {},
});

export function SizeGuideProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const openSizeGuide = (id: string) => {
    setProductId(id);
    setIsOpen(true);
  };

  const closeSizeGuide = () => {
    setIsOpen(false);
  };

  return (
    <SizeGuideContext.Provider value={{ isOpen, productId, openSizeGuide, closeSizeGuide }}>
      {children}
    </SizeGuideContext.Provider>
  );
}

export function useSizeGuide() {
  return useContext(SizeGuideContext);
}
