import { describe, expect, it } from 'vitest';
import { keyStates, scoreGuess, wordleShareText } from './logic';

describe('scoreGuess', () => {
  it('marks exact, misplaced and missing letters', () => {
    expect(scoreGuess('GLAZE', 'GLAZE')).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    expect(scoreGuess('WHEEL', 'GLAZE')).toEqual(['absent', 'absent', 'present', 'absent', 'present']);
  });

  it('only marks as many duplicates as the answer has', () => {
    // Answer has one E (at the end): only the last E in EERIE is correct, the others are absent.
    expect(scoreGuess('EERIE', 'GLAZE')).toEqual(['absent', 'absent', 'absent', 'absent', 'correct']);
    // ABBEY vs BABES: B and A swapped, second B correct, E correct, Y absent.
    expect(scoreGuess('BABES', 'ABBEY')).toEqual(['present', 'present', 'correct', 'correct', 'absent']);
  });

  it('gives exact matches priority over earlier misplaced copies', () => {
    // Answer QUEUE has two Es; guess has three. E at index 2 and 4 are correct; index 0 has none left.
    expect(scoreGuess('EVEXE', 'QUEUE')).toEqual(['absent', 'absent', 'correct', 'absent', 'correct']);
    // HELLO has exactly two Ls, both claimed by exact matches, so the first L is absent.
    expect(scoreGuess('LOLLY', 'HELLO')).toEqual(['absent', 'present', 'correct', 'correct', 'absent']);
  });
});

describe('keyStates', () => {
  it('keeps the best state per letter (correct > present > absent)', () => {
    const keys = keyStates(['LEAVE', 'GLAZE'], 'GLAZE');
    expect(keys.L).toBe('correct');
    expect(keys.E).toBe('correct');
    expect(keys.V).toBe('absent');
  });

  it('does not downgrade a correct letter', () => {
    const keys = keyStates(['GLAZE', 'EAGLE'], 'GLAZE');
    expect(keys.G).toBe('correct');
    expect(keys.A).toBe('correct');
  });
});

describe('wordleShareText', () => {
  it('builds an emoji grid', () => {
    expect(wordleShareText('Pot Luck', 3, ['WHEEL', 'GLAZE'], 'GLAZE', true)).toBe('Pot Luck Wordle #3 2/6\n\n⬜⬜🟨⬜🟨\n🟩🟩🟩🟩🟩');
    expect(wordleShareText('Pot Luck', 3, ['WHEEL'], 'GLAZE', false).split('\n')[0]).toBe('Pot Luck Wordle #3 X/6');
  });
});
