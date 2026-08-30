'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type CursorMode = 'default' | 'hover' | 'text' | 'view' | 'hidden';

interface CursorState {
  mode: CursorMode;
  label?: string;
}

interface CursorContextValue {
  cursor: CursorState;
  setCursor: (mode: CursorMode, label?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    return {
      cursor: { mode: 'default' },
      setCursor: () => {},
      resetCursor: () => {},
    };
  }
  return ctx;
}

interface CursorProviderProps {
  children: ReactNode;
}

export function CursorProvider({ children }: CursorProviderProps) {
  const [cursor, setCursorState] = useState<CursorState>({ mode: 'default' });

  const setCursor = useCallback((mode: CursorMode, label?: string) => {
    setCursorState({ mode, label });
  }, []);

  const resetCursor = useCallback(() => {
    setCursorState({ mode: 'default' });
  }, []);

  return (
    <CursorContext.Provider value={{ cursor, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
}
