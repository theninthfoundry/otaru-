'use client';

import React, { createContext, useContext, useState } from 'react';
import { ConciergePanel } from '@/components/concierge/ConciergePanel';

interface ConciergeContextType {
  isOpen: boolean;
  category: string;
  objectContext?: string;
  openConcierge: (category?: string, objectContext?: string) => void;
  closeConcierge: () => void;
}

const ConciergeContext = createContext<ConciergeContextType>({
  isOpen: false,
  category: 'fit',
  openConcierge: () => {},
  closeConcierge: () => {},
});

export function ConciergeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('fit');
  const [objectContext, setObjectContext] = useState<string | undefined>(undefined);

  const openConcierge = (cat = 'fit', context?: string) => {
    setCategory(cat);
    setObjectContext(context);
    setIsOpen(true);
  };

  const closeConcierge = () => {
    setIsOpen(false);
  };

  return (
    <ConciergeContext.Provider value={{ isOpen, category, objectContext, openConcierge, closeConcierge }}>
      {children}
      <ConciergePanel
        isOpen={isOpen}
        onClose={closeConcierge}
        defaultCategory={category}
        objectContext={objectContext}
      />
    </ConciergeContext.Provider>
  );
}

export function useConcierge() {
  return useContext(ConciergeContext);
}
