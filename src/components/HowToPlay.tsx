import type { Track } from '../progress/types';
import { Modal } from './Modal';

function ExampleTile({ letter, state }: { letter: string; state?: 'correct' | 'present' | 'absent' }) {
  return <span className={`htp-tile${state ? ` ${state}` : ''}`}>{letter}</span>;
}

function WordleHelp() {
  return (
    <>
      <p className="lede">Guess the word in 6 tries.</p>
      <ul className="htp-list">
        <li>Each guess must be a real 5-letter word.</li>
        <li>The tiles change colour to show how close you are.</li>
      </ul>
      <div className="htp-example">
        <div className="htp-row">
          {'GLAZE'.split('').map((l, i) => (
            <ExampleTile key={i} letter={l} state={i === 0 ? 'correct' : undefined} />
          ))}
        </div>
        <p>
          <strong>G</strong> is in the word and in the right spot.
        </p>
      </div>
      <div className="htp-example">
        <div className="htp-row">
          {'WHEEL'.split('').map((l, i) => (
            <ExampleTile key={i} letter={l} state={i === 2 ? 'present' : undefined} />
          ))}
        </div>
        <p>
          <strong>E</strong> is in the word but in the wrong spot.
        </p>
      </div>
      <div className="htp-example">
        <div className="htp-row">
          {'KILNS'.split('').map((l, i) => (
            <ExampleTile key={i} letter={l} state={i === 3 ? 'absent' : undefined} />
          ))}
        </div>
        <p>
          <strong>N</strong> is not in the word at all.
        </p>
      </div>
      <p className="htp-foot">Every word has a little fact waiting for you at the end. Finish a level to unlock the next one.</p>
    </>
  );
}

function ConnectionsHelp() {
  return (
    <>
      <p className="lede">Find groups of four things that share something in common.</p>
      <ul className="htp-list">
        <li>Select four tiles and tap Submit to check your guess.</li>
        <li>Find all four groups without making 4 mistakes!</li>
        <li>Watch out for red herrings — some words look like they fit more than one group.</li>
      </ul>
      <div className="htp-groups">
        <div className="htp-group" style={{ background: 'var(--grp-0)' }}>
          <strong>Types of clay</strong> Stoneware, Porcelain, Terracotta, Earthenware
        </div>
        <div className="htp-group" style={{ background: 'var(--grp-3)' }}>
          <strong>___pot</strong> Tea, Jack, Crack, Hot
        </div>
      </div>
      <p className="htp-foot">Each puzzle has exactly one solution. Groups run from 🟨 straightforward to 🟪 tricky.</p>
    </>
  );
}

export function HowToPlay({ track, open, onClose }: { track: Track; open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="htp-title" className="htp">
      <h2 id="htp-title">How to play</h2>
      {track === 'wordle' ? <WordleHelp /> : <ConnectionsHelp />}
      <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
        Let's play
      </button>
    </Modal>
  );
}
