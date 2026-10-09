import { perfectConnections, trackStats, wordleDistribution } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';
import type { Track } from '../progress/types';
import { Modal } from './Modal';

/** Played / win % / streaks, plus the guess distribution (Wordle) or perfect count (Connections). */
export function StatsPanel({ track, highlightGuesses }: { track: Track; highlightGuesses?: number }) {
  const { save } = useProgress();
  const stats = trackStats(save, track);
  const tiles: [string, number | string][] = [
    ['Played', stats.played],
    ['Win %', stats.winPct],
    ['Current streak', stats.currentStreak],
    ['Max streak', stats.maxStreak],
  ];

  return (
    <div className="stats">
      <div className="stats-grid">
        {tiles.map(([label, value]) => (
          <div key={label} className="stat">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>
      {track === 'wordle' ? <Distribution dist={wordleDistribution(save)} highlight={highlightGuesses} /> : <Perfect count={perfectConnections(save)} />}
    </div>
  );
}

function Distribution({ dist, highlight }: { dist: number[]; highlight?: number }) {
  const max = Math.max(1, ...dist);
  return (
    <div className="dist">
      <h3>Guess distribution</h3>
      {dist.map((count, i) => (
        <div key={i} className="dist-row">
          <span className="dist-n">{i + 1}</span>
          <span className={`dist-bar${highlight === i + 1 ? ' current' : ''}`} style={{ width: `${Math.max(7, (count / max) * 100)}%` }}>
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

function Perfect({ count }: { count: number }) {
  return (
    <p className="perfect">
      <strong>{count}</strong> flawless {count === 1 ? 'puzzle' : 'puzzles'} (no mistakes) ✨
    </p>
  );
}

export function StatsModal({ track, open, onClose }: { track: Track; open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="stats-title">
      <h2 id="stats-title">Your stats</h2>
      <p className="lede">{track === 'wordle' ? 'Wordle' : 'Connections'}</p>
      <StatsPanel track={track} />
    </Modal>
  );
}
