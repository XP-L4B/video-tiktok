import {MessageCircle, Play, Bell, Heart, TrendingDown, Building2, ShoppingBag, Briefcase, Target, User, Sparkles, RefreshCw} from 'lucide-react';
import {C, fontBody, fontHead} from '../lib/theme';
import {bump, noise, pop, prog, range} from '../lib/anim';
import {Chip, DrawPath, IconBadge, Label, Panel, PopIn, Scene, Title} from '../components/ui';

/* 0.0–4.9  HOOK: "Viviamo nell'era della distrazione" + notifications competing for attention */
const NOTIFS = [
  {at: 1.58, Icon: MessageCircle, color: C.green, title: 'Messaggi', sub: 'Nuovo messaggio · ora', x: 50, y: 300, rot: -5, from: 'left' as const},
  {at: 2.24, Icon: Play, color: C.red, title: 'Video', sub: 'Guarda il prossimo video', x: 560, y: 410, rot: 4, from: 'right' as const},
  {at: 2.56, Icon: Bell, color: C.orange, title: 'Notifiche', sub: 'Hai nuove notifiche', x: 40, y: 1100, rot: 3, from: 'left' as const},
  {at: 3.14, Icon: Heart, color: C.magenta, title: 'Social media', sub: 'A qualcuno piace il tuo post', x: 560, y: 1210, rot: -4, from: 'right' as const},
];

