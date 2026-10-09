import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...props,
});

export const BackIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const HelpIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M9.6 9.2a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
);

export const StatsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 20V12M12 20V5M19 20v-6" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const BackspaceIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    <path d="M17 9l-5 6M12 9l5 6" />
  </svg>
);

export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const ShareIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v12M7 8l5-5 5 5" />
    <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
  </svg>
);

export const FlameIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 22c4 0 7-2.7 7-6.6 0-3.6-2.6-6-4.1-8.4-.4 2-1.5 3.2-2.7 3.6.3-3.3-1.2-6.4-3.7-8.6.2 3.4-1.6 5.6-3 7.6C4.4 11.2 5 12.7 5 15.4 5 19.3 8 22 12 22z" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.1 4.7 2.8C13.1 5.1 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z" />
  </svg>
);

/** A little thrown pot. */
export const PotIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 56" aria-hidden {...p}>
    <rect x="13" y="3" width="22" height="5" rx="2" fill="currentColor" />
    <path
      d="M16 8h16c0 4-3.6 5-3.6 8.6 0 2 11.6 6.2 11.6 18.6 0 10.4-8 14.8-16 14.8S8 45.6 8 35.2c0-12.4 11.6-16.6 11.6-18.6C19.6 13 16 12 16 8z"
      fill="currentColor"
    />
  </svg>
);

/** Letter tiles for the Wordle card. */
export const TilesIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 48" aria-hidden {...p}>
    <rect x="3" y="3" width="19" height="19" rx="4" fill="var(--green)" />
    <rect x="26" y="3" width="19" height="19" rx="4" fill="var(--honey)" />
    <rect x="3" y="26" width="19" height="19" rx="4" fill="var(--slate)" />
    <rect x="26" y="26" width="19" height="19" rx="4" fill="var(--green)" />
  </svg>
);

/** Four glaze swatches for the Connections card. */
export const GridIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 48" aria-hidden {...p}>
    <rect x="3" y="5" width="42" height="8" rx="3" fill="var(--grp-0)" />
    <rect x="3" y="15" width="42" height="8" rx="3" fill="var(--grp-1)" />
    <rect x="3" y="25" width="42" height="8" rx="3" fill="var(--grp-2)" />
    <rect x="3" y="35" width="42" height="8" rx="3" fill="var(--grp-3)" />
  </svg>
);

export const KilnIcon = (p: IconProps) => (
  <svg viewBox="0 0 48 48" aria-hidden {...p}>
    <path d="M8 44V18a16 16 0 0 1 32 0v26z" fill="var(--clay)" />
    <path d="M15 44V24a9 9 0 0 1 18 0v20z" fill="#2d2622" />
    <path
      d="M24 41c3.6 0 6-2.3 6-5.6 0-3-2.2-4.6-3.4-6.6-.4 1.6-1.2 2.6-2.3 3 .3-2.8-1-5.2-3.1-7.1.2 2.8-1.3 4.6-2.5 6.3-1 1.4-.7 2.6-.7 4.4 0 3.3 2.4 5.6 6 5.6z"
      fill="#f0b44c"
    />
  </svg>
);

export const EnvelopeIcon = ({ open = false, ...p }: IconProps & { open?: boolean }) => (
  <svg viewBox="0 0 48 40" aria-hidden {...p}>
    <rect x="2" y="8" width="44" height="30" rx="4" fill="var(--card)" stroke="var(--line-strong)" strokeWidth="1.5" />
    {open ? (
      <path d="M2 12 24 2l22 10" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
    ) : (
      <path d="M3 10l21 15 21-15" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
    )}
    <circle cx="24" cy={open ? 9 : 24} r="5" fill="var(--clay)" />
    <path d="M22 23.6l1.4 1.4 2.6-2.6" stroke="#fff" strokeWidth="1.3" fill="none" opacity={open ? 0 : 1} />
  </svg>
);
