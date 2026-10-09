import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { currentLevel, isLevelUnlocked, levelStatus } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';
import { LEVEL_COUNT, type Track } from '../progress/types';
import { LockIcon } from './icons';
import { Bloom, Sprout } from './SweetPea';

/** A shelf of 50 little pots: bisque when locked, glazed green when won, terracotta when lost. */
export function LevelMap({ track }: { track: Track }) {
  const { save } = useProgress();
  const current = currentLevel(save, track);
  const currentRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView?.({ block: 'center', behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <ol className="level-map" aria-label="Levels">
      {Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).map((level) => {
        const unlocked = isLevelUnlocked(save, track, level);
        const status = levelStatus(save, track, level);
        const state = !unlocked ? 'locked' : status === 'won' ? 'won' : status === 'lost' ? 'lost' : level === current ? 'current' : 'open';
        const label = `Level ${level}${state === 'locked' ? ', locked' : state === 'won' ? ', won' : state === 'lost' ? ', finished' : ''}`;
        const pot = (
          <>
            <svg className="pot-svg" viewBox="0 0 48 56" aria-hidden>
              <rect className="pot-rim" x="13" y="3" width="22" height="5" rx="2" />
              <path
                className="pot-body"
                d="M16 8h16c0 4-3.6 5-3.6 8.6 0 2 11.6 6.2 11.6 18.6 0 10.4-8 14.8-16 14.8S8 45.6 8 35.2c0-12.4 11.6-16.6 11.6-18.6C19.6 13 16 12 16 8z"
              />
              {(state === 'won' || state === 'lost') && <path className="pot-drip" d="M10.5 30c4 2.5 23 2.5 27 0" />}
              {state === 'current' && <Sprout />}
              {state === 'won' && (
                <g className="pot-bloom">
                  <path d="M24 3V-2" stroke="#3b733f" strokeWidth="1.6" strokeLinecap="round" />
                  <Bloom x={24} y={-6} scale={0.85} colour={level * 2 + Math.floor((level - 1) / 5) * 3} rotate={level % 2 ? 10 : -10} />
                </g>
              )}
            </svg>
            <span className="pot-num">{state === 'locked' ? <LockIcon width={14} height={14} /> : level}</span>
          </>
        );
        return (
          <li key={level}>
            {unlocked ? (
              <Link
                ref={level === current ? currentRef : undefined}
                to={`/${track}/${level}`}
                className={`pot pot-${state}`}
                aria-label={label}
                aria-current={level === current ? 'step' : undefined}
              >
                {pot}
              </Link>
            ) : (
              <span className={`pot pot-${state}`} aria-label={label} role="img">
                {pot}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
