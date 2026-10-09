import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHoldReveals } from '../../components/RevealGate';
import { PeaPod } from '../../components/SweetPea';
import { useToast } from '../../components/Toast';
import type { ConnectionsPuzzle } from '../../data/types';
import { LEVEL_COUNT, type ConnectionsState } from '../../progress/types';
import { shuffle } from '../../utils/shuffle';
import { ConnectionsResult } from './ConnectionsResult';
import { GroupBar, Tile } from './Grid';
import { GROUP_SIZE, MAX_MISTAKES, WIN_MESSAGES, applyGuess, evaluateSelection, newConnectionsState, revealOrder } from './logic';
import './connections.css';

const JUMP_MS = 4 * 90 + 350;
const REVEAL_STEP_MS = 800;

interface Props {
  puzzle: ConnectionsPuzzle;
  initial?: ConnectionsState;
  onChange: (state: ConnectionsState) => void;
}

export function ConnectionsGame({ puzzle, initial, onChange }: Props) {
  const toast = useToast();
  const [state, setState] = useState<ConnectionsState>(() => initial ?? newConnectionsState(puzzle));
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [lastSolved, setLastSolved] = useState<number | null>(null);
  const [lossRevealed, setLossRevealed] = useState(() => (state.status === 'lost' ? GROUP_SIZE : 0));
  const [awaitingResult, setAwaitingResult] = useState(false);
  const [showResult, setShowResult] = useState(state.status !== 'playing');
  const timers = useRef<number[]>([]);

  const finished = state.status !== 'playing';
  useHoldReveals(busy || awaitingResult || showResult);

  useEffect(() => {
    // Save the initial shuffle so the board looks the same after a reload.
    if (!initial) onChange(state);
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const commit = (next: ConnectionsState) => {
    setState(next);
    onChange(next);
  };

  const toggle = (word: string) => {
    if (busy || finished) return;
    setSelected((sel) => (sel.includes(word) ? sel.filter((w) => w !== word) : sel.length < GROUP_SIZE ? [...sel, word] : sel));
  };

  const submit = () => {
    if (selected.length !== GROUP_SIZE || busy || finished) return;
    const outcome = evaluateSelection(selected, puzzle, state.solved, state.history);
    if (outcome.kind === 'alreadyGuessed') {
      toast('Already guessed!');
      return;
    }

    setBusy(true);
    setJumping(true);
    later(() => {
      setJumping(false);
      const next = applyGuess(state, selected, outcome, puzzle);

      if (outcome.kind === 'correct') {
        setLastSolved(outcome.groupIndex);
        setSelected([]);
        commit(next);
        setBusy(false);
        if (next.status === 'won') {
          setAwaitingResult(true);
          later(() => toast(WIN_MESSAGES[next.mistakes], 2000), 500);
          later(() => {
            setAwaitingResult(false);
            setShowResult(true);
          }, 2400);
        }
        return;
      }

      setShaking(true);
      if (outcome.kind === 'oneAway') toast('One away…');
      later(() => {
        setShaking(false);
        commit(next);
        if (next.status === 'lost') {
          setSelected([]);
          setAwaitingResult(true);
          toast('Next time!', 1800);
          const remaining = GROUP_SIZE - next.solved.length;
          for (let k = 1; k <= remaining; k++) later(() => setLossRevealed(k), 600 + k * REVEAL_STEP_MS);
          later(() => {
            setBusy(false);
            setAwaitingResult(false);
            setShowResult(true);
          }, 600 + remaining * REVEAL_STEP_MS + 1200);
        } else {
          setBusy(false);
        }
      }, 520);
    }, JUMP_MS);
  };

  const shuffleTiles = () => {
    if (busy || finished) return;
    commit({ ...state, order: shuffle(state.order) });
  };

  // Groups shown as bars: solved ones, plus (after a loss) the rest revealed one by one.
  const shownGroups = state.status === 'lost' ? revealOrder(state, puzzle).slice(0, state.solved.length + lossRevealed) : state.solved;
  const shownWords = new Set(shownGroups.flatMap((i) => puzzle.groups[i].words));
  const tiles = state.order.filter((w) => !shownWords.has(w));
  const mistakesLeft = MAX_MISTAKES - state.mistakes;

  return (
    <div className="connections">
      <p className="conn-intro">Create four groups of four!</p>
      <div className="conn-board">
        {shownGroups.map((i) => (
          <GroupBar key={i} group={puzzle.groups[i]} animate={i === lastSolved || (state.status === 'lost' && !state.solved.includes(i) && busy)} />
        ))}
        {tiles.length > 0 && (
          <div className="conn-grid">
            {tiles.map((word) => {
              const pos = selected.indexOf(word);
              return (
                <Tile
                  key={word}
                  word={word}
                  selected={pos !== -1}
                  jumpIndex={jumping && pos !== -1 ? pos : null}
                  shaking={shaking}
                  disabled={finished}
                  onToggle={toggle}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="mistakes" aria-label={`${mistakesLeft} mistakes remaining`}>
        Mistakes remaining:
        <PeaPod remaining={mistakesLeft} total={MAX_MISTAKES} />
      </div>

      {finished && !busy && !awaitingResult ? (
        <div className="conn-actions">
          <button type="button" className="btn" onClick={() => setShowResult(true)}>
            See results
          </button>
          {puzzle.level < LEVEL_COUNT && (
            <Link className="btn btn-primary" to={`/connections/${puzzle.level + 1}`}>
              Next level →
            </Link>
          )}
        </div>
      ) : (
        <div className="conn-actions">
          <button type="button" className="btn" onClick={shuffleTiles} disabled={busy || finished}>
            Shuffle
          </button>
          <button type="button" className="btn" onClick={() => setSelected([])} disabled={busy || selected.length === 0}>
            Deselect all
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={busy || selected.length !== GROUP_SIZE}>
            Submit
          </button>
        </div>
      )}

      {showResult && <ConnectionsResult puzzle={puzzle} state={state} onClose={() => setShowResult(false)} />}
    </div>
  );
}
