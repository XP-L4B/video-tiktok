import {OffthreadVideo, staticFile} from 'remotion';
import {bump, lerp} from '../lib/anim';
import {faceAt, presenterAt, PUNCHES} from '../lib/layout';
import {C, DURATION_S} from '../lib/theme';

const VW = 1080;
const VH = 1920;

/** The speaker footage inside an animated window (full / split / circle / device). */
export const Presenter: React.FC<{t: number}> = ({t}) => {
  const st = presenterAt(t, DURATION_S);
  const {geo} = st;
  const punch = PUNCHES.reduce((acc, p) => acc + bump(t, p, 0.1, 0.8) * 0.06, 0);
  const zoom = st.zoom * (1 + punch);

  const [fx0, fy0] = faceAt(t);
  const fx = lerp(fx0, 0.5, st.focusMix);
  const fy = lerp(fy0, 0.5, st.focusMix);
  const ay = lerp(st.ay, 0.5, st.focusMix);

  const s = Math.max(geo.w / VW, geo.h / VH) * zoom;
  const vw = VW * s;
  const vh = VH * s;
  const ox = Math.min(0, Math.max(geo.w - vw, geo.w * 0.5 - fx * vw));
  const oy = Math.min(0, Math.max(geo.h - vh, geo.h * ay - fy * vh));

  const ring = geo.ring;
  return (
    <div
      style={{
        position: 'absolute',
        left: geo.x,
        top: geo.y,
        width: geo.w,
        height: geo.h,
        borderRadius: geo.r,
        overflow: 'hidden',
        boxShadow: ring > 0.01 ? `0 30px 80px rgba(0,0,0,${0.55 * ring}), 0 0 0 ${5 * ring}px rgba(255,255,255,${0.92 * ring}), 0 0 ${60 * ring}px ${C.cyan}55` : 'none',
        filter: st.trVel > 0 ? `blur(${(st.trVel * 2.2).toFixed(2)}px)` : undefined,
        transform: 'translateZ(0)',
      }}
    >
      <OffthreadVideo
        src={staticFile('speaker.mp4')}
        style={{position: 'absolute', left: ox, top: oy, width: vw, height: vh, maxWidth: 'none'}}
      />
      {/* subtle grade + inner vignette so graphics and captions sit on top cleanly */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 55%, rgba(4,8,16,0.45) 100%)',
        }}
      />
    </div>
  );
};
