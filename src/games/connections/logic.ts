import type { ConnectionsPuzzle } from '../../data/types';
import type { ConnectionsState } from '../../progress/types';
import { shuffle } from '../../utils/shuffle';

export const MAX_MISTAKES = 4;
export const GROUP_SIZE = 4;

export type Outcome =
  | { kind: 'correct'; groupIndex: number }
  | { kind: 'oneAway' }
  | { kind: 'wrong' }
  | { kind: 'alreadyGuessed' };

const guessKey = (words: string[]) => [...words].sort().join('|');

export function evaluateSelection(
  selection: string[],
  puzzle: ConnectionsPuzzle,
  solved: number[],
  history: string[][],
): Outcome {
  const key = guessKey(selection);
  if (history.some((g) => guessKey(g) === key)) return { kind: 'alreadyGuessed' };

  let bestOverlap = 0;
  for (let i = 0; i < puzzle.groups.length; i++) {
    if (solved.includes(i)) continue;
    const overlap = selection.filter((w) => puzzle.groups[i].words.includes(w)).length;
    if (overlap === GROUP_SIZE) return { kind: 'correct', groupIndex: i };
    bestOverlap = Math.max(bestOverlap, overlap);
  }
  return bestOverlap === GROUP_SIZE - 1 ? { kind: 'oneAway' } : { kind: 'wrong' };
}

export function newConnectionsState(puzzle: ConnectionsPuzzle, random: () => number = Math.random): ConnectionsState {
  return {
    order: shuffle(
      puzzle.groups.flatMap((g) => g.words),
      random,
    ),
    solved: [],
    history: [],
    mistakes: 0,
    status: 'playing',
  };
}

/** Applies a submitted guess. Returns the same state object for "already guessed" (no penalty). */
export function applyGuess(
  state: ConnectionsState,
  selection: string[],
  outcome: Outcome,
  puzzle: ConnectionsPuzzle,
  now: () => string = () => new Date().toISOString(),
): ConnectionsState {
  if (outcome.kind === 'alreadyGuessed' || state.status !== 'playing') return state;
  const history = [...state.history, [...selection]];

  if (outcome.kind === 'correct') {
    const words = puzzle.groups[outcome.groupIndex].words;
    const solved = [...state.solved, outcome.groupIndex];
    const won = solved.length === puzzle.groups.length;
    return {
      ...state,
      history,
      solved,
      order: state.order.filter((w) => !words.includes(w)),
      status: won ? 'won' : 'playing',
      ...(won ? { finishedAt: now() } : {}),
    };
  }

  const mistakes = state.mistakes + 1;
  const lost = mistakes >= MAX_MISTAKES;
  return {
    ...state,
    history,
    mistakes,
    status: lost ? 'lost' : 'playing',
    ...(lost ? { finishedAt: now() } : {}),
  };
}

/** Group order for the finished board: solved first (in solve order), then the rest easiest→hardest. */
export function revealOrder(state: ConnectionsState, puzzle: ConnectionsPuzzle): number[] {
  const rest = puzzle.groups
    .map((g, i) => ({ i, d: g.difficulty }))
    .filter(({ i }) => !state.solved.includes(i))
    .sort((a, b) => a.d - b.d)
    .map(({ i }) => i);
  return [...state.solved, ...rest];
}

const EMOJI = ['🟨', '🟩', '🟦', '🟪'];

export function connectionsShareText(title: string, level: number, state: ConnectionsState, puzzle: ConnectionsPuzzle): string {
  const difficultyOf = (word: string) => puzzle.groups.find((g) => g.words.includes(word))?.difficulty ?? 0;
  const rows = state.history.map((guess) => guess.map((w) => EMOJI[difficultyOf(w)]).join(''));
  return [`${title} Connections #${level}`, '', ...rows].join('\n');
}

/** Pottery-flavoured versions of NYT's "Perfect! / Great! / Solid! / Phew!". Index = mistakes made. */
export const WIN_MESSAGES = ['Flawless glaze!', 'Beautifully thrown!', 'Solid stoneware!', 'Phew — fresh out the kiln!'];
