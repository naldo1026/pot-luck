import { wordleLevels } from '../../data/wordle/answers';

let cache: Promise<Set<string>> | null = null;

/** Lazily loads ~12.5k valid guesses (plus every answer, so no answer can ever be rejected). */
export function loadValidWords(): Promise<Set<string>> {
  cache ??= import('../../data/wordle/valid-guesses.txt?raw').then((mod) => {
    const words = new Set(mod.default.split('\n').filter(Boolean));
    for (const { answer } of wordleLevels) words.add(answer);
    return words;
  });
  return cache;
}
