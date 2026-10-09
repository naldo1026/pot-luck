import type { SVGProps } from 'react';

/** Sweet pea colours — blush, pink, lilac, magenta, cream. */
export const PEA_COLOURS = [
  { petal: '#f2a9c4', wing: '#e27ba3' },
  { petal: '#c9a8e6', wing: '#a57fd0' },
  { petal: '#e8789f', wing: '#c2507f' },
  { petal: '#f7d0de', wing: '#eaa3bd' },
  { petal: '#b98bd9', wing: '#8f62bd' },
];

/**
 * One sweet pea bloom drawn around (0, 0): a ruffled "standard" petal behind two
 * "wings" and a little keel. Use inside an <svg>, positioned with x/y/scale.
 */
export function Bloom({ x = 0, y = 0, scale = 1, colour = 0, rotate = 0 }: { x?: number; y?: number; scale?: number; colour?: number; rotate?: number }) {
  const { petal, wing } = PEA_COLOURS[colour % PEA_COLOURS.length];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 -9c3.2-1.6 7.6-.6 8.6 3 .9 3.2-1.2 6-4.6 7H-4C-7.4 0-9.5-2.8-8.6-6c1-3.6 5.4-4.6 8.6-3z" fill={petal} />
      <path d="M-5.6-6.4c1.6.6 2.6 1.6 3 2.8M5.6-6.4c-1.6.6-2.6 1.6-3 2.8" stroke={wing} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" />
      <ellipse cx="-2.6" cy="2" rx="3.4" ry="2.9" fill={wing} />
      <ellipse cx="2.6" cy="2" rx="3.4" ry="2.9" fill={wing} />
      <path d="M-1.6 4.2c.8 1.4 2.4 1.4 3.2 0" stroke="#fff" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M-1.4 5.2 0 7.4l1.4-2.2" fill="#3b733f" />
    </g>
  );
}

/** A little tendril curl, for decoration. */
function Tendril({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#5c9a5f" strokeWidth="1.2" strokeLinecap="round" />;
}

/** A thrown jug full of sweet peas — the home screen illustration. */
export function SweetPeaJug(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 140" aria-hidden {...props}>
      {/* stems */}
      <g fill="none" stroke="#3b733f" strokeWidth="2" strokeLinecap="round">
        <path d="M58 64C55 48 44 38 30 30" />
        <path d="M60 64c0-18 2-32 6-46" />
        <path d="M63 64c6-14 18-22 32-26" />
        <path d="M57 64c-6-8-16-12-28-10" />
        <path d="M62 64c10-6 22-6 32 0" />
      </g>
      {/* leaves */}
      <g fill="#5c9a5f">
        <path d="M45 44c-6-1-10 2-11 6 5 1 9-1 11-6z" />
        <path d="M72 40c6-3 11-1 13 3-5 2-10 1-13-3z" />
        <path d="M61 34c-4-4-4-9-1-12 3 4 3 8 1 12z" />
      </g>
      <Tendril d="M36 34c-4-2-8 0-7 4 1 3 5 2 4-1" />
      <Tendril d="M88 38c3-4 8-4 9 0 0 3-4 3-4 0" />
      <Tendril d="M66 20c4-2 8 1 6 4-2 2-5 0-3-2" />
      {/* blooms */}
      <Bloom x={30} y={28} scale={1.15} colour={0} rotate={-18} />
      <Bloom x={66} y={16} scale={1.25} colour={1} rotate={6} />
      <Bloom x={96} y={36} scale={1.1} colour={2} rotate={20} />
      <Bloom x={27} y={53} scale={0.95} colour={3} rotate={-30} />
      <Bloom x={95} y={63} scale={0.95} colour={4} rotate={28} />
      <Bloom x={48} y={40} scale={0.8} colour={2} rotate={-8} />
      <Bloom x={80} y={46} scale={0.85} colour={0} rotate={14} />
      {/* the jug */}
      <path d="M44 62h32v4c0 4-4 5-4 9 0 3 14 9 14 26 0 18-12 27-26 27S34 119 34 101c0-17 14-23 14-26 0-4-4-5-4-9z" fill="var(--clay)" />
      <path d="M76 82c8 0 12 5 12 11s-5 10-10 10" fill="none" stroke="var(--clay)" strokeWidth="5" strokeLinecap="round" />
      <path d="M36.5 96c10 5 37 5 47 0" fill="none" stroke="var(--green)" strokeWidth="6" strokeLinecap="round" />
      <path d="M38 108c10 4 34 4 44 0" fill="none" stroke="#f6f1e7" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <rect x="42" y="60" width="36" height="5" rx="2.5" fill="var(--clay-deep)" />
      <ellipse cx="50" cy="86" rx="3" ry="6" fill="#fff" opacity=".18" />
    </svg>
  );
}

/** Four peas in a pod — one pops out for each Connections mistake. */
export function PeaPod({ remaining, total = 4 }: { remaining: number; total?: number }) {
  return (
    <svg className="pea-pod" viewBox="0 0 108 36" aria-hidden>
      <path d="M8 18C14 6 92 4 100 18 92 31 14 30 8 18z" fill="#cfe2c6" stroke="#3b733f" strokeWidth="2" />
      <path d="M8 18c-3-5-2-10 2-13" fill="none" stroke="#3b733f" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 12C30 8 78 8 94 14" fill="none" stroke="#3b733f" strokeWidth="1" opacity=".35" />
      {Array.from({ length: total }, (_, i) => (
        <g key={i} className={`pea${i < remaining ? '' : ' popped'}`}>
          <circle cx={28 + i * 17} cy={18} r={7.2} fill="#5c9a5f" />
          <circle cx={26 + i * 17} cy={15.6} r={2.2} fill="#fff" opacity=".45" />
        </g>
      ))}
    </svg>
  );
}

/** A sprout curling out of the pot she's on now. */
export function Sprout() {
  return (
    <g className="sprout">
      <path d="M24 3c0-6 1-10 3-13" fill="none" stroke="#3b733f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25.5-4c-5-2-8 0-9 3 4 1 7 0 9-3z" fill="#5c9a5f" />
      <path d="M26.5-8c4-3 8-2 9 1-4 2-7 1-9-1z" fill="#5c9a5f" />
      <path d="M27-10c2-3 5-2 4 1-1 2-3 1-2-1" fill="none" stroke="#5c9a5f" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}
