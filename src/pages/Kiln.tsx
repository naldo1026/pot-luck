import { useState } from 'react';
import { PotIcon } from '../components/icons';
import { Modal } from '../components/Modal';
import { Polaroid } from '../components/Polaroid';
import { BackLink, TopBar } from '../components/TopBar';
import { personal, type PersonalPhoto } from '../config/personal';
import { FIRING_TEMP, kilnTemperature, totalCompleted } from '../progress/selectors';
import { useProgress } from '../progress/ProgressProvider';

export function Kiln() {
  const { save } = useProgress();
  const completed = totalCompleted(save);
  const [viewing, setViewing] = useState<PersonalPhoto | null>(null);
  const fired = personal.photos.filter((p) => completed >= p.unlockAt).length;

  return (
    <>
      <TopBar left={<BackLink to="/" label="Home" />} title="The Kiln" subtitle={`${fired} of ${personal.photos.length} fired`} />
      <main className="page kiln">
        <p className="kiln-intro">Every puzzle you finish heats the kiln. When it hits {FIRING_TEMP}°C, a new piece comes out.</p>
        <div className="kiln-grid">
          {personal.photos.map((photo) => {
            if (completed >= photo.unlockAt) {
              return (
                <button key={photo.id} type="button" className="kiln-slot fired" onClick={() => setViewing(photo)} aria-label={`Open photo: ${photo.alt}`}>
                  <Polaroid photo={photo} size="sm" />
                </button>
              );
            }
            const temp = kilnTemperature(completed, photo.unlockAt);
            const left = photo.unlockAt - completed;
            return (
              <div key={photo.id} className="kiln-slot unfired">
                <div className="clay-piece" aria-hidden>
                  <PotIcon width={56} height={64} />
                </div>
                <div className="gauge" role="meter" aria-valuemin={20} aria-valuemax={FIRING_TEMP} aria-valuenow={temp} aria-label="Kiln temperature">
                  <span style={{ width: `${(temp / FIRING_TEMP) * 100}%` }} />
                </div>
                <p className="gauge-temp">{temp}°C</p>
                <p className="gauge-left">
                  {left} more {left === 1 ? 'puzzle' : 'puzzles'}
                </p>
              </div>
            );
          })}
        </div>
      </main>
      <Modal open={!!viewing} onClose={() => setViewing(null)} labelledBy="photo-title" className="photo-modal">
        <h2 id="photo-title" className="visually-hidden">
          {viewing?.alt}
        </h2>
        {viewing && <Polaroid photo={viewing} size="lg" tilt={0} />}
      </Modal>
    </>
  );
}
