import { describe, expect, it } from 'vitest';
import type { PersonalPhoto } from '../config/personal';
import { LocalStorageRepository, STORAGE_KEY, migrate } from './repository';
import { pendingReveals } from './reveals';
import {
  currentLevel,
  isFinaleUnlocked,
  isLevelUnlocked,
  kilnTemperature,
  pickWinPhoto,
  totalCompleted,
  trackStats,
  unlockedPhotos,
  wordleDistribution,
} from './selectors';
import { freshSave, type SaveData } from './types';

const won = (guesses = ['GLAZE']) => ({ guesses, status: 'won' as const });
const lost = () => ({ guesses: Array(6).fill('WHEEL'), status: 'lost' as const });

function saveWith(levels: Record<number, ReturnType<typeof won> | ReturnType<typeof lost>>): SaveData {
  return { ...freshSave(), wordle: levels };
}

describe('unlocking', () => {
  it('opens level 1, then each level after the previous one is finished (won or lost)', () => {
    const save = saveWith({ 1: won(), 2: lost() });
    expect(isLevelUnlocked(save, 'wordle', 1)).toBe(true);
    expect(isLevelUnlocked(save, 'wordle', 2)).toBe(true);
    expect(isLevelUnlocked(save, 'wordle', 3)).toBe(true);
    expect(isLevelUnlocked(save, 'wordle', 4)).toBe(false);
    expect(isLevelUnlocked(save, 'connections', 2)).toBe(false);
    expect(currentLevel(save, 'wordle')).toBe(3);
  });

  it('does not unlock past an in-progress level', () => {
    const save = saveWith({ 1: { guesses: ['WHEEL'], status: 'playing' } as never });
    expect(isLevelUnlocked(save, 'wordle', 2)).toBe(false);
  });

  it('rejects out-of-range levels and honours the dev unlock', () => {
    const save = freshSave();
    expect(isLevelUnlocked(save, 'wordle', 0)).toBe(false);
    expect(isLevelUnlocked(save, 'wordle', 51)).toBe(false);
    save.settings.devUnlockAll = true;
    expect(isLevelUnlocked(save, 'wordle', 50)).toBe(true);
  });
});

describe('stats', () => {
  it('counts wins, streaks and the guess distribution', () => {
    const save = saveWith({ 1: won(['A', 'B', 'GLAZE']), 2: won(['GLAZE']), 3: lost(), 4: won(['A', 'GLAZE']) });
    expect(trackStats(save, 'wordle')).toEqual({ played: 4, won: 3, winPct: 75, currentStreak: 1, maxStreak: 2 });
    expect(wordleDistribution(save)).toEqual([1, 1, 1, 0, 0, 0]);
  });

  it('only unlocks the finale once both level 50s are done', () => {
    const save = freshSave();
    save.wordle[50] = won();
    expect(isFinaleUnlocked(save)).toBe(false);
    save.connections[50] = { order: [], solved: [], history: [], mistakes: 4, status: 'lost' };
    expect(isFinaleUnlocked(save)).toBe(true);
  });
});

describe('the Kiln', () => {
  const photos: PersonalPhoto[] = [
    { id: 'a', src: 'a.jpg', alt: '', caption: '', unlockAt: 2 },
    { id: 'b', src: 'b.jpg', alt: '', caption: '', unlockAt: 4 },
  ];

  it('heats from room temperature to 1200°C', () => {
    expect(kilnTemperature(0, 10)).toBe(20);
    expect(kilnTemperature(5, 10)).toBe(610);
    expect(kilnTemperature(10, 10)).toBe(1200);
    expect(kilnTemperature(99, 10)).toBe(1200);
  });

  it('unlocks photos by total puzzles finished across both games', () => {
    const save = saveWith({ 1: won() });
    save.connections[1] = { order: [], solved: [0, 1, 2, 3], history: [], mistakes: 0, status: 'won' };
    expect(totalCompleted(save)).toBe(2);
    expect(unlockedPhotos(save, photos).map((p) => p.id)).toEqual(['a']);
  });

  it('only ever picks win photos from the unlocked ones, every Nth level', () => {
    expect(pickWinPhoto(3, [], 3)).toBeNull();
    expect(pickWinPhoto(4, photos, 3)).toBeNull();
    expect(pickWinPhoto(3, [photos[0]], 3)?.id).toBe('a');
    expect(pickWinPhoto(6, photos, 3)?.id).toBe('b');
    expect(pickWinPhoto(9, photos, 3)?.id).toBe('a');
  });
});

describe('pending reveals', () => {
  const config = {
    milestones: { wordle: { 2: 'Well done!', 3: '' }, connections: {} },
    photos: [{ id: 'p', src: 'p.jpg', alt: '', caption: '', unlockAt: 2 }],
  } as never;

  it('queues notes, photos and the finale once each', () => {
    const save = saveWith({ 1: won(), 2: won(), 3: won() });
    const reveals = pendingReveals(save, config);
    expect(reveals.map((r) => r.key)).toEqual(['note:wordle:2', 'kiln:p']);
    save.seen = ['note:wordle:2', 'kiln:p'];
    expect(pendingReveals(save, config)).toEqual([]);
  });
});

describe('LocalStorageRepository', () => {
  it('round-trips a save', async () => {
    const repo = new LocalStorageRepository(localStorage);
    const save = saveWith({ 1: won() });
    await repo.save(save);
    expect(await repo.load()).toEqual(save);
  });

  it('falls back to a fresh save on missing or corrupt data, keeping a copy of the corrupt data', async () => {
    const repo = new LocalStorageRepository(localStorage);
    expect(await repo.load()).toEqual(freshSave());
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(await repo.load()).toEqual(freshSave());
    expect(localStorage.getItem(`${STORAGE_KEY}:corrupt`)).toBe('{not json');
  });

  it('works with no storage at all', async () => {
    const repo = new LocalStorageRepository(undefined);
    await repo.save(freshSave());
    expect(await repo.load()).toEqual(freshSave());
  });

  it('fills in missing fields from older or partial saves', () => {
    const migrated = migrate({ wordle: { 1: won() }, settings: { unlocked: true } });
    expect(migrated.wordle[1].status).toBe('won');
    expect(migrated.connections).toEqual({});
    expect(migrated.settings).toEqual({ unlocked: true, seenHowTo: { wordle: false, connections: false } });
    expect(migrate('nonsense')).toEqual(freshSave());
  });
});
