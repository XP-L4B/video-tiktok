import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 eased progress starting at `at` seconds, lasting `d` seconds. */
export const prog = (t: number, at: number, d = 0.4, e = easeOut) =>
  interpolate(t, [at, at + d], [0, 1], {...CL, easing: e});

/** Springy pop 0→1(+overshoot) starting at `at`. */
export const pop = (t: number, at: number, damping = 13, stiffness = 170) =>
  t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping, stiffness, mass: 0.8}});

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const range = (t: number, a: number, b: number, from: number, to: number, e = easeInOut) =>
  interpolate(t, [a, b], [from, to], {...CL, easing: e});

/** Quick attack / slow release bump used for punch-in zooms and flashes. */
export const bump = (t: number, at: number, attack = 0.12, release = 0.7) => {
  if (t < at) return 0;
  if (t < at + attack) return easeOut((t - at) / attack);
  return Math.max(0, 1 - easeInOut((t - at - attack) / release));
};

/** Scene in/out envelope: fades in over `fi`, out over `fo` before `end`. */
export const envelope = (t: number, start: number, end: number, fi = 0.35, fo = 0.3) =>
  Math.min(prog(t, start, fi), 1 - prog(t, end - fo, fo, easeIn));

/** Seeded pseudo-random noise for organic jitter. */
export const noise = (t: number, seed: number) =>
  Math.sin(t * 7.3 + seed * 12.9898) * 0.5 + Math.sin(t * 13.1 + seed * 78.233) * 0.3 + Math.sin(t * 3.7 + seed * 4.1) * 0.2;
