import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { connectionsPuzzles, wordleLevels } from '../data';
import { WIN_MESSAGES as CONNECTIONS_WIN } from '../games/connections/logic';
import { WIN_MESSAGES as WORDLE_WIN } from '../games/wordle/logic';
import { loadValidWords } from '../games/wordle/words';
import type { ProgressRepository } from '../progress/repository';
import { isLevelUnlocked } from '../progress/selectors';
import { freshSave, type SaveData } from '../progress/types';

class MemoryRepository implements ProgressRepository {
  constructor(public data: SaveData) {}
  async load() {
    return structuredClone(this.data);
  }
  async save(data: SaveData) {
    this.data = structuredClone(data);
  }
}

function seeded(patch: (s: SaveData) => void = () => {}) {
  const save = freshSave();
  save.settings.seenHowTo = { wordle: true, connections: true };
  patch(save);
  return new MemoryRepository(save);
}

const tick = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

/** Waits for the board, then lets effects (like the keyboard listener) attach. */
async function boardReady() {
  const board = await screen.findByRole('group', { name: 'Guesses' });
  await tick(50);
  return board;
}

function setup(path: string, repo: MemoryRepository) {
  window.location.hash = `#${path}`;
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(<App repository={repo} />);
  return user;
}

// The 12k-word list is lazy-loaded; warm it up so the first guess isn't racing the import.
beforeAll(async () => {
  await loadValidWords();
}, 20000);

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wordle', () => {
  const { answer } = wordleLevels[0];
  const wrongWords = ['CRANE', 'MOIST', 'PLUMB', 'FIGHT', 'WOVEN', 'JUMPY'].filter((w) => w !== answer);

  it('wins level 1, saves it, and unlocks level 2', async () => {
    const repo = seeded();
    const user = setup('/wordle/1', repo);
    await boardReady();

    await user.keyboard(`${answer}{Enter}`);
    await tick(6000);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: WORDLE_WIN[0] })).toBeInTheDocument();
    expect(within(dialog).getByText(wordleLevels[0].note)).toBeInTheDocument();
    expect(repo.data.wordle[1].status).toBe('won');
    expect(isLevelUnlocked(repo.data, 'wordle', 2)).toBe(true);
  });

  it('rejects words that are not in the list', async () => {
    const repo = seeded();
    const user = setup('/wordle/1', repo);
    await boardReady();

    await user.keyboard('ZQZQZ{Enter}');
    expect(await screen.findByText('Not in word list')).toBeInTheDocument();
    await user.keyboard('{Backspace}{Backspace}{Backspace}{Enter}');
    expect(await screen.findByText('Not enough letters')).toBeInTheDocument();
    expect(repo.data.wordle[1]).toBeUndefined();
  });

  it('loses after six guesses, shows the answer, and still unlocks the next level', async () => {
    const repo = seeded();
    const user = setup('/wordle/1', repo);
    await boardReady();

    for (const word of wrongWords.slice(0, 6)) {
      await user.keyboard(`${word}{Enter}`);
      await tick(2000);
    }
    await tick(5000);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'So close!' })).toBeInTheDocument();
    expect(within(dialog).getByLabelText(`The answer was ${answer}`)).toBeInTheDocument();
    expect(repo.data.wordle[1].status).toBe('lost');
    expect(isLevelUnlocked(repo.data, 'wordle', 2)).toBe(true);
  });

  it('restores a game in progress after a reload', async () => {
    const repo = seeded((s) => {
      s.wordle[1] = { guesses: [wrongWords[0]], status: 'playing' };
    });
    setup('/wordle/1', repo);
    const board = await boardReady();
    expect(within(board).getAllByText(wrongWords[0][0]).length).toBeGreaterThan(0);
  });

  it('sends a locked level back to the level map', async () => {
    setup('/wordle/5', seeded());
    expect(await screen.findByRole('list', { name: 'Levels' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/wordle');
  });
});

describe('Connections', () => {
  const puzzle = connectionsPuzzles[0];

  it('handles one-away, repeated guesses and a win', async () => {
    const repo = seeded();
    const user = setup('/connections/1', repo);
    await screen.findByText('Create four groups of four!');

    const pick = async (words: string[]) => {
      for (const word of words) await user.click(screen.getByRole('button', { name: word }));
    };
    const submit = async (wait = 2000) => {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      if (wait) await tick(wait);
    };

    // Three from one group + one from another.
    const oneAway = [...puzzle.groups[0].words.slice(0, 3), puzzle.groups[1].words[0]];
    await pick(oneAway);
    await submit();
    expect(await screen.findByText('One away…')).toBeInTheDocument();
    expect(repo.data.connections[1].mistakes).toBe(1);

    // The same four again costs nothing (check the toast before it fades).
    await submit(0);
    expect(await screen.findByText('Already guessed!')).toBeInTheDocument();
    expect(repo.data.connections[1].mistakes).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Deselect all' }));
    for (const group of puzzle.groups) {
      await pick(group.words);
      await submit();
    }
    await tick(4000);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: CONNECTIONS_WIN[1] })).toBeInTheDocument();
    expect(repo.data.connections[1].status).toBe('won');
    expect(isLevelUnlocked(repo.data, 'connections', 2)).toBe(true);
  });
});

describe('Surprises', () => {
  it('shows the level-10 note after the result card is closed', async () => {
    const repo = seeded((s) => {
      for (let level = 1; level <= 9; level++) s.wordle[level] = { guesses: [wordleLevels[level - 1].answer], status: 'won' };
      // Pretend the Kiln photos have been seen so only the note is pending.
      s.seen = ['kiln:photo-1'];
    });
    const user = setup('/wordle/10', repo);
    await boardReady();

    await user.keyboard(`${wordleLevels[9].answer}{Enter}`);
    await tick(6000);
    const result = await screen.findByRole('dialog');
    await user.click(within(result).getByRole('button', { name: 'Close' }));

    const note = await screen.findByRole('dialog');
    expect(within(note).getByRole('heading', { name: 'Wordle level 10 done!' })).toBeInTheDocument();
    await user.click(within(note).getByRole('button', { name: 'Aww ❤️' }));
    expect(repo.data.seen).toContain('note:wordle:10');
  });
});