export const Hook: React.FC<{t: number}> = ({t}) => {
  const titleOut = prog(t, 1.35, 0.3);
  const letters = 'DISTRAZIONE'.split('');
  const tug = prog(t, 3.96, 0.4);
  return (
    <>
      <Scene t={t} start={0} end={1.7}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', opacity: 1 - titleOut, transform: `translateY(${-titleOut * 60}px)`}}>
          <PopIn t={t} at={0.1} x={0} y={0} w={1080}>
            <Label size={46} weight={800} style={{letterSpacing: 8, color: C.text, textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
              VIVIAMO NELL'ERA DELLA
            </Label>
          </PopIn>
          <div style={{position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            {letters.map((l, i) => {
              const p = pop(t, 0.62 + i * 0.035, 10, 220);
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: fontHead,
                    fontWeight: 700,
                    fontSize: 124,
                    color: C.cyan,
                    display: 'inline-block',
                    opacity: Math.min(1, p),
                    transform: `translate(${noise(t, i) * 6}px, ${(1 - p) * 80 + noise(t + 3, i) * 10}px) rotate(${noise(t * 0.7, i + 9) * 6}deg) scale(${0.5 + 0.5 * p})`,
                    textShadow: `0 0 40px ${C.cyan}aa, 0 10px 30px rgba(0,0,0,0.6)`,
                  }}
                >
                  {l}
                </span>
              );
            })}
          </div>
        </div>
      </Scene>
      <Scene t={t} start={1.5} end={4.95}>
        {NOTIFS.map((n, i) => {
          // pull toward the speaker circle on "si contendono"
          const cx = 540 - (n.x + 240);
          const cy = 820 - (n.y + 70);
          const j = noise(t * 2.2, i) * 8 * tug;
          return (
            <PopIn key={i} t={t} at={n.at} x={n.x + cx * 0.12 * tug + j} y={n.y + cy * 0.12 * tug - j} w={480} h={140} from={n.from} rot={n.rot + noise(t, i) * 2 * tug}>
              <Panel style={{borderRadius: 30, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px'}}>
                <IconBadge Icon={n.Icon} color={n.color} size={86} />
                <div>
                  <Label size={36} weight={800}>{n.title}</Label>
                  <Label size={25} weight={500} color={C.muted}>{n.sub}</Label>
                </div>
                <div style={{position: 'absolute', right: 22, top: 18, width: 18, height: 18, borderRadius: 9, background: C.red, boxShadow: `0 0 14px ${C.red}`}} />
              </Panel>
            </PopIn>
          );
        })}
        {/* "costantemente": small badges keep raining around */}
        {Array.from({length: 8}).map((_, i) => {
          const at = 4.42 + i * 0.05;
          const ang = (i / 8) * Math.PI * 2 + 0.3;
          const p = prog(t, at, 0.45);
          const r = 330 + p * 40;
          const Icon = [MessageCircle, Play, Bell, Heart][i % 4];
          const col = [C.green, C.red, C.orange, C.magenta][i % 4];
          return (
            <div key={i} style={{position: 'absolute', left: 540 + Math.cos(ang) * r - 32, top: 820 + Math.sin(ang) * r - 32, opacity: p * (1 - prog(t, 4.75, 0.2)), transform: `scale(${pop(t, at)})`}}>
              <IconBadge Icon={Icon} color={col} size={64} round />
            </div>
          );
        })}
      </Scene>
    </>
  );
};

/* 4.9–10.94  "La soglia dell'attenzione ... è crollata" — line chart that collapses */
export const AttentionDrop: React.FC<{t: number}> = ({t}) => {
  const X0 = 120, X1 = 960, YT = 380, YB = 760;
  const pre = `M ${X0} ${YT + 20} C ${X0 + 180} ${YT + 10}, ${X0 + 320} ${YT + 40}, ${X0 + 470} ${YT + 70} S ${X0 + 600} ${YT + 90}, 680 ${YT + 110}`;
  const crash = `M 680 ${YT + 110} C 740 ${YT + 140}, 770 ${YB - 60}, 900 ${YB - 25}`;
  const crashP = prog(t, 8.82, 0.5);
  const shake = bump(t, 8.95, 0.05, 0.4) * 10;
  return (
    <Scene t={t} start={5.0} end={11.0}>
      <PopIn t={t} at={5.2} x={70} y={190} w={940}>
        <Chip label="La soglia dell'attenzione" color={C.cyan} Icon={Target} size={34} />
      </PopIn>
      <PopIn t={t} at={5.5} x={60} y={290} w={960} h={560} from="scale">
        <Panel style={{transform: `translateX(${Math.sin(t * 60) * shake}px)`}} glow={crashP > 0 ? C.red : undefined} />
      </PopIn>
      {/* axis */}
      <DrawPath t={t} at={5.7} d={0.5} path={`M ${X0} ${YT - 40} L ${X0} ${YB} L ${X1} ${YB}`} color="rgba(255,255,255,0.35)" width={4} glow={false} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: X0 + 10, top: YT - 20 + i * 95, width: X1 - X0 - 20, height: 2, background: 'rgba(255,255,255,0.06)', opacity: prog(t, 5.9 + i * 0.05, 0.3)}} />
      ))}
      <DrawPath t={t} at={6.3} d={2.3} path={pre} color={C.cyan} width={9} />
      <DrawPath t={t} at={8.82} d={0.45} path={crash} color={C.red} width={10} arrow />
      <div style={{position: 'absolute', left: X0 - 10, top: YB + 18, opacity: prog(t, 6.2, 0.3)}}>
        <Label size={28} color={C.muted} weight={600}>prima</Label>
      </div>
      <PopIn t={t} at={7.78} x={640} y={YB + 18} w={330}>
        <Label size={28} color={C.text} weight={800} style={{textAlign: 'right'}}>nuove generazioni</Label>
      </PopIn>
      <PopIn t={t} at={8.95} x={560} y={YT - 30} w={420} from="scale">
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Chip label="Crollata" color={C.red} Icon={TrendingDown} size={40} solid />
        </div>
      </PopIn>
      {/* "a causa di questi motivi": the same four distractions, now as causes */}
      {[MessageCircle, Play, Bell, Heart].map((Icon, i) => (
        <PopIn key={i} t={t} at={9.82 + i * 0.09} x={150 + i * 92} y={YB - 120} from="up">
          <IconBadge Icon={Icon} color={[C.green, C.red, C.orange, C.magenta][i]} size={76} round />
        </PopIn>
      ))}
      <PopIn t={t} at={9.7} x={150} y={YB - 170} w={400}>
        <Label size={26} weight={800} color={C.muted} style={{letterSpacing: 3}}>A CAUSA DI:</Label>
      </PopIn>
    </Scene>
  );
};

