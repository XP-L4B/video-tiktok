import face from '../data/face.json';
import {easeInOut, lerp} from './anim';

/** Geometry of the presenter window on the 1080x1920 canvas. */
export type Geo = {x: number; y: number; w: number; h: number; r: number; ring: number};

export const FULL: Geo = {x: 0, y: 0, w: 1080, h: 1920, r: 0, ring: 0};
export const SPLIT_B: Geo = {x: 40, y: 880, w: 1000, h: 980, r: 52, ring: 1};
export const SPLIT_R: Geo = {x: 556, y: 250, w: 484, h: 1210, r: 48, ring: 1};
export const DEVICE: Geo = {x: 110, y: 300, w: 860, h: 1120, r: 40, ring: 1};
export const circle = (cx: number, cy: number, d: number): Geo => ({x: cx - d / 2, y: cy - d / 2, w: d, h: d, r: d / 2, ring: 1});

export type Shot = {
  t: number; // when the transition into this shot starts (s)
  geo: Geo;
  z0: number; // zoom at shot start
  z1: number; // zoom at shot end (slow push / pull)
  ay?: number; // where the face sits vertically inside the window (0..1)
  focus?: 'face' | 'center';
  tr?: number; // transition duration
  caption: number; // caption block center y
};

// Each layout change is tied to the sentence that motivates it (see STORYBOARD.md).
export const SHOTS: Shot[] = [
  {t: 0, geo: FULL, z0: 1.0, z1: 1.1, caption: 1430},
  {t: 1.45, geo: circle(540, 820, 560), z0: 1.75, z1: 1.85, ay: 0.46, caption: 1480},
  {t: 4.9, geo: SPLIT_B, z0: 1.05, z1: 1.12, caption: 1560},
  {t: 10.94, geo: FULL, z0: 1.06, z1: 1.16, caption: 1430},
  {t: 12.2, geo: circle(770, 1100, 480), z0: 1.7, z1: 1.8, ay: 0.46, caption: 1500},
  {t: 18.9, geo: circle(540, 1130, 420), z0: 1.75, z1: 1.85, ay: 0.46, caption: 1500},
  {t: 24.0, geo: FULL, z0: 1.06, z1: 1.2, caption: 1430},
  {t: 29.15, geo: circle(540, 1080, 540), z0: 1.7, z1: 1.8, ay: 0.46, caption: 1500},
  {t: 33.2, geo: SPLIT_B, z0: 1.04, z1: 1.1, caption: 1560},
  {t: 39.05, geo: SPLIT_R, z0: 1.15, z1: 1.2, caption: 1590},
  {t: 44.15, geo: FULL, z0: 1.05, z1: 1.2, caption: 1430},
  {t: 49.2, geo: circle(540, 1080, 540), z0: 1.7, z1: 1.8, ay: 0.46, caption: 1500},
  {t: 53.95, geo: SPLIT_B, z0: 1.04, z1: 1.1, caption: 1560},
  {t: 61.4, geo: SPLIT_R, z0: 1.15, z1: 1.22, caption: 1590},
  {t: 65.2, geo: circle(830, 1170, 380), z0: 1.8, z1: 1.9, ay: 0.46, caption: 1500},
  {t: 73.8, geo: FULL, z0: 1.05, z1: 1.18, caption: 1430},
  {t: 78.95, geo: SPLIT_B, z0: 1.05, z1: 1.1, caption: 1560},
  {t: 81.95, geo: FULL, z0: 1.0, z1: 1.12, caption: 1430},
  {t: 85.8, geo: circle(540, 1110, 480), z0: 1.7, z1: 1.8, ay: 0.46, caption: 1500},
  {t: 91.25, geo: SPLIT_R, z0: 1.15, z1: 1.2, caption: 1590},
  {t: 101.9, geo: DEVICE, z0: 1.0, z1: 1.04, focus: 'center', caption: 1600},
  {t: 111.0, geo: circle(540, 1110, 480), z0: 1.7, z1: 1.8, ay: 0.46, caption: 1500},
  {t: 114.25, geo: FULL, z0: 1.05, z1: 1.1, caption: 1430},
  {t: 114.95, geo: circle(540, 560, 500), z0: 1.7, z1: 1.8, ay: 0.46, caption: 1560},
];

// Emphasis punch-ins on the words that carry each beat.
export const PUNCHES = [0.74, 8.82, 16.8, 23.38, 26.66, 28.58, 47.9, 73.16, 78.46, 85.96, 115.0];

const faceArr = face as number[][];
export const faceAt = (t: number): [number, number, number] => {
  let lo = 0;
  let hi = faceArr.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (faceArr[mid][0] <= t) lo = mid;
    else hi = mid - 1;
  }
  const i = lo;
  const a = faceArr[i];
  const b = faceArr[i + 1];
  const p = Math.min(1, Math.max(0, (t - a[0]) / Math.max(0.001, b[0] - a[0])));
  return [lerp(a[1], b[1], p), lerp(a[2], b[2], p), lerp(a[3], b[3], p)];
};

const lerpGeo = (a: Geo, b: Geo, p: number): Geo => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p),
  w: lerp(a.w, b.w, p),
  h: lerp(a.h, b.h, p),
  r: lerp(a.r, b.r, p),
  ring: lerp(a.ring, b.ring, p),
});

export const shotIndex = (t: number) => {
  let i = 0;
  while (i + 1 < SHOTS.length && SHOTS[i + 1].t <= t) i++;
  return i;
};

export type PresenterState = {geo: Geo; zoom: number; ay: number; focusMix: number; trP: number; trVel: number};

/** Resolve presenter geometry, zoom and framing at time t, morphing between shots. */
export const presenterAt = (t: number, end: number): PresenterState => {
  const i = shotIndex(t);
  const s = SHOTS[i];
  const next = SHOTS[i + 1];
  const sEnd = next ? next.t : end;
  const local = Math.min(1, Math.max(0, (t - s.t) / Math.max(0.01, sEnd - s.t)));
  const zoomHere = lerp(s.z0, s.z1, easeInOut(local));
  const tr = s.tr ?? 0.45;
  const raw = i === 0 ? 1 : Math.min(1, (t - s.t) / tr);
  const p = easeInOut(raw);
  const prev = i > 0 ? SHOTS[i - 1] : s;
  const prevZoomEnd = prev.z1;
  const geo = lerpGeo(prev.geo, s.geo, p);
  const zoom = lerp(prevZoomEnd, zoomHere, p);
  const ay = lerp(prev.ay ?? 0.36, s.ay ?? 0.36, p);
  const fm = (g?: Shot['focus']) => (g === 'center' ? 1 : 0);
  const focusMix = lerp(fm(prev.focus), fm(s.focus), p);
  const trVel = raw < 1 ? Math.sin(Math.PI * raw) : 0;
  return {geo, zoom, ay, focusMix, trP: p, trVel};
};

export const captionYAt = (t: number) => SHOTS[shotIndex(t)].caption;
