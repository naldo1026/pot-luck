export type Track = 'wordle' | 'connections';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface WordleState {
  guesses: string[];
  status: GameStatus;
  finishedAt?: string;
}

export interface ConnectionsState {
  /** Remaining (unsolved) words in their current on-screen order. */
  order: string[];
  /** Group indexes in the order they were solved. */
  solved: number[];
  /** Every submitted guess (4 words each), for share grids and "already guessed". */
  history: string[][];
  mistakes: number;
  status: GameStatus;
  finishedAt?: string;
}

export interface SaveData {
  version: 1;
  wordle: Record<number, WordleState>;
  connections: Record<number, ConnectionsState>;
  /** One-time reveals already shown: "note:wordle:10", "kiln:photo-2", "finale". */
  seen: string[];
  settings: {
    seenHowTo: Record<Track, boolean>;
    /** Passcode entered on this device. */
    unlocked: boolean;
    /** Colour scheme for this device. */
    theme?: 'system' | 'light' | 'dark';
    /** Dev-only: every level playable. */
    devUnlockAll?: boolean;
  };
}

export const LEVEL_COUNT = 50;
export const TRACKS: Track[] = ['wordle', 'connections'];

export function freshSave(): SaveData {
  return {
    version: 1,
    wordle: {},
    connections: {},
    seen: [],
    settings: { seenHowTo: { wordle: false, connections: false }, unlocked: false },
  };
}