/* 10.94–18.9  Companies complain about attention — and are the cause of its collapse (loop) */
export const CompanyLoop: React.FC<{t: number}> = ({t}) => {
  return (
    <Scene t={t} start={11.8} end={18.95}>
      {/* node: AZIENDE */}
      <PopIn t={t} at={11.84} x={70} y={230} w={420} h={250} from="scale">
        <Panel glow={C.violet} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
          <IconBadge Icon={Building2} color={C.violet} size={110} />
          <Label size={42} weight={900} style={{letterSpacing: 3}}>AZIENDE</Label>
        </Panel>
      </PopIn>
      {/* complaint bubble */}
      <Scene t={t} start={12.5} end={15.7}>
        <PopIn t={t} at={12.54} x={520} y={200} w={500} h={300} from="left" origin="left bottom">
          <div style={{width: '100%', height: '100%', borderRadius: 36, background: '#F4F7FB', padding: 34, boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative'}}>
            <Label size={26} weight={800} color={C.violet} style={{letterSpacing: 2, marginBottom: 12}}>SI LAMENTANO:</Label>
            <Label size={40} weight={800} color="#0B1020">
              «Le nuove generazioni non sanno mantenere{' '}
              <span style={{color: C.red, opacity: prog(t, 14.84, 0.2)}}>l'attenzione</span>»
            </Label>
            <div style={{position: 'absolute', left: -26, bottom: 60, width: 0, height: 0, borderTop: '22px solid transparent', borderBottom: '22px solid transparent', borderRight: '30px solid #F4F7FB'}} />
          </div>
        </PopIn>
      </Scene>
      {/* "sono anche la causa": arrow to collapse node */}
      <DrawPath t={t} at={15.6} d={0.55} path="M 380 490 C 420 620, 420 760, 380 860" color={C.red} width={8} arrow />
      <PopIn t={t} at={15.75} x={420} y={620} w={300}>
        <Chip label="Causa" color={C.red} size={30} />
      </PopIn>
      <PopIn t={t} at={16.6} x={70} y={880} w={420} h={280} from="scale">
        <Panel glow={C.red} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20, textAlign: 'center'}}>
          <IconBadge Icon={TrendingDown} color={C.red} size={100} />
          <Label size={34} weight={900} style={{letterSpacing: 1}}>CROLLO DELLA<br />CAPACITÀ ATTENTIVA</Label>
        </Panel>
      </PopIn>
      {/* loop closes: collapse feeds the complaint */}
      <DrawPath t={t} at={17.7} d={0.6} path="M 110 880 C 40 760, 40 600, 110 490" color={C.violet} width={7} arrow dash="2 18" />
      <PopIn t={t} at={18.1} x={520} y={560} w={240} h={240} from="scale">
        <div style={{width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.yellow, transform: `rotate(${(t - 18) * 140}deg)`, filter: `drop-shadow(0 0 20px ${C.yellow})`}}>
          <RefreshCw size={150} strokeWidth={2.2} />
        </div>
      </PopIn>
    </Scene>
  );
};

