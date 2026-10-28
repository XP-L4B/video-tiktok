import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const FPS = 30;
export const DURATION_S = 119.78;
export const W = 1080;
export const H = 1920;

// Fonts are bundled in public/fonts (Inter + Space Grotesk, OFL) so renders work offline.
export const fontBody = 'Inter';
export const fontHead = 'Space Grotesk';
for (const w of ['500', '600', '700', '800', '900']) {
  loadFont({family: fontBody, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w});
}
for (const w of ['500', '700']) {
  loadFont({family: fontHead, url: staticFile(`fonts/space-grotesk-latin-${w}-normal.woff2`), weight: w});
}

export const C = {
  bg: '#070B14',
  bg2: '#0D1424',
  panel: 'rgba(16, 23, 40, 0.86)',
  panelBorder: 'rgba(255,255,255,0.10)',
  text: '#F4F7FB',
  muted: '#8A97B1',
  cyan: '#3CE6FF',
  violet: '#8B5CF6',
  yellow: '#FFE14D',
  red: '#FF4D6D',
  green: '#3DF5A6',
  magenta: '#FF4FD8',
  orange: '#FF9F43',
};
