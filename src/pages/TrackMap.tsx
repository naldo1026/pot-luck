import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { StatsIcon } from '../components/icons';
import { LevelMap } from '../components/LevelMap';
import { StatsModal } from '../components/Stats';
import { BackLink, TopBar } from '../components/TopBar';
import { completedCount } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';
import { LEVEL_COUNT, TRACKS, type Track } from '../progress/types';

export const TRACK_NAMES: Record<Track, string> = { wordle: 'Wordle', connections: 'Connections' };

export const asTrack = (value: string | undefined): Track | null => (TRACKS.includes(value as Track) ? (value as Track) : null);

export function TrackMap() {
  const track = asTrack(useParams().track);
  const { save } = useProgress();
  const [stats, setStats] = useState(false);
  if (!track) return <Navigate to="/" replace />;

  return (
    <>
      <TopBar
        left={<BackLink to="/" label="Home" />}
        title={TRACK_NAMES[track]}
        subtitle={`${completedCount(save, track)} / ${LEVEL_COUNT} done`}
        right={
          <button type="button" className="icon-btn" aria-label="Stats" onClick={() => setStats(true)}>
            <StatsIcon />
          </button>
        }
      />
      <main className="page">
        <LevelMap track={track} />
      </main>
      <StatsModal track={track} open={stats} onClose={() => setStats(false)} />
    </>
  );
}
