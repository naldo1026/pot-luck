// Lists anything still marked ✏️ in the personal config (and inside-joke slots in the puzzles).
// Run before sharing the link:  npm run check:personal
import { readFileSync } from 'node:fs';

const MARK = '✏️';
const files = {
  config: 'src/config/personal.ts',
  wordle: 'src/data/wordle/answers.ts',
  connA: 'src/data/connections/puzzles-01-25.ts',
  connB: 'src/data/connections/puzzles-26-50.ts',
};

const read = (path) => {
  try {
    return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8').split('\n');
  } catch {
    return [];
  }
};

// Placeholders in the config: any non-comment line containing the marker.
const todo = read(files.config)
  .map((text, i) => ({ text: text.trim(), line: i + 1 }))
  .filter(({ text }) => text.includes(MARK) && !/^(\*|\/)/.test(text) && !text.includes('PLACEHOLDER ='));


console.log('\n🏺  Pot Luck — personal touches\n');
if (todo.length === 0) {
  console.log('✅  Every placeholder in src/config/personal.ts has been filled in.');
} else {
  console.log(`✏️   ${todo.length} placeholder(s) left in ${files.config}:`);
  for (const { line, text } of todo) console.log(`    line ${String(line).padStart(3)}  ${text}`);
  console.log('\n    (Placeholders are hidden in the real build, and the passcode lock stays off until you set an answer.)');
}

// Inside-joke slots are optional — just list them.
let slots = 0;
for (const key of ['wordle', 'connA', 'connB']) {
  read(files[key]).forEach((line, i, lines) => {
    if (line.includes('swap for your own')) {
      slots++;
      console.log(`${slots === 1 ? '\n💡  Optional inside-joke slots (swap for your own, then run npm test):\n' : ''}    ${files[key]}:${i + 2}  ${lines[i + 1]?.trim().slice(0, 80)}`);
    }
  });
}
console.log('');
process.exitCode = todo.length ? 1 : 0;
