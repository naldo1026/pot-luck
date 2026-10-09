// Regenerates src/data/wordle/valid-guesses.txt from the `word-list` package (MIT).
// Wordle answers are merged in at runtime, so an answer can never be rejected.
import { readFileSync, writeFileSync } from 'node:fs';
import wordListPath from 'word-list';

const words = readFileSync(wordListPath, 'utf8')
  .split('\n')
  .map((w) => w.trim().toUpperCase())
  .filter((w) => /^[A-Z]{5}$/.test(w));

const unique = [...new Set(words)].sort();
writeFileSync(new URL('../src/data/wordle/valid-guesses.txt', import.meta.url), unique.join('\n') + '\n');
console.log(`Wrote ${unique.length} five-letter words.`);
