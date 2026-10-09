import { describe, expect, it } from 'vitest';
import type { ConnectionsPuzzle } from '../../data/types';
import { applyGuess, connectionsShareText, evaluateSelection, newConnectionsState, revealOrder } from './logic';

const puzzle: ConnectionsPuzzle = {
  level: 1,
  groups: [
    { name: 'CLAY', words: ['STONEWARE', 'PORCELAIN', 'TERRACOTTA', 'EARTHENWARE'], difficulty: 0 },
    { name: 'BISCUITS', words: ['HOBNOB', 'BOURBON', 'DIGESTIVE', 'RICH TEA'], difficulty: 1 },
    { name: 'SPICE GIRLS', words: ['BABY', 'GINGER', 'SPORTY', 'SCARY'], difficulty: 2 },
    { name: '___POT', words: ['TEA', 'JACK', 'CRACK', 'HOT'], difficulty: 3 },
  ],
};
const now = () => '2026-10-08T00:00:00.000Z';

describe('evaluateSelection', () => {
  it('recognises a correct group', () => {
    expect(evaluateSelection(['BABY', 'SCARY', 'GINGER', 'SPORTY'], puzzle, [], [])).toEqual({ kind: 'correct', groupIndex: 2 });
  });

  it('says one away when three of four belong together', () => {
    expect(evaluateSelection(['BABY', 'SCARY', 'GINGER', 'HOBNOB'], puzzle, [], [])).toEqual({ kind: 'oneAway' });
  });

  it('says wrong otherwise', () => {
    expect(evaluateSelection(['BABY', 'SCARY', 'HOBNOB', 'TEA'], puzzle, [], [])).toEqual({ kind: 'wrong' });
  });

  it('spots a repeated guess in any order', () => {
    const history = [['BABY', 'SCARY', 'HOBNOB', 'TEA']];
    expect(evaluateSelection(['TEA', 'HOBNOB', 'SCARY', 'BABY'], puzzle, [], history)).toEqual({ kind: 'alreadyGuessed' });
  });
});

describe('applyGuess', () => {
  it('removes solved words and wins after four groups', () => {
    let state = newConnectionsState(puzzle, () => 0.5);
    expect(state.order).toHaveLength(16);
    puzzle.groups.forEach((g, i) => {
      state = applyGuess(state, [...g.words], { kind: 'correct', groupIndex: i }, puzzle, now);
    });
    expect(state.status).toBe('won');
    expect(state.order).toEqual([]);
    expect(state.solved).toEqual([0, 1, 2, 3]);
    expect(state.finishedAt).toBe(now());
  });

  it('loses after four mistakes, and a repeat guess costs nothing', () => {
    let state = newConnectionsState(puzzle);
    const wrong = ['BABY', 'SCARY', 'HOBNOB', 'TEA'];
    state = applyGuess(state, wrong, { kind: 'wrong' }, puzzle, now);
    const same = applyGuess(state, wrong, { kind: 'alreadyGuessed' }, puzzle, now);
    expect(same).toBe(state);
    for (let i = 0; i < 3; i++) state = applyGuess(state, wrong, { kind: 'wrong' }, puzzle, now);
    expect(state.mistakes).toBe(4);
    expect(state.status).toBe('lost');
  });

  it('reveals unsolved groups easiest first after a loss', () => {
    const state = { ...newConnectionsState(puzzle), solved: [3], status: 'lost' as const };
    expect(revealOrder(state, puzzle)).toEqual([3, 0, 1, 2]);
  });
});

describe('connectionsShareText', () => {
  it('colours each guess by group difficulty', () => {
    let state = newConnectionsState(puzzle);
    state = applyGuess(state, ['BABY', 'SCARY', 'GINGER', 'HOBNOB'], { kind: 'oneAway' }, puzzle, now);
    state = applyGuess(state, ['TEA', 'JACK', 'CRACK', 'HOT'], { kind: 'correct', groupIndex: 3 }, puzzle, now);
    expect(connectionsShareText('Pot Luck', 1, state, puzzle)).toBe('Pot Luck Connections #1\n\n🟦🟦🟦🟩\n🟪🟪🟪🟪');
  });
});
