/**
 * Guards the puzzle data — run `npm test` after editing any puzzle or swapping in
 * an inside joke, and these will point at exactly what needs fixing.
 */
import { describe, expect, it } from 'vitest';
import { connectionsPuzzles, wordleLevels } from '.';
import validRaw from './wordle/valid-guesses.txt?raw';

const valid = new Set(validRaw.split('\n').filter(Boolean));
const LEVELS = Array.from({ length: 50 }, (_, i) => i + 1);
const MAX_TILE_CHARS = 14;

describe('Wordle levels', () => {
  it('has exactly levels 1–50, in order', () => {
    expect(wordleLevels.map((l) => l.level)).toEqual(LEVELS);
  });

  it.each(wordleLevels)('level $level ($answer) is five capital letters with a note', ({ answer, note }) => {
    expect(answer).toMatch(/^[A-Z]{5}$/);
    expect(note.trim().length).toBeGreaterThan(0);
  });

  it('never repeats an answer', () => {
    const answers = wordleLevels.map((l) => l.answer);
    expect(new Set(answers).size).toBe(answers.length);
  });

  it('uses real words (inside-joke slots may use anything — answers are always accepted as guesses)', () => {
    const unknown = wordleLevels.filter((l) => !l.personalSlot && !valid.has(l.answer)).map((l) => `${l.level}: ${l.answer}`);
    expect(unknown).toEqual([]);
  });
});

describe('Connections puzzles', () => {
  it('has exactly levels 1–50, in order', () => {
    expect(connectionsPuzzles.map((p) => p.level)).toEqual(LEVELS);
  });

  it.each(connectionsPuzzles)('level $level has four groups, one of each colour', ({ groups }) => {
    expect(groups).toHaveLength(4);
    expect(groups.map((g) => g.difficulty).sort()).toEqual([0, 1, 2, 3]);
  });

  it.each(connectionsPuzzles)('level $level has 16 different words that fit on a tile', ({ groups }) => {
    const words = groups.flatMap((g) => g.words);
    expect(words).toHaveLength(16);
    for (const group of groups) {
      expect(group.words, group.name).toHaveLength(4);
      expect(group.name.trim(), 'group name').not.toBe('');
    }
    for (const word of words) {
      expect(word, word).toBe(word.toUpperCase());
      expect(word.trim(), word).toBe(word);
      expect(word.length, word).toBeGreaterThan(0);
      expect(word.length, `${word} is too long for a tile`).toBeLessThanOrEqual(MAX_TILE_CHARS);
    }
    expect(new Set(words.map((w) => w.toUpperCase())).size, 'duplicate word in puzzle').toBe(16);
  });

  it('never reuses a category name', () => {
    const names = connectionsPuzzles.flatMap((p) => p.groups.map((g) => g.name.toUpperCase()));
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes).toEqual([]);
  });
});
