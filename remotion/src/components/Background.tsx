import {AbsoluteFill} from 'remotion';
import {C} from '../lib/theme';

/** Dark tech backdrop with drifting glows and a faint grid, visible around non-full layouts. */
export const Background: React.FC<{t: number}> = ({t}) => {
  const a = t * 0.25;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 1400,
          height: 1400,
          left: -500 + Math.sin(a) * 120,
          top: -350 + Math.cos(a * 0.8) * 120,
          background: `radial-gradient(circle, ${C.violet}38 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1500,
          height: 1500,
          left: 200 + Math.cos(a * 0.7) * 140,
          top: 900 + Math.sin(a * 0.9) * 140,
          background: `radial-gradient(circle, ${C.cyan}26 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.045) 1.5px, transparent 1.5px)',
          backgroundSize: '72px 72px',
          backgroundPosition: `0px ${(t * 12) % 72}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 80%)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};