/* 18.9–24.0  Distracted consumers vs attentive workers → the same people */
export const SamePerson: React.FC<{t: number}> = ({t}) => {
  const merge = prog(t, 21.9, 0.9);
  const merged = prog(t, 22.84, 0.35);
  const cardW = 450;
  const lx = 70 + merge * (315 - 70);
  const rx = 560 - merge * (560 - 315);
  const card = (x: number, color: string, Icon: typeof ShoppingBag, head: string, state: string, stateAt: number, StateIcon: typeof Bell, distracted: boolean, at: number) => (
    <PopIn t={t} at={at} x={x} y={220} w={cardW} h={560} from={distracted ? 'left' : 'right'} rot={(distracted ? -1 : 1) * (prog(t, 21.16, 0.3) * 3) * (1 - merge)}>
      <Panel glow={color} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 36, gap: 24, opacity: 1 - merged * 0.9}}>
        <IconBadge Icon={Icon} color={color} size={130} />
        <Label size={40} weight={900} style={{letterSpacing: 2}}>{head}</Label>
        <div style={{opacity: prog(t, stateAt, 0.25), transform: `scale(${0.6 + 0.4 * pop(t, stateAt)})`, marginTop: 10}}>
          <Chip label={state} color={distracted ? C.magenta : C.cyan} Icon={StateIcon} size={34} solid />
        </div>
        <div style={{position: 'relative', width: 300, height: 120, opacity: prog(t, stateAt, 0.3)}}>
          {distracted
            ? [0, 1, 2, 3, 4].map((k) => (
                <div key={k} style={{position: 'absolute', left: 130 + Math.cos(t * 3 + k * 1.3) * 120, top: 45 + Math.sin(t * 4 + k * 2) * 40, width: 26, height: 26, borderRadius: 13, background: [C.red, C.orange, C.green, C.magenta, C.yellow][k], boxShadow: '0 0 12px rgba(255,255,255,0.4)'}} />
              ))
            : [0, 1, 2].map((k) => (
                <div key={k} style={{position: 'absolute', left: 150 - (k + 1) * 30, top: 60 - (k + 1) * 30, width: (k + 1) * 60, height: (k + 1) * 60, borderRadius: '50%', border: `4px solid ${C.cyan}`, opacity: 1 - k * 0.25}} />
              ))}
        </div>
      </Panel>
    </PopIn>
  );
  return (
    <Scene t={t} start={18.9} end={24.05}>
      {card(lx, C.magenta, ShoppingBag, 'CONSUMATORI', 'Distratti', 19.78, Bell, true, 19.26)}
      {card(rx, C.cyan, Briefcase, 'LAVORATORI', 'Attenti', 20.68, Target, false, 20.32)}
      <PopIn t={t} at={22.84} x={290} y={210} w={500} h={580} from="scale">
        <Panel glow={C.yellow} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, textAlign: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <IconBadge Icon={ShoppingBag} color={C.magenta} size={90} />
            <Label size={70} weight={900} color={C.yellow}>=</Label>
            <IconBadge Icon={Briefcase} color={C.cyan} size={90} />
          </div>
          <IconBadge Icon={User} color={C.yellow} size={150} round />
          <Title size={62} color={C.yellow}>La stessa<br />persona</Title>
        </Panel>
      </PopIn>
    </Scene>
  );
};

/* 24.0–29.15  "L'IA potrebbe amplificare questo fenomeno. In che modo?" */
export const AIAmplify: React.FC<{t: number}> = ({t}) => {
  const q = pop(t, 28.58, 10, 200);
  return (
    <Scene t={t} start={25.1} end={29.2}>
      <Scene t={t} start={25.1} end={28.55}>
        <PopIn t={t} at={25.24} x={0} y={200} w={1080} from="down">
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Chip label="Intelligenza artificiale" color={C.violet} Icon={Sparkles} size={40} solid />
          </div>
        </PopIn>
        {[0, 1, 2, 3].map((i) => {
          const p = ((t - 26.66 - i * 0.22) / 1.1) % 1;
          if (t < 26.66 + i * 0.22) return null;
          return (
            <div key={i} style={{position: 'absolute', left: 540 - 160 - p * 360, top: 236 - 40 - p * 130, width: 320 + p * 720, height: 80 + p * 260, borderRadius: '50%', border: `4px solid ${C.violet}`, opacity: (1 - p) * 0.8}} />
          );
        })}
        <PopIn t={t} at={26.8} x={0} y={310} w={1080} from="up">
          <div style={{display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center'}}>
            <Title size={58} color={C.text}>amplifica</Title>
            <div style={{display: 'flex', gap: 8}}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{transform: `scale(${pop(t, 27.64 + i * 0.06)})`}}>
                  <IconBadge Icon={Bell} color={C.orange} size={56} round />
                </div>
              ))}
            </div>
          </div>
        </PopIn>
      </Scene>
      <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', opacity: Math.min(1, q), transform: `scale(${0.4 + 0.6 * q})`}}>
        <span style={{fontFamily: fontHead, fontWeight: 700, fontSize: 130, color: C.yellow, letterSpacing: -2, textShadow: `0 0 50px ${C.yellow}88, 0 10px 30px rgba(0,0,0,0.7)`}}>IN CHE MODO?</span>
      </div>
    </Scene>
  );
};

export const fontsUsed = [fontBody, fontHead];
