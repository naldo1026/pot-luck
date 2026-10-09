import { Link } from 'react-router-dom';
import { Modal } from '../../components/Modal';
import { Polaroid } from '../../components/Polaroid';
import { ShareButton } from '../../components/ShareButton';
import { StatsPanel } from '../../components/Stats';
import { personal } from '../../config/personal';
import type { ConnectionsPuzzle } from '../../data/types';
import { pickWinPhoto, unlockedPhotos } from '../../progress/selectors';
import { useProgress } from '../../progress/ProgressProvider';
import { LEVEL_COUNT, type ConnectionsState } from '../../progress/types';
import { WIN_MESSAGES, connectionsShareText } from './logic';

export function ConnectionsResult({ puzzle, state, onClose }: { puzzle: ConnectionsPuzzle; state: ConnectionsState; onClose: () => void }) {
  const { save } = useProgress();
  const won = state.status === 'won';
  const seenPhotos = unlockedPhotos(save, personal.photos).filter((p) => save.seen.includes(`kiln:${p.id}`));
  const photo = won ? pickWinPhoto(puzzle.level, seenPhotos, personal.winPhotoEvery) : null;
  const share = connectionsShareText(personal.appTitle, puzzle.level, state, puzzle);
  const mistakeText = state.mistakes === 0 ? `Not a single mistake, ${personal.name}!` : `${state.mistakes} ${state.mistakes === 1 ? 'mistake' : 'mistakes'}`;

  return (
    <Modal open onClose={onClose} labelledBy="result-title" className="result-modal">
      <p className="eyebrow">Connections · Level {puzzle.level}</p>
      <h2 id="result-title">{won ? WIN_MESSAGES[state.mistakes] : 'Next time!'}</h2>
      <p className="lede">{won ? mistakeText : 'That one was a tricky bake.'}</p>
      <pre className="emoji-grid" aria-label="Your guesses">
        {share.split('\n').slice(2).join('\n')}
      </pre>
      {photo && (
        <div className="result-photo">
          <Polaroid photo={photo} size="sm" />
        </div>
      )}
      <StatsPanel track="connections" />
      <div className="btn-row result-actions">
        <ShareButton text={share} />
        {puzzle.level < LEVEL_COUNT ? (
          <Link className="btn" to={`/connections/${puzzle.level + 1}`}>
            Next level →
          </Link>
        ) : (
          <Link className="btn" to="/">
            Home
          </Link>
        )}
      </div>
    </Modal>
  );
}
