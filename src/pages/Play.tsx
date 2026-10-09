import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { HowToPlay } from '../components/HowToPlay';
import { HelpIcon, StatsIcon } from '../components/icons';
import { StatsModal } from '../components/Stats';
import { BackLink, TopBar } from '../components/TopBar';
import { getConnectionsPuzzle, getWordleLevel } from '../data';
import { ConnectionsGame } from '../games/connections/ConnectionsGame';
import { WordleGame } from '../games/wordle/WordleGame';
import { isLevelUnlocked } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';
import { TRACK_NAMES, asTrack } from './TrackMap';

export function Play() {
  const params = useParams();
  const track = asTrack(params.track);
  const level = Number(params.level);
  const { save, setWordle, setConnections, markHowToSeen } = useProgress();
  const [howTo, setHowTo] = useState(() => (track ? !save.settings.seenHowTo[track] : false));
  const [stats, setStats] = useState(false);

  if (!track) return <Navigate to="/" replace />;
  if (!isLevelUnlocked(save, track, level)) return <Navigate to={`/${track}`} replace />;

  const wordle = track === 'wordle' ? getWordleLevel(level) : undefined;
  const puzzle = track === 'connections' ? getConnectionsPuzzle(level) : undefined;
  if (!wordle && !puzzle) return <Navigate to={`/${track}`} replace />;

  const closeHowTo = () => {
    setHowTo(false);
    markHowToSeen(track);
  };

  return (
    <div className="page-fixed">
      <TopBar
        left={<BackLink to={`/${track}`} label="All levels" />}
        title={`Level ${level}`}
        subtitle={TRACK_NAMES[track]}
        right={
          <>
            <button type="button" className="icon-btn" aria-label="How to play" onClick={() => setHowTo(true)}>
              <HelpIcon />
            </button>
            <button type="button" className="icon-btn" aria-label="Stats" onClick={() => setStats(true)}>
              <StatsIcon />
            </button>
          </>
        }
      />
      <main className={`game-area game-${track}`}>
        {wordle && <WordleGame key={`w${level}`} level={wordle} initial={save.wordle[level]} onChange={(s) => setWordle(level, s)} />}
        {puzzle && (
          <ConnectionsGame key={`c${level}`} puzzle={puzzle} initial={save.connections[level]} onChange={(s) => setConnections(level, s)} />
        )}
      </main>
      <HowToPlay track={track} open={howTo} onClose={closeHowTo} />
      <StatsModal track={track} open={stats} onClose={() => setStats(false)} />
    </div>
  );
}
