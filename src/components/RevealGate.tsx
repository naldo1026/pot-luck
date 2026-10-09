import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Milestone notes, Kiln photos and the finale wait politely while a game is
 * finishing (animations + result card) and then appear on top of whatever's showing.
 */
interface GateValue {
  suppressed: boolean;
  hold: () => () => void;
}

const GateContext = createContext<GateValue>({ suppressed: false, hold: () => () => {} });

export function RevealGateProvider({ children }: { children: ReactNode }) {
  const [holds, setHolds] = useState(0);
  const hold = useCallback(() => {
    setHolds((n) => n + 1);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      setHolds((n) => n - 1);
    };
  }, []);
  const value = useMemo(() => ({ suppressed: holds > 0, hold }), [holds, hold]);
  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
}

export const useRevealGate = () => useContext(GateContext);

/** Holds reveals back for as long as `active` is true. */
export function useHoldReveals(active: boolean) {
  const { hold } = useRevealGate();
  useEffect(() => (active ? hold() : undefined), [active, hold]);
}
