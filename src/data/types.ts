export interface WordleLevel {
  level: number;
  /** Five uppercase letters A–Z. */
  answer: string;
  /** Shown after the game ends: a short fun fact or personal note (≤ ~160 chars). */
  note: string;
  /** Generic content that's meant to be swapped for an inside joke. */
  personalSlot?: boolean;
}

/** 0 = yellow (easiest), 1 = green, 2 = blue, 3 = purple (trickiest). */
export type Difficulty = 0 | 1 | 2 | 3;

export interface ConnectionsGroup {
  /** The category reveal, e.g. "TYPES OF CLAY". */
  name: string;
  /** Exactly four uppercase entries; multi-word entries are fine. */
  words: [string, string, string, string];
  difficulty: Difficulty;
  /** Generic content that's meant to be swapped for an inside joke. */
  personalSlot?: boolean;
}

export interface ConnectionsPuzzle {
  level: number;
  /** Exactly four groups, one of each difficulty. */
  groups: ConnectionsGroup[];
}
