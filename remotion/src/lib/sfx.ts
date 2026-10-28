import {SHOTS, PUNCHES} from './layout';

export type Sfx = {t: number; f: 'whoosh' | 'whoosh-short' | 'pop' | 'click' | 'impact' | 'riser'; v: number};

// Text / graphic appearances (pop), diagram builds (click) — each tied to the spoken cue.
const POPS = [0.1, 0.62, 1.58, 2.24, 2.56, 3.14, 5.2, 7.78, 9.82, 11.84, 12.54, 18.1, 19.26, 19.78, 20.32, 20.68, 25.24, 28.58, 30.2, 32.38, 33.34, 36.9, 39.64, 41.56, 43.54, 45.6, 50.54, 52.1, 54.2, 55.58, 59.48, 60.12, 60.92, 61.5, 61.9, 64.6, 70.22, 72.92, 75.64, 77.44, 81.08, 82.64, 84.52, 88.34, 89.4, 92.08, 95.98, 97.34, 98.9, 101.94, 106.18, 107.18, 109.38, 111.74, 112.06, 113.2, 114.02, 116.34, 117.84];
const CLICKS = [5.7, 6.3, 15.6, 17.7, 34.82, 35.22, 35.34, 35.46, 37.2, 37.9, 57.3, 62.6, 66.2, 66.32, 66.44, 66.56, 79.74, 81.2, 81.32, 104.24, 115.75, 117.04, 117.11, 117.18, 117.25, 117.32];
const IMPACTS = [8.82, 16.6, 22.84, 48.76, 73.16, 78.3, 85.96];

export const SFX: Sfx[] = [
  ...SHOTS.slice(1).map((s): Sfx => ({t: s.t - 0.05, f: 'whoosh', v: 0.32})),
  ...POPS.map((t): Sfx => ({t, f: 'pop', v: 0.22})),
  ...CLICKS.map((t): Sfx => ({t, f: 'click', v: 0.2})),
  ...IMPACTS.map((t): Sfx => ({t, f: 'impact', v: 0.42})),
  {t: 47.9, f: 'riser', v: 0.3},
  {t: 26.66, f: 'riser', v: 0.25},
  ...PUNCHES.filter((p) => !IMPACTS.some((i) => Math.abs(i - p) < 0.3)).map((t): Sfx => ({t, f: 'whoosh-short', v: 0.18})),
];
