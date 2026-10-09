import { Link } from 'react-router-dom';
import { Modal } from '../../components/Modal';
import { Polaroid } from '../../components/Polaroid';
import { ShareButton } from '../../components/ShareButton';
import { StatsPanel } from '../../components/Stats';
import { personal } from '../../config/personal';
import type { WordleLevel } from '../../data/types';
import { pickWinPhoto, unlockedPhotos } from '../../progress/selectors';
import { useProgress } from '../../progress/ProgressProvider';
import { LEVEL_COUNT, type WordleState } from '../../progress/types';
import { WIN_MESSAGES, wordleShareText } from './logic';

export function WordleResult({ level, state, onClose }: { level: WordleLevel; state: WordleState; onClose: () => void }) {
  const { save } = useProgress();
  const won = state.status === 'won';
  const n = state.guesses.length;
  // Only photos she's already seen come out of the kiln, so the gallery is never spoiled.
  const seenPhotos = unlockedPhotos(save, personal.photos).filter((p) => save.seen.includes(`kiln:${p.id}`));
  const photo = won ? pickWinPhoto(level.level, seenPhotos, personal.winPhotoEvery) : null;

  return (
    <Modal open onClose={onClose} labelledBy="result-title" className="result-modal">
      <p className="eyebrow">Wordle · Level {level.level}</p>
      <h2 id="result-title">{won ? WIN_MESSAGES[n - 1] : 'So close!'}</h2>
      <p className="lede">{won ? `You got it in ${n}/6, ${personal.name}!` : 'The word was'}</p>
      <div className="answer-tiles" aria-label={`The answer was ${level.answer}`}>
        {level.answer.split('').map((l, i) => (
          <span key={i} className="tile correct">
            {l}
          </span>
        ))}
      </div>
      <div className="fact-card">
        <span className="fact-label">Did you know?</span>
        <p>{level.note}</p>
      </div>
      {photo && (
        <div className="result-photo">
          <Polaroid photo={photo} size="sm" />
        </div>
      )}
      <StatsPanel track="wordle" highlightGuesses={won ? n : undefined} />
      <div className="btn-row result-actions">
        <ShareButton text={wordleShareText(personal.appTitle, level.level, state.guesses, level.answer, won)} />
        {level.level < LEVEL_COUNT ? (
          <Link className="btn" to={`/wordle/${level.level + 1}`}>
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
