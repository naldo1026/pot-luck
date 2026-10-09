import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PotIcon } from './components/icons';
import { RevealGateProvider } from './components/RevealGate';
import { RevealHost } from './components/RevealHost';
import { ToastProvider } from './components/Toast';
import { Finale } from './pages/Finale';
import { Home } from './pages/Home';
import { Kiln } from './pages/Kiln';
import { LockScreen } from './pages/LockScreen';
import { Play } from './pages/Play';
import { Settings } from './pages/Settings';
import { TrackMap } from './pages/TrackMap';
import { ProgressProvider, useProgress } from './progress/ProgressProvider';
import type { ProgressRepository } from './progress/repository';
import { isPasscodeEnabled } from './utils/passcode';

function Splash() {
  return (
    <div className="splash" aria-label="Loading">
      <PotIcon style={{ color: 'var(--green)' }} />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Block body on purpose: newer browsers return a Promise from scrollTo, and an
    // effect must only ever return a cleanup function.
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell() {
  const { save, setSettings } = useProgress();
  const theme = save.settings.theme ?? 'system';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

  if (isPasscodeEnabled() && !save.settings.unlocked) {
    return <LockScreen onUnlock={() => setSettings({ unlocked: true })} />;
  }

  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kiln" element={<Kiln />} />
        <Route path="/letter" element={<Finale />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/:track" element={<TrackMap />} />
        <Route path="/:track/:level" element={<Play />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <RevealHost />
    </div>
  );
}

export default function App({ repository }: { repository?: ProgressRepository }) {
  return (
    <HashRouter>
      <ToastProvider>
        <ProgressProvider repository={repository} fallback={<Splash />}>
          <RevealGateProvider>
            <Shell />
          </RevealGateProvider>
        </ProgressProvider>
      </ToastProvider>
    </HashRouter>
  );
}
