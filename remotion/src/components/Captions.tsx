import words from '../data/words.json';
import {captionYAt} from '../lib/layout';
import {pop, prog} from '../lib/anim';
import {C, fontBody} from '../lib/theme';

type Word = {t: string; p: number; s: number; e: number};
const WORDS = words as Word[];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.]/g, '');

// Words that carry meaning get the accent colour + heavier weight.
const KEY = new Set(
  (
    'distrazione attenzione dellattenzione lattenzione crollata aziende causa crollo distratti attenti stessa ' +
    'lintelligenza artificiale amplificare personalizzazione precisa stimoli personalmente. noioso. crollerebbe ' +
    'cognitive offloading delega cervello energivora. scorciatoie meno pensiero. plastico stupidi studi. ' +
    'strategia gamification ludiche coinvolgimento noiose ripetitive. motivazione feedback costanti. volentieri. ' +
    'achivia quest. dati performance immediati. gioco achivia.org. gratuita cinque membri beta test.'
  )
    .split(' ')
    .map((w) => norm(w).replace(/\.$/, '')),
);
const isKey = (w: string) => KEY.has(norm(w).replace(/\.$/, ''));

type Group = {words: Word[]; start: number; end: number};

const buildGroups = (): Group[] => {
  const groups: Group[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) groups.push({words: cur, start: cur[0].s, end: cur[cur.length - 1].e});
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const next = WORDS[i + 1];
    cur.push(w);
    const chars = cur.reduce((a, x) => a + x.t.length + 1, 0);
    const punct = /[.,:?!;]$/.test(w.t);
    const gap = next ? next.s - w.e : 1;
    const nextLen = next ? next.t.length : 0;
    if (!next || punct || gap > 0.32 || cur.length >= 5 || chars + nextLen > 24 || next.p !== w.p) flush();
  });
  // hold each group until the next one starts (max 0.6s after the last word)
  groups.forEach((g, i) => {
    const n = groups[i + 1];
    g.end = n ? Math.min(n.start, g.end + 0.6) : g.end + 0.6;
  });
  return groups;
};
const GROUPS = buildGroups();

export const Captions: React.FC<{t: number}> = ({t}) => {
  const g = GROUPS.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!g) return null;
  const y = captionYAt(g.start + 0.01);
  const out = 1 - prog(t, g.end - 0.12, 0.12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        right: 150,
        top: y,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: 26,
        rowGap: 4,
        opacity: out,
        fontFamily: fontBody,
      }}
    >
      {g.words.map((w, i) => {
        const p = pop(t, w.s - 0.04, 14, 260);
        const active = t >= w.s && t < w.e + 0.08;
        const key = isKey(w.t);
        const shown = t >= w.s - 0.04;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: key ? 74 : 66,
              fontWeight: key ? 900 : 800,
              lineHeight: 1.12,
              letterSpacing: -0.5,
              color: key ? C.yellow : C.text,
              opacity: shown ? Math.min(1, p * 1.4) : 0,
              transform: `translateY(${(1 - p) * 26}px) scale(${(0.72 + 0.28 * p) * (active ? 1.06 : 1)})`,
              WebkitTextStroke: '11px rgba(4,7,14,0.92)',
              paintOrder: 'stroke fill',
              textShadow: '0 6px 18px rgba(0,0,0,0.55)',
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
