import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createRepository, type ProgressRepository } from './repository';
import { freshSave, type ConnectionsState, type SaveData, type Track, type WordleState } from './types';

interface ProgressContextValue {
  save: SaveData;
  update: (fn: (prev: SaveData) => SaveData) => void;
  setWordle: (level: number, state: WordleState) => void;
  setConnections: (level: number, state: ConnectionsState) => void;
  markSeen: (key: string) => void;
  markHowToSeen: (track: Track) => void;
  setSettings: (patch: Partial<SaveData['settings']>) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({
  children,
  repository,
  fallback = null,
}: {
  children: ReactNode;
  repository?: ProgressRepository;
  fallback?: ReactNode;
}) {
  const repo = useMemo(() => repository ?? createRepository(), [repository]);
  const [save, setSave] = useState<SaveData | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    repo.load().then((data) => {
      if (!cancelled) setSave(data);
    });
    return () => {
      cancelled = true;
    };
  }, [repo]);

  // Persist every change after the initial load.
  useEffect(() => {
    if (!save) return;
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    void repo.save(save);
  }, [repo, save]);

  const update = useCallback((fn: (prev: SaveData) => SaveData) => {
    setSave((prev) => (prev ? fn(prev) : prev));
  }, []);

  const value = useMemo<ProgressContextValue | null>(() => {
    if (!save) return null;
    return {
      save,
      update,
      setWordle: (level, state) => update((s) => ({ ...s, wordle: { ...s.wordle, [level]: state } })),
      setConnections: (level, state) => update((s) => ({ ...s, connections: { ...s.connections, [level]: state } })),
      markSeen: (key) => update((s) => (s.seen.includes(key) ? s : { ...s, seen: [...s.seen, key] })),
      markHowToSeen: (track) =>
        update((s) => ({ ...s, settings: { ...s.settings, seenHowTo: { ...s.settings.seenHowTo, [track]: true } } })),
      setSettings: (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      // Keep the passcode unlock so a reset doesn't lock her out.
      reset: () => update((s) => ({ ...freshSave(), settings: { ...freshSave().settings, unlocked: s.settings.unlocked } })),
    };
  }, [save, update]);

  if (!value) return <>{fallback}</>;
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
