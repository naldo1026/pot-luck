import { freshSave, type SaveData } from './types';

/**
 * Where progress lives. Async on purpose so a backend-backed implementation
 * (e.g. an ApiRepository) can replace localStorage without touching the UI.
 */
export interface ProgressRepository {
  load(): Promise<SaveData>;
  save(data: SaveData): Promise<void>;
}

export const STORAGE_KEY = 'potluck:save:v1';

function safeLocalStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/** Accepts anything parsed from storage and returns a well-formed SaveData. */
export function migrate(raw: unknown): SaveData {
  const base = freshSave();
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Partial<SaveData>;
  // Future versions: branch on data.version here and upgrade step by step.
  return {
    version: 1,
    wordle: isRecord(data.wordle) ? data.wordle : base.wordle,
    connections: isRecord(data.connections) ? data.connections : base.connections,
    seen: Array.isArray(data.seen) ? data.seen.filter((s) => typeof s === 'string') : base.seen,
    settings: {
      ...base.settings,
      ...(isRecord(data.settings) ? data.settings : {}),
      seenHowTo: { ...base.settings.seenHowTo, ...(isRecord(data.settings?.seenHowTo) ? data.settings.seenHowTo : {}) },
    },
  };
}

function isRecord(value: unknown): value is Record<string, any> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export class LocalStorageRepository implements ProgressRepository {
  constructor(
    private readonly storage: Storage | undefined = safeLocalStorage(),
    private readonly key: string = STORAGE_KEY,
  ) {}

  async load(): Promise<SaveData> {
    if (!this.storage) return freshSave();
    let raw: string | null = null;
    try {
      raw = this.storage.getItem(this.key);
      return raw ? migrate(JSON.parse(raw)) : freshSave();
    } catch {
      // Keep a copy of unreadable data rather than silently losing it.
      try {
        if (raw) this.storage.setItem(`${this.key}:corrupt`, raw);
      } catch {
        /* storage full or blocked */
      }
      return freshSave();
    }
  }

  async save(data: SaveData): Promise<void> {
    try {
      this.storage?.setItem(this.key, JSON.stringify(data));
    } catch {
      /* storage full or blocked — progress just won't persist */
    }
  }
}

export function createRepository(): ProgressRepository {
  return new LocalStorageRepository();
}
