import type { CSSProperties } from 'react';
import { MAX_GUESSES, WORD_LENGTH, scoreGuess, type LetterState } from './logic';

export const FLIP_STAGGER_MS = 280;
export const FLIP_DURATION_MS = 500;
export const REVEAL_MS = (WORD_LENGTH - 1) * FLIP_STAGGER_MS + FLIP_DURATION_MS;

interface BoardProps {
  guesses: string[];
  answer: string;
  input: string;
  /** Rows below this index are fully revealed; the row at this index (if submitted) is flipping. */
  revealedCount: number;
  shakeCurrent: boolean;
  bounceRow: number | null;
  showInputRow: boolean;
}

export function Board({ guesses, answer, input, revealedCount, shakeCurrent, bounceRow, showInputRow }: BoardProps) {
  return (
    <div className="board-wrap">
      <div className="board" role="group" aria-label="Guesses">
        {Array.from({ length: MAX_GUESSES }, (_, row) => {
          if (row < guesses.length) {
            const states = scoreGuess(guesses[row], answer);
            const mode = row < revealedCount ? (row === bounceRow ? 'bounce' : 'done') : 'reveal';
            return <Row key={row} letters={guesses[row]} states={states} mode={mode} />;
          }
          if (row === guesses.length && showInputRow) {
            return <Row key={row} letters={input} mode="input" shake={shakeCurrent} />;
          }
          return <Row key={row} letters="" mode="empty" />;
        })}
      </div>
    </div>
  );
}

type RowMode = 'empty' | 'input' | 'reveal' | 'done' | 'bounce';

function Row({ letters, states, mode, shake = false }: { letters: string; states?: LetterState[]; mode: RowMode; shake?: boolean }) {
  const label =
    mode === 'done' || mode === 'bounce'
      ? `${letters.split('').map((l, i) => `${l} ${states?.[i]}`).join(', ')}`
      : mode === 'input' && letters
        ? `Typing ${letters.split('').join(' ')}`
        : undefined;
  return (
    <div className={`board-row${shake ? ' shake' : ''}`} aria-label={label} role={label ? 'img' : undefined}>
      {Array.from({ length: WORD_LENGTH }, (_, i) => {
        const letter = letters[i] ?? '';
        const state = states?.[i];
        const classes = ['tile'];
        if (letter) classes.push('filled');
        if (mode === 'input' && letter && i === letters.length - 1) classes.push('pop');
        if (state && mode !== 'input') classes.push(state);
        if (mode === 'reveal') classes.push('reveal');
        if (mode === 'bounce') classes.push('bounce');
        return (
          <div key={i} className={classes.join(' ')} style={{ '--i': i } as CSSProperties} aria-hidden={!!label}>
            {letter}
          </div>
        );
      })}
    </div>
  );
}
