import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { isModalOpen } from '../../components/Modal';
import { useHoldReveals } from '../../components/RevealGate';
import { useToast } from '../../components/Toast';
import type { WordleLevel } from '../../data/types';
import type { WordleState } from '../../progress/types';
import { LEVEL_COUNT } from '../../progress/types';
import { Board, REVEAL_MS } from './Board';
import { Keyboard } from './Keyboard';
import { MAX_GUESSES, WIN_MESSAGES, WORD_LENGTH, keyStates } from './logic';
import { WordleResult } from './WordleResult';
import { loadValidWords } from './words';
import './wordle.css';

interface Props {
  level: WordleLevel;
  initial?: WordleState;
  onChange: (state: WordleState) => void;
}

export function WordleGame({ level, initial, onChange }: Props) {
  const toast = useToast();
  const answer = level.answer;
  const [state, setState] = useState<WordleState>(() => initial ?? { guesses: [], status: 'playing' });
  const [input, setInput] = useState('');
  const [revealedCount, setRevealedCount] = useState(state.guesses.length);
  const [shake, setShake] = useState(false);
  const [bounceRow, setBounceRow] = useState<number | null>(null);
  const [awaitingResult, setAwaitingResult] = useState(false);
  const [showResult, setShowResult] = useState(state.status !== 'playing');
  const words = useRef<Set<string> | null>(null);
  const timers = useRef<number[]>([]);

  const finished = state.status !== 'playing';
  const revealing = revealedCount < state.guesses.length;
  useHoldReveals(revealing || awaitingResult || showResult);

  useEffect(() => {
    void loadValidWords().then((w) => {
      words.current = w;
    });
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const rejectGuess = (message: string) => {
    toast(message);
    setShake(true);
    later(() => setShake(false), 500);
  };

  const submit = async () => {
    if (input.length < WORD_LENGTH) return rejectGuess('Not enough letters');
    const valid = words.current ?? (await loadValidWords());
    if (!valid.has(input)) return rejectGuess('Not in word list');

    const guesses = [...state.guesses, input];
    const won = input === answer;
    const lost = !won && guesses.length === MAX_GUESSES;
    const next: WordleState = {
      guesses,
      status: won ? 'won' : lost ? 'lost' : 'playing',
      ...(won || lost ? { finishedAt: new Date().toISOString() } : {}),
    };
    setState(next);
    onChange(next);
    setInput('');
    if (won || lost) setAwaitingResult(true);

    later(() => {
      setRevealedCount(guesses.length);
      if (won) {
        setBounceRow(guesses.length - 1);
        toast(WIN_MESSAGES[guesses.length - 1], 2000);
        later(() => {
          setAwaitingResult(false);
          setShowResult(true);
        }, 2000);
      } else if (lost) {
        toast(answer, 2600);
        later(() => {
          setAwaitingResult(false);
          setShowResult(true);
        }, 2200);
      }
    }, REVEAL_MS);
  };

  const handleKey = (key: string) => {
    if (finished || revealing) return;
    if (key === 'Enter') void submit();
    else if (key === 'Backspace') setInput((s) => s.slice(0, -1));
    else if (/^[A-Z]$/.test(key)) setInput((s) => (s.length < WORD_LENGTH ? s + key : s));
  };

  // Physical keyboard on laptops/desktops.
  const handleKeyRef = useRef(handleKey);
  handleKeyRef.current = handleKey;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isModalOpen()) return;
      if (e.key === 'Enter' || e.key === 'Backspace') {
        e.preventDefault();
        handleKeyRef.current(e.key);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyRef.current(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const keys = keyStates(state.guesses.slice(0, revealedCount), answer);

  return (
    <div className="wordle">
      <Board
        guesses={state.guesses}
        answer={answer}
        input={input}
        revealedCount={revealedCount}
        shakeCurrent={shake}
        bounceRow={bounceRow}
        showInputRow={!finished}
      />
      {finished && !showResult && !awaitingResult && !revealing && (
        <div className="done-bar">
          <button type="button" className="btn" onClick={() => setShowResult(true)}>
            See results
          </button>
          {level.level < LEVEL_COUNT && (
            <Link className="btn btn-primary" to={`/wordle/${level.level + 1}`}>
              Next level →
            </Link>
          )}
        </div>
      )}
      <Keyboard states={keys} onKey={handleKey} />
      {showResult && <WordleResult level={level} state={state} onClose={() => setShowResult(false)} />}
    </div>
  );
}
