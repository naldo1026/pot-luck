import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { personal, personalText } from '../config/personal';
import { pendingReveals } from '../progress/reveals';
import { useProgress } from '../progress/ProgressProvider';
import { EnvelopeIcon } from './icons';
import { Modal } from './Modal';
import { Polaroid } from './Polaroid';
import { useRevealGate } from './RevealGate';

const TRACK_NAMES = { wordle: 'Wordle', connections: 'Connections' } as const;

export function RevealHost() {
  const { save, markSeen } = useProgress();
  const { suppressed } = useRevealGate();
  const navigate = useNavigate();
  const pending = useMemo(() => pendingReveals(save), [save]);
  const current = suppressed ? undefined : pending[0];
  if (!current) return null;

  const close = () => markSeen(current.key);
  const from = personalText(personal.fromName) ?? 'me';

  if (current.kind === 'note') {
    return (
      <Modal key={current.key} open onClose={close} labelledBy="reveal-title" className="reveal-modal">
        <div className="note-paper">
          <p className="eyebrow">A little note from {from}</p>
          <h2 id="reveal-title">
            {TRACK_NAMES[current.track]} level {current.level} done!
          </h2>
          <p className="hand note-message">{current.message}</p>
          <p className="hand note-sign">— {from} x</p>
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={close}>
          Aww ❤️
        </button>
      </Modal>
    );
  }

  if (current.kind === 'photo') {
    return (
      <Modal key={current.key} open onClose={close} labelledBy="reveal-title" className="reveal-modal">
        <p className="eyebrow">Fresh out of the kiln</p>
        <h2 id="reveal-title">A new piece has been fired! 🔥</h2>
        <div className="reveal-photo">
          <Polaroid photo={current.photo} size="lg" reveal />
        </div>
        <div className="btn-row">
          <button
            type="button"
            className="btn"
            onClick={() => {
              close();
              navigate('/kiln');
            }}
          >
            See the Kiln
          </button>
          <button type="button" className="btn btn-primary" onClick={close}>
            Lovely!
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal key={current.key} open onClose={close} labelledBy="reveal-title" className="reveal-modal">
      <div className="reveal-envelope">
        <EnvelopeIcon width={96} />
      </div>
      <h2 id="reveal-title">All 100 done!</h2>
      <p className="lede">You've finished every single puzzle. There's a letter waiting for you…</p>
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => {
          close();
          navigate('/letter');
        }}
      >
        Open it 💌
      </button>
    </Modal>
  );
}
