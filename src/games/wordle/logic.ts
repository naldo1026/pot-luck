export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export type LetterState = 'correct' | 'present' | 'absent';

/**
 * Two-pass scoring so duplicate letters behave like the real Wordle:
 * exact matches claim their letters first, then "present" is limited
 * to however many of that letter are left over in the answer.
 */
export function scoreGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const remaining: Record<string, number> = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) result[i] = 'correct';
    else remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;
    const letter = guess[i];
    if (remaining[letter] > 0) {
      result[i] = 'present';
      remaining[letter]--;
    }
  }
  return result;
}

const RANK: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 };

/** Keyboard colours: a key keeps its best-ever state (correct > present > absent). */
export function keyStates(guesses: string[], answer: string): Record<string, LetterState> {
  const keys: Record<string, LetterState> = {};
  for (const guess of guesses) {
    scoreGuess(guess, answer).forEach((state, i) => {
      const letter = guess[i];
      const prev = keys[letter];
      if (!prev || RANK[state] > RANK[prev]) keys[letter] = state;
    });
  }
  return keys;
}

const EMOJI: Record<LetterState, string> = { correct: '🟩', present: '🟨', absent: '⬜' };

export function wordleShareText(title: string, level: number, guesses: string[], answer: string, won: boolean): string {
  const score = won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const rows = guesses.map((g) => scoreGuess(g, answer).map((s) => EMOJI[s]).join(''));
  return [`${title} Wordle #${level} ${score}`, '', ...rows].join('\n');
}

/** Pottery-flavoured versions of NYT's "Genius / Magnificent / …". Index = guesses used − 1. */
export const WIN_MESSAGES = [
  'Masterpiece!',
  'Kiln-fired genius!',
  'Beautifully thrown!',
  'Lovely glaze!',
  'Smashing!',
  'Phew — just out of the kiln!',
];
