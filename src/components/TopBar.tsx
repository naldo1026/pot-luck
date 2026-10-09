import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BackIcon } from './icons';

export function TopBar({ left, title, subtitle, right }: { left?: ReactNode; title: ReactNode; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <header className="topbar">
      <div className="topbar-side">{left}</div>
      <h1 className="topbar-title">
        {subtitle && <small>{subtitle}</small>}
        {title}
      </h1>
      <div className="topbar-side right">{right}</div>
    </header>
  );
}

export function BackLink({ to, label = 'Back' }: { to: string; label?: string }) {
  return (
    <Link to={to} className="icon-btn" aria-label={label}>
      <BackIcon />
    </Link>
  );
}
