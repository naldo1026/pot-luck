import type { PersonalPhoto } from './personal';

/**
 * Dev-only `?placeholders` flag (e.g. http://localhost:5173/?placeholders#/kiln) swaps the
 * real photos for neutral stand-ins, so layouts can be checked without showing her pictures.
 */
const usePlaceholders = (): boolean =>
  import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('placeholders');

const HUES = ['#a9c79c', '#f0d27a', '#b3c6e3', '#c7a6d1', '#e8b49a'];

function placeholder(photo: PersonalPhoto, index: number): string {
  const hue = HUES[index % HUES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200"><rect width="900" height="1200" fill="${hue}"/><circle cx="450" cy="470" r="170" fill="#fff" opacity=".55"/><rect x="200" y="700" width="500" height="320" rx="160" fill="#fff" opacity=".55"/><text x="450" y="1120" font-family="sans-serif" font-size="64" text-anchor="middle" fill="#2d2622">${photo.id}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function photoSrc(photo: PersonalPhoto, index = 0): string {
  return usePlaceholders() ? placeholder(photo, index) : photo.src;
}
