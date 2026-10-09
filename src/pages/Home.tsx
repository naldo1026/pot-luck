import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, GridIcon, KilnIcon, SettingsIcon, TilesIcon } from '../components/icons';
import { SweetPeaJug } from '../components/SweetPea';
import { personal } from '../config/personal';
import { completedCount, currentLevel, isFinaleUnlocked, totalCompleted, unlockedPhotos } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';
import { LEVEL_COUNT, TRACKS, type Track } from '../progress/types';

function greeting(hour = new Date().getHours()): [string, string] {
  if (hour < 12) return ['Morning', '☕'];
  if (hour < 18) return ['Afternoon', '🌿'];
  return ['Evening', '🕯️'];
}

const GAMES: Record<Track, { title: string; blurb: string; icon: ReactElement }> = {
  wordle: { title: 'Wordle', blurb: 'Guess the word in six tries', icon: <TilesIcon width={44} height={44} /> },
  connections: { title: 'Connections', blurb: 'Find four groups of four', icon: <GridIcon width={44} height={44} /> },
};

export function Home() {
  const { save } = useProgress();
  const [hello, emoji] = greeting();
  const total = totalCompleted(save);
  const fired = unlockedPhotos(save, personal.photos).length;
  const finale = isFinaleUnlocked(save);

  return (
    <main className="page home">
      <header className="home-head">
        <div className="home-topline">
          <p className="eyebrow">{personal.appTitle}</p>
          <Link to="/settings" className="icon-btn" aria-label="Settings">
            <SettingsIcon />
          </Link>
        </div>
        <div className="home-hero">
          <div>
            <h1>
              {hello}, {personal.greetingName} {emoji}
            </h1>
            <p className="home-sub">What are we making today?</p>
          </div>
          <SweetPeaJug className="home-jug" />
        </div>
      </header>

      <div className="home-games">
        {TRACKS.map((track) => {
          const done = completedCount(save, track);
          const level = currentLevel(save, track);
          const game = GAMES[track];
          return (
            <Link key={track} to={`/${track}`} className="card game-card">
              <span className="game-icon">{game.icon}</span>
              <span className="game-text">
                <strong>{game.title}</strong>
                <span>{game.blurb}</span>
                <span className="game-level">{level ? `Level ${level} of ${LEVEL_COUNT}` : 'All 50 done! 🎉'}</span>
              </span>
              <span className="progress-bar game-progress" aria-label={`${done} of ${LEVEL_COUNT} done`}>
                <span style={{ width: `${(done / LEVEL_COUNT) * 100}%` }} />
              </span>
            </Link>
          );
        })}
      </div>

      <Link to="/kiln" className="card side-card">
        <KilnIcon width={44} height={44} />
        <span className="game-text">
          <strong>The Kiln</strong>
          <span>
            {fired} of {personal.photos.length} pieces fired
          </span>
        </span>
      </Link>

      {finale ? (
        <Link to="/letter" className="card side-card envelope-card ready">
          <EnvelopeIcon width={48} />
          <span className="game-text">
            <strong>A letter for you 💌</strong>
            <span>You've earned it. Open it!</span>
          </span>
        </Link>
      ) : (
        <div className="card side-card envelope-card">
          <EnvelopeIcon width={48} />
          <span className="game-text">
            <strong>A sealed letter</strong>
            <span>Finish every puzzle to open it</span>
            <span className="progress-bar" aria-label={`${total} of ${LEVEL_COUNT * 2} puzzles done`}>
              <span style={{ width: `${(total / (LEVEL_COUNT * 2)) * 100}%` }} />
            </span>
            <span className="game-level">
              {total} / {LEVEL_COUNT * 2}
            </span>
          </span>
        </div>
      )}
    </main>
  );
}
