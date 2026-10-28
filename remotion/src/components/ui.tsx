import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {evolvePath} from '@remotion/paths';
import {C, fontBody, fontHead} from '../lib/theme';
import {pop, prog} from '../lib/anim';

type Pos = {x: number; y: number};

/** Absolutely positioned element that pops in (scale + rise + fade) at `at`. */
export const PopIn: React.FC<
  Pos & {t: number; at: number; w?: number; h?: number; from?: 'up' | 'down' | 'left' | 'right' | 'scale'; rot?: number; style?: React.CSSProperties; children: React.ReactNode; origin?: string}
> = ({t, at, x, y, w, h, from = 'up', rot = 0, style, children, origin = 'center'}) => {
  const p = pop(t, at);
  const o = Math.min(1, prog(t, at, 0.18));
  const d = (1 - p) * 70;
  const tr =
    from === 'up' ? `translateY(${d}px)` : from === 'down' ? `translateY(${-d}px)` : from === 'left' ? `translateX(${-d * 1.6}px)` : from === 'right' ? `translateX(${d * 1.6}px)` : '';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `${tr} scale(${0.6 + 0.4 * p}) rotate(${rot}deg)`,
        transformOrigin: origin,
        ...style,
        opacity: o * (style?.opacity === undefined ? 1 : Number(style.opacity)),
      }}
    >
      {children}
    </div>
  );
};

export const Panel: React.FC<{style?: React.CSSProperties; glow?: string; children?: React.ReactNode}> = ({style, glow, children}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      borderRadius: 32,
      background: `linear-gradient(160deg, rgba(30,40,66,0.92), ${C.panel})`,
      border: `2px solid ${glow ? glow + '88' : C.panelBorder}`,
      boxShadow: `0 24px 60px rgba(0,0,0,0.5)${glow ? `, 0 0 50px ${glow}40` : ''}`,
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{label: string; color?: string; Icon?: LucideIcon; size?: number; solid?: boolean}> = ({label, color = C.cyan, Icon, size = 34, solid}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      background: solid ? color : `${color}1f`,
      border: `2px solid ${color}`,
      color: solid ? '#06101C' : color,
      fontFamily: fontHead,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 2,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      boxShadow: `0 0 30px ${color}40`,
    }}
  >
    {Icon ? <Icon size={size * 1.15} strokeWidth={2.4} /> : null}
    {label}
  </div>
);

export const IconBadge: React.FC<{Icon: LucideIcon; color: string; size?: number; round?: boolean; glow?: boolean}> = ({Icon, color, size = 120, round, glow = true}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: round ? '50%' : size * 0.28,
      background: `linear-gradient(145deg, ${color}, ${color}aa)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: glow ? `0 12px 40px ${color}66, inset 0 2px 0 rgba(255,255,255,0.35)` : 'none',
      color: '#06101C',
    }}
  >
    <Icon size={size * 0.55} strokeWidth={2.2} />
  </div>
);

export const Title: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 88, color = C.text, style}) => (
  <div
    style={{
      fontFamily: fontHead,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -1,
      textTransform: 'uppercase',
      color,
      textShadow: '0 8px 30px rgba(0,0,0,0.5)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties}> = ({children, size = 34, color = C.text, weight = 700, style}) => (
  <div style={{fontFamily: fontBody, fontWeight: weight, fontSize: size, color, lineHeight: 1.15, ...style}}>{children}</div>
);

/** SVG stroke that draws itself between `at` and `at+d`. */
export const DrawPath: React.FC<{t: number; at: number; d?: number; path: string; color: string; width?: number; dash?: string; arrow?: boolean; glow?: boolean}> = ({
  t,
  at,
  d = 0.5,
  path,
  color,
  width = 6,
  dash,
  arrow,
  glow = true,
}) => {
  const p = prog(t, at, d);
  if (p <= 0) return null;
  const ev = evolvePath(p, path);
  const id = `ah-${Math.abs(hash(path))}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={1920}>
      <defs>
        <marker id={id} markerWidth="6" markerHeight="6" refX="3.2" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dash ?? ev.strokeDasharray}
        strokeDashoffset={dash ? undefined : ev.strokeDashoffset}
        opacity={dash ? p : 1}
        markerEnd={arrow && p > 0.97 ? `url(#${id})` : undefined}
        style={glow ? {filter: `drop-shadow(0 0 10px ${color})`} : undefined}
      />
    </svg>
  );
};

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};

/** Fills 0→value between at and at+d. */
export const Bar: React.FC<{t: number; at: number; d?: number; value: number; color: string; w: number; h?: number; from?: number}> = ({t, at, d = 0.6, value, color, w, h = 22, from = 0}) => {
  const p = prog(t, at, d);
  const v = from + (value - from) * p;
  return (
    <div style={{width: w, height: h, borderRadius: h, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.1)'}}>
      <div style={{width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: '100%', borderRadius: h, background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 18px ${color}`}} />
    </div>
  );
};

/** Scene container that fades/scales the whole group out at the end. */
export const Scene: React.FC<{t: number; start: number; end: number; children: React.ReactNode}> = ({t, start, end, children}) => {
  if (t < start - 0.05 || t > end + 0.05) return null;
  const out = prog(t, end - 0.3, 0.3);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 1 - out,
        transform: `scale(${1 - out * 0.05})`,
        filter: out > 0 ? `blur(${out * 8}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
