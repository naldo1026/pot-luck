import { useMemo, useState, type CSSProperties } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { EnvelopeIcon } from '../components/icons';
import { Bloom } from '../components/SweetPea';
import { BackLink, TopBar } from '../components/TopBar';
import { personal, personalText } from '../config/personal';
import { isFinaleUnlocked } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';

const CONFETTI_COLOURS = ['var(--green)', 'var(--clay)', 'var(--grp-0)', 'var(--grp-1)', 'var(--grp-2)', 'var(--grp-3)'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2,
        colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
        round: i % 3 === 0,
        drift: (Math.random() - 0.5) * 120,
      })),
    [],
  );
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className={p.round ? 'round' : undefined}
          style={
            {
              left: `${p.left}%`,
              background: p.colour,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Finale() {
  const { save } = useProgress();
  const [params] = useSearchParams();
  const [opened, setOpened] = useState(false);
  // In dev, /#/letter?preview lets you read the letter without finishing everything.
  const preview = import.meta.env.DEV && params.has('preview');
  if (!isFinaleUnlocked(save) && !preview) return <Navigate to="/" replace />;

  const from = personalText(personal.fromName) ?? 'me';
  const message = personalText(personal.finale.message) ?? "You finished every single puzzle. I'm so proud of you — and I love you to bits.";
  const paragraphs = message.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <TopBar left={<BackLink to="/" label="Home" />} title="A letter for you" />
      <main className="page finale">
        {!opened ? (
          <button type="button" className="envelope-big" onClick={() => setOpened(true)}>
            <EnvelopeIcon width={180} />
            <span className="hand">Tap to open</span>
          </button>
        ) : (
          <>
            <Confetti />
            <article className="letter-paper">
              <svg className="letter-sprig" viewBox="0 0 70 50" aria-hidden>
                <path d="M8 46C22 34 34 24 60 10" fill="none" stroke="#3b733f" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M30 30c-6-3-11-1-12 3 5 2 9 1 12-3z" fill="#5c9a5f" />
                <Bloom x={58} y={12} scale={1.1} colour={0} rotate={20} />
                <Bloom x={40} y={22} scale={0.95} colour={1} rotate={-10} />
                <Bloom x={20} y={36} scale={0.8} colour={2} rotate={-25} />
              </svg>
              <h2 className="hand">{personalText(personal.finale.title) ?? 'You did it!'}</h2>
              {paragraphs.map((p, i) => (
                <p key={i} className="hand">
                  {p}
                </p>
              ))}
              <p className="hand letter-sign">— {from} x</p>
            </article>
          </>
        )}
      </main>
    </>
  );
}
