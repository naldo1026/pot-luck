import type { PersonalPhoto } from '../config/personal';
import { LEVEL_COUNT, TRACKS, type GameStatus, type SaveData, type Track } from './types';

export const isFinished = (status: GameStatus | undefined): boolean => status === 'won' || status === 'lost';

export function levelStatus(save: SaveData, track: Track, level: number): GameStatus | undefined {
  return save[track][level]?.status;
}

/** Level 1 is always open; every other level opens once the previous one is finished (won or lost). */
export function isLevelUnlocked(save: SaveData, track: Track, level: number): boolean {
  if (level < 1 || level > LEVEL_COUNT) return false;
  if (level === 1 || save.settings.devUnlockAll) return true;
  return isFinished(levelStatus(save, track, level - 1));
}

/** The first unfinished level, or null when the whole track is done. */
export function currentLevel(save: SaveData, track: Track): number | null {
  for (let level = 1; level <= LEVEL_COUNT; level++) {
    if (!isFinished(levelStatus(save, track, level))) return level;
  }
  return null;
}

export function completedCount(save: SaveData, track: Track): number {
  let count = 0;
  for (let level = 1; level <= LEVEL_COUNT; level++) {
    if (isFinished(levelStatus(save, track, level))) count++;
  }
  return count;
}

export function totalCompleted(save: SaveData): number {
  return TRACKS.reduce((sum, track) => sum + completedCount(save, track), 0);
}

export function isFinaleUnlocked(save: SaveData): boolean {
  return TRACKS.every((track) => isFinished(levelStatus(save, track, LEVEL_COUNT)));
}

export interface TrackStats {
  played: number;
  won: number;
  winPct: number;
  currentStreak: number;
  maxStreak: number;
}

/** Levels are played in order, so level order doubles as chronological order for streaks. */
export function trackStats(save: SaveData, track: Track): TrackStats {
  let played = 0;
  let won = 0;
  let run = 0;
  let maxStreak = 0;
  for (let level = 1; level <= LEVEL_COUNT; level++) {
    const status = levelStatus(save, track, level);
    if (!isFinished(status)) continue;
    played++;
    if (status === 'won') {
      won++;
      run++;
      maxStreak = Math.max(maxStreak, run);
    } else {
      run = 0;
    }
  }
  return { played, won, winPct: played ? Math.round((won / played) * 100) : 0, currentStreak: run, maxStreak };
}

/** How many wins took 1..6 guesses (index 0 = 1 guess). */
export function wordleDistribution(save: SaveData): number[] {
  const dist = [0, 0, 0, 0, 0, 0];
  for (const state of Object.values(save.wordle)) {
    if (state.status === 'won' && state.guesses.length >= 1 && state.guesses.length <= 6) {
      dist[state.guesses.length - 1]++;
    }
  }
  return dist;
}

/** Connections wins with zero mistakes. */
export function perfectConnections(save: SaveData): number {
  return Object.values(save.connections).filter((s) => s.status === 'won' && s.mistakes === 0).length;
}

// ---------- The Kiln ----------

export const ROOM_TEMP = 20;
export const FIRING_TEMP = 1200;

/** Kiln temperature for a photo: room temperature rising to firing temperature as she nears unlockAt. */
export function kilnTemperature(completed: number, unlockAt: number): number {
  const ratio = unlockAt <= 0 ? 1 : Math.min(1, Math.max(0, completed / unlockAt));
  return Math.round(ROOM_TEMP + (FIRING_TEMP - ROOM_TEMP) * ratio);
}

export function unlockedPhotos(save: SaveData, photos: PersonalPhoto[]): PersonalPhoto[] {
  const completed = totalCompleted(save);
  return photos.filter((p) => completed >= p.unlockAt);
}

/**
 * The polaroid for a win card: every `every`th level, chosen deterministically from
 * the photos she's already unlocked (so the Kiln never gets spoiled).
 */
export function pickWinPhoto(level: number, unlocked: PersonalPhoto[], every: number): PersonalPhoto | null {
  if (every <= 0 || level % every !== 0 || unlocked.length === 0) return null;
  return unlocked[(level / every - 1) % unlocked.length];
}
