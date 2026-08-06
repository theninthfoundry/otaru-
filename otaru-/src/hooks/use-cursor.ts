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

/**
 * Hook to control cursor state.
 * Returns setCursor(mode, label) and resetCursor().
 */
export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    // Fallback for components outside provider
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

/**
 * Provider for custom cursor state management.
 * Wrap at the layout level to enable cursor mode switching.
 */
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
