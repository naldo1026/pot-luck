import type { CSSProperties } from 'react';
import { personal, personalText, type PersonalPhoto } from '../config/personal';
import { photoSrc } from '../config/photoSrc';

interface PolaroidProps {
  photo: PersonalPhoto;
  /** Degrees of tilt; defaults to a small, stable tilt per photo. */
  tilt?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Plays the "glaze reveal" (clay sepia → full colour, with a shimmer). */
  reveal?: boolean;
}

export function Polaroid({ photo, tilt, size = 'md', reveal = false }: PolaroidProps) {
  const index = personal.photos.findIndex((p) => p.id === photo.id);
  const angle = tilt ?? [-3, 2.5, -1.5, 3.5, -2.5][Math.max(0, index) % 5];
  const caption = personalText(photo.caption);
  return (
    <figure className={`polaroid polaroid-${size}${reveal ? ' revealing' : ''}`} style={{ '--tilt': `${angle}deg` } as CSSProperties}>
      <div className="polaroid-img">
        <img src={photoSrc(photo, index)} alt={photo.alt} style={{ objectPosition: photo.focus ?? 'center' }} draggable={false} />
        <span className="glaze-shimmer" aria-hidden />
      </div>
      <figcaption className="hand">{caption ?? ' '}</figcaption>
    </figure>
  );
}
