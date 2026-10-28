import {Sparkles, Fingerprint, LayoutGrid, Crosshair, BookOpen, Briefcase, GraduationCap, Brain, Zap, Smartphone, Calculator, MapPin, CalendarDays, Search, Check, AlertTriangle, FileText, TrendingDown, Cpu} from 'lucide-react';
import {C, fontHead} from '../lib/theme';
import {bump, lerp, noise, pop, prog, range} from '../lib/anim';
import {Bar, Chip, DrawPath, IconBadge, Label, Panel, PopIn, Scene, Title} from '../components/ui';

/** Big chapter number + title above the circular presenter. */
const Chapter: React.FC<{t: number; at: number; end: number; n: string; title: string; titleAt: number; color: string}> = ({t, at, end, n, title, titleAt, color}) => {
  const p = pop(t, at, 12, 160);
  return (
    <Scene t={t} start={at} end={end}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 80}px)`}}>
        <span style={{fontFamily: fontHead, fontWeight: 700, fontSize: 300, lineHeight: 1, color: 'transparent', WebkitTextStroke: `4px ${color}`, filter: `drop-shadow(0 0 24px ${color}88)`}}>{n}</span>
      </div>
      <PopIn t={t} at={at + 0.15} x={0} y={470} w={1080}>
        <Label size={34} weight={800} color={C.muted} style={{textAlign: 'center', letterSpacing: 8}}>{n === '01' ? 'PUNTO PRIMO' : 'SECONDO PROBLEMA'}</Label>
      </PopIn>
      <PopIn t={t} at={titleAt} x={0} y={530} w={1080}>
        <Title size={title.length > 18 ? 76 : 84} color={color} style={{textAlign: 'center'}}>{title}</Title>
      </PopIn>
    </Scene>
  );
};

/* 29.15–33.2  Point 1: personalisation becomes ever more precise (reticle locks onto the viewer) */
export const Point1: React.FC<{t: number}> = ({t}) => {
  const lock = prog(t, 31.5, 0.9);
  const size = lerp(820, 600, lock);
  const flash = bump(t, 32.38, 0.06, 0.5);
  return (
    <>
      <Chapter t={t} at={29.2} end={33.25} n="01" title="Personalizzazione" titleAt={30.2} color={C.cyan} />
      <Scene t={t} start={31.0} end={33.25}>
        <div style={{position: 'absolute', left: 540 - size / 2, top: 1080 - size / 2, width: size, height: size, opacity: prog(t, 31.02, 0.3), transform: `rotate(${(1 - lock) * 90}deg)`}}>
          <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
            {[0, 90, 180, 270].map((a) => (
              <path key={a} d="M 50 2 L 50 12" stroke={flash > 0 ? C.yellow : C.cyan} strokeWidth={1.2} transform={`rotate(${a} 50 50)`} strokeLinecap="round" />
            ))}
            <circle cx={50} cy={50} r={48} fill="none" stroke={C.cyan} strokeWidth={0.6} strokeDasharray="6 4" />
            {[45, 135, 225, 315].map((a) => (
              <path key={a} d="M 50 0 A 50 50 0 0 1 64 2" stroke={C.cyan} strokeWidth={1.6} fill="none" transform={`rotate(${a - 8} 50 50)`} />
            ))}
          </svg>
        </div>
        <PopIn t={t} at={32.38} x={0} y={680} w={1080} from="scale">
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Chip label="Sempre più precisa" color={C.yellow} Icon={Crosshair} size={34} solid />
          </div>
        </PopIn>
      </Scene>
    </>
  );
};

/* 33.2–39.05  AI adapts content & stimuli to who we personally are */
export const Personalize: React.FC<{t: number}> = ({t}) => {
  const fit = prog(t, 37.9, 0.6);
  const cards = [0, 1, 2];
  return (
    <Scene t={t} start={33.3} end={39.1}>
      {/* TU */}
      <PopIn t={t} at={36.9} x={50} y={300} w={250} h={330} from="left">
        <Panel glow={C.yellow} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
          <IconBadge Icon={Fingerprint} color={C.yellow} size={130} round />
          <Label size={40} weight={900}>TU</Label>
          <Label size={22} weight={600} color={C.muted} style={{textAlign: 'center'}}>come sei fatto</Label>
        </Panel>
      </PopIn>
      <DrawPath t={t} at={37.2} d={0.4} path="M 310 465 L 390 465" color={C.yellow} width={6} arrow />
      {/* IA */}
      <PopIn t={t} at={33.34} x={405} y={360} w={230} h={210} from="scale">
        <Panel glow={C.violet} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
          <div style={{transform: `rotate(${t * 40}deg)`}}>
            <IconBadge Icon={Sparkles} color={C.violet} size={100} round />
          </div>
          <Label size={36} weight={900}>IA</Label>
        </Panel>
      </PopIn>
      <DrawPath t={t} at={34.82} d={0.35} path="M 645 465 L 715 465" color={C.violet} width={6} arrow />
      {/* feed */}
      {cards.map((i) => {
        const col = fit > 0 ? C.cyan : '#56627A';
        return (
          <PopIn key={i} t={t} at={35.22 + i * 0.12} x={730} y={220 + i * 170} w={300} h={150} from="right">
            <Panel glow={fit > 0.5 ? C.cyan : undefined} style={{display: 'flex', alignItems: 'center', gap: 18, padding: 18, transform: `scale(${1 + bump(t, 37.9 + i * 0.1, 0.1, 0.5) * 0.08})`}}>
              <div style={{width: 100, height: 110, borderRadius: 18, background: `linear-gradient(135deg, ${col}, ${fit > 0 ? C.yellow : '#2B3448'})`, opacity: 0.4 + 0.6 * fit + 0.4}} />
              <div style={{flex: 1}}>
                <div style={{height: 14, borderRadius: 7, background: col, width: '90%', marginBottom: 12}} />
                <div style={{height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.2)', width: '70%', marginBottom: 12}} />
                <div style={{height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.12)', width: '50%'}} />
              </div>
            </Panel>
          </PopIn>
        );
      })}
      <PopIn t={t} at={35.22} x={730} y={730} w={300}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip label="contenuti" color={C.cyan} size={24} />
          <div style={{opacity: prog(t, 35.72, 0.2)}}>
            <Chip label="stimoli" color={C.magenta} size={24} />
          </div>
        </div>
      </PopIn>
      <PopIn t={t} at={34.82} x={60} y={190} w={660}>
        <Chip label="Adatta tutto a te" color={C.violet} Icon={LayoutGrid} size={30} />
      </PopIn>
    </Scene>
  );
};

/* 39.05–44.15  Tailored stimuli vs everything else, which now feels boring */
export const BoringRest: React.FC<{t: number}> = ({t}) => {
  const bored = prog(t, 42.96, 0.6);
  return (
    <Scene t={t} start={39.1} end={44.2}>
      <PopIn t={t} at={39.64} x={50} y={260} w={480} h={470} from="left">
        <Panel glow={C.magenta} style={{padding: 32, background: `linear-gradient(150deg, ${C.magenta}55, ${C.violet}66 50%, ${C.cyan}44)`}}>
          <Label size={26} weight={800} color={C.text} style={{letterSpacing: 3}}>STIMOLI SU MISURA</Label>
          {Array.from({length: 9}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 60 + (i % 3) * 130 + noise(t, i) * 16, top: 120 + Math.floor(i / 3) * 105 + noise(t + 2, i) * 16, transform: `scale(${0.8 + 0.3 * Math.abs(Math.sin(t * 3 + i))}) rotate(${t * 60 + i * 40}deg)`, color: [C.yellow, C.cyan, C.text][i % 3], filter: 'drop-shadow(0 0 10px white)'}}>
              <Sparkles size={64} strokeWidth={2.2} />
            </div>
          ))}
        </Panel>
      </PopIn>
      <PopIn t={t} at={41.56} x={50} y={770} w={480} h={420} from="left">
        <Panel style={{padding: 32, filter: `grayscale(${bored})`, transform: `rotate(${bored * -3}deg) translateY(${bored * 14}px)`}}>
          <Label size={26} weight={800} color={C.muted} style={{letterSpacing: 3}}>TUTTO IL RESTO</Label>
          <div style={{display: 'flex', gap: 22, marginTop: 40, justifyContent: 'center', opacity: 1 - bored * 0.5}}>
            <IconBadge Icon={BookOpen} color={C.green} size={110} glow={false} />
            <IconBadge Icon={Briefcase} color={C.cyan} size={110} glow={false} />
            <IconBadge Icon={GraduationCap} color={C.orange} size={110} glow={false} />
          </div>
          <div style={{position: 'absolute', right: 40, top: 30, opacity: bored}}>
            {['z', 'z', 'Z'].map((z, i) => (
              <span key={i} style={{position: 'absolute', right: i * 30, top: -((t * 30 + i * 20) % 60) + i * 4, fontFamily: fontHead, fontWeight: 700, fontSize: 34 + i * 10, color: C.muted}}>{z}</span>
            ))}
          </div>
        </Panel>
      </PopIn>
      <PopIn t={t} at={43.54} x={90} y={1030} w={400} from="scale" rot={-6}>
        <div style={{display: 'inline-block', padding: '10px 26px', border: `6px solid ${C.red}`, borderRadius: 14, color: C.red, fontFamily: fontHead, fontWeight: 700, fontSize: 64, letterSpacing: 4, background: 'rgba(7,11,20,0.75)'}}>NOIOSO</div>
      </PopIn>
    </Scene>
  );
};

/* 44.15–49.2  Attention for what doesn't entertain us would collapse completely */
export const AttentionMeter: React.FC<{t: number}> = ({t}) => {
  const drain = prog(t, 47.9, 0.9, (x) => 1 - Math.pow(1 - x, 3));
  const v = 1 - drain;
  const col = drain > 0.4 ? C.red : C.cyan;
  const shake = bump(t, 48.76, 0.05, 0.4) * 8;
  return (
    <Scene t={t} start={45.4} end={49.25}>
      <PopIn t={t} at={45.6} x={90} y={170} w={900} h={250} from="down">
        <Panel glow={col} style={{padding: '28px 36px', transform: `translateX(${Math.sin(t * 70) * shake}px)`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <Label size={34} weight={900} style={{letterSpacing: 3}}>ATTENZIONE</Label>
            <span style={{fontFamily: fontHead, fontWeight: 700, fontSize: 70, color: col}}>{Math.round(v * 100)}%</span>
          </div>
          <div style={{opacity: prog(t, 46.28, 0.3)}}>
            <Label size={26} weight={600} color={C.muted}>su ciò che non ci intrattiene</Label>
          </div>
          <div style={{marginTop: 22, width: 828, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
            <div style={{width: `${v * 100 * prog(t, 45.7, 0.4)}%`, height: '100%', background: `linear-gradient(90deg, ${col}99, ${col})`, boxShadow: `0 0 20px ${col}`}} />
          </div>
        </Panel>
      </PopIn>
    </Scene>
  );
};

/* 49.2–53.95  Point 2: cognitive offloading = delegating cognitive activity */
export const Point2: React.FC<{t: number}> = ({t}) => (
  <>
    <Chapter t={t} at={49.3} end={54.0} n="02" title="Cognitive offloading" titleAt={50.54} color={C.violet} />
    <Scene t={t} start={52.0} end={54.0}>
      <PopIn t={t} at={52.1} x={0} y={640} w={1080}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
          <Label size={40} weight={800} color={C.text}>=</Label>
          <IconBadge Icon={Brain} color={C.magenta} size={80} round />
          <div style={{width: 120, height: 6, background: `linear-gradient(90deg, ${C.magenta}, ${C.cyan})`, borderRadius: 3, transform: `scaleX(${prog(t, 52.28, 0.4)})`, transformOrigin: 'left'}} />
          <div style={{transform: `scale(${pop(t, 52.6)})`}}>
            <IconBadge Icon={Cpu} color={C.cyan} size={80} round />
          </div>
        </div>
      </PopIn>
      <PopIn t={t} at={52.68} x={0} y={735} w={1080}>
        <Label size={40} weight={800} color={C.text} style={{textAlign: 'center'}}>delega delle attività cognitive</Label>
      </PopIn>
    </Scene>
  </>
);

/* 53.95–61.1  Energy-hungry brain looks for shortcuts: think less, not more */
export const BrainShortcut: React.FC<{t: number}> = ({t}) => {
  const battery = 1 - prog(t, 55.4, 1.4);
  const maze = 'M 600 330 L 600 250 L 740 250 L 740 420 L 640 420 L 640 560 L 820 560 L 820 300 L 960 300 L 960 700';
  return (
    <Scene t={t} start={54.0} end={61.5}>
      <PopIn t={t} at={54.2} x={50} y={200} w={460} h={560} from="left">
        <Panel glow={C.magenta} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <div style={{position: 'relative'}}>
            <IconBadge Icon={Brain} color={C.magenta} size={190} round />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{position: 'absolute', left: [-30, 170, 80][i], top: [20, 40, -50][i], color: C.yellow, opacity: prog(t, 55.08 + i * 0.1, 0.2), transform: `scale(${0.8 + 0.3 * Math.abs(Math.sin(t * 8 + i))})`, filter: `drop-shadow(0 0 10px ${C.yellow})`}}>
                <Zap size={56} fill={C.yellow} />
              </div>
            ))}
          </div>
          <Label size={38} weight={900} style={{letterSpacing: 2, opacity: prog(t, 55.58, 0.3)}}>ENERGIVORA</Label>
          <div style={{opacity: prog(t, 55.3, 0.3), display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 260, height: 64, borderRadius: 14, border: '4px solid rgba(255,255,255,0.6)', padding: 6, boxSizing: 'border-box'}}>
              <div style={{width: `${battery * 100}%`, height: '100%', borderRadius: 7, background: battery < 0.3 ? C.red : C.green, boxShadow: `0 0 14px ${battery < 0.3 ? C.red : C.green}`}} />
            </div>
            <div style={{width: 12, height: 28, borderRadius: 4, background: 'rgba(255,255,255,0.6)'}} />
          </div>
        </Panel>
      </PopIn>
      <PopIn t={t} at={56.9} x={550} y={200} w={480} h={560} from="right">
        <Panel>
          <div style={{position: 'absolute', left: 24, top: 20}}>
            <Label size={24} weight={800} color={C.muted} style={{letterSpacing: 3}}>PROGETTATO PER…</Label>
          </div>
        </Panel>
      </PopIn>
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <DrawPath t={t} at={57.3} d={1.0} path={maze} color="rgba(255,255,255,0.35)" width={10} glow={false} />
        <DrawPath t={t} at={58.64} d={0.35} path="M 600 330 L 960 700" color={C.cyan} width={10} arrow />
      </div>
      <PopIn t={t} at={57.3} x={576} y={306} from="scale">
        <div style={{width: 48, height: 48, borderRadius: 24, background: C.magenta, boxShadow: `0 0 20px ${C.magenta}`}} />
      </PopIn>
      <PopIn t={t} at={57.5} x={936} y={676} from="scale">
        <div style={{width: 48, height: 48, borderRadius: 12, background: C.green, boxShadow: `0 0 20px ${C.green}`}} />
      </PopIn>
      <PopIn t={t} at={58.7} x={640} y={600} w={320} from="scale" rot={44}>
        <Chip label="Scorciatoia" color={C.cyan} size={26} solid />
      </PopIn>
      {/* "per pensare di meno, non di più" */}
      <PopIn t={t} at={59.48} x={50} y={790} w={980} h={76} from="up">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26}}>
          <Label size={44} weight={900}>PENSARE</Label>
          <div style={{transform: `scale(${pop(t, 60.12)})`}}><Chip label="– di meno" color={C.cyan} size={32} solid /></div>
          <div style={{transform: `scale(${pop(t, 60.92)})`, position: 'relative'}}>
            <Chip label="+ di più" color="#8A97B1" size={32} />
            <div style={{position: 'absolute', left: -6, right: -6, top: '50%', height: 6, background: C.red, transform: `rotate(-12deg) scaleX(${prog(t, 61.0, 0.2)})`, borderRadius: 3}} />
          </div>
        </div>
      </PopIn>
    </Scene>
  );
};

/* 61.1–65.2  It finds an external tool to delegate to, and uses it */
export const Delegate: React.FC<{t: number}> = ({t}) => (
  <Scene t={t} start={61.45} end={65.25}>
    <PopIn t={t} at={61.5} x={90} y={290} w={400} h={300} from="left">
      <Panel glow={C.magenta} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
        <IconBadge Icon={Brain} color={C.magenta} size={140} round />
        <Label size={32} weight={900} style={{letterSpacing: 2}}>CERVELLO</Label>
      </Panel>
    </PopIn>
    <DrawPath t={t} at={62.6} d={0.5} path="M 290 610 L 290 790" color={C.cyan} width={8} arrow />
    <PopIn t={t} at={63.02} x={315} y={660} w={240}>
      <Chip label="delega" color={C.cyan} size={28} />
    </PopIn>
    <PopIn t={t} at={61.9} x={90} y={820} w={400} h={330} from="left">
      <Panel glow={C.cyan} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center'}}>
        <IconBadge Icon={Smartphone} color={C.cyan} size={140} />
        <Label size={30} weight={900} style={{letterSpacing: 2}}>STRUMENTO<br />ESTERNO</Label>
      </Panel>
    </PopIn>
    <PopIn t={t} at={64.6} x={400} y={790} from="scale">
      <IconBadge Icon={Check} color={C.green} size={100} round />
    </PopIn>
  </Scene>
);

/* 65.2–73.8  Before: digital tools took only part of our activities. Now: we delegate thinking itself */
export const ThinkingDelegated: React.FC<{t: number}> = ({t}) => {
  const tools = [
    {Icon: Calculator, label: 'Calcoli', color: C.green},
    {Icon: MapPin, label: 'Percorsi', color: C.red},
    {Icon: CalendarDays, label: 'Agenda', color: C.orange},
    {Icon: Search, label: 'Ricerche', color: C.cyan},
  ];
  const away = prog(t, 69.66, 0.5);
  const absorb = prog(t, 73.4, 0.4);
  return (
    <Scene t={t} start={65.3} end={73.85}>
      <PopIn t={t} at={65.62} x={60} y={180} w={700}>
        <Chip label={away > 0.5 ? 'Ora' : 'Prima'} color={away > 0.5 ? C.red : C.muted} size={30} />
      </PopIn>
      {tools.map((tl, i) => {
        const x = 60 + (i % 2) * 490;
        const y = 270 + Math.floor(i / 2) * 300;
        return (
          <PopIn key={i} t={t} at={66.2 + i * 0.12} x={x} y={y - away * 200} w={470} h={270} from="scale" style={{opacity: 1 - away}}>
            <Panel style={{display: 'flex', alignItems: 'center', gap: 26, padding: 30}}>
              <IconBadge Icon={tl.Icon} color={tl.color} size={110} />
              <div>
                <Label size={36} weight={800}>{tl.label}</Label>
                <div style={{marginTop: 18}}>
                  <Bar t={t} at={67.98 + i * 0.08} value={0.3} color={tl.color} w={210} h={18} />
                </div>
                <Label size={22} weight={600} color={C.muted} style={{marginTop: 8, opacity: prog(t, 68.0, 0.3)}}>una parte</Label>
              </div>
            </Panel>
          </PopIn>
        );
      })}
      {/* now: the AI takes the thinking itself */}
      <PopIn t={t} at={70.22} x={590} y={320} w={360} h={360} from="scale">
        <Panel glow={C.violet} style={{borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `scale(${1 + bump(t, 73.4, 0.1, 0.6) * 0.12})`}}>
          <div style={{transform: `rotate(${t * 50}deg)`}}><IconBadge Icon={Sparkles} color={C.violet} size={130} round /></div>
          <Label size={34} weight={900}>IA</Label>
        </Panel>
      </PopIn>
      <PopIn t={t} at={71.44} x={lerp(70, 590, absorb)} y={lerp(300, 380, absorb)} w={440} h={400} from="left" style={{opacity: 1 - absorb}}>
        <Panel glow={C.yellow} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, transform: `scale(${1 - absorb * 0.6})`}}>
          <IconBadge Icon={Brain} color={C.yellow} size={150} round />
          <Label size={26} weight={800} color={C.muted} style={{letterSpacing: 3, opacity: prog(t, 71.6, 0.3)}}>MOLTO PIÙ IMPORTANTE</Label>
          <div style={{opacity: prog(t, 72.92, 0.25)}}><Title size={60} color={C.yellow}>Il pensiero</Title></div>
        </Panel>
      </PopIn>
      <DrawPath t={t} at={72.3} d={0.45} path="M 515 500 L 575 500" color={C.yellow} width={7} arrow />
      <PopIn t={t} at={70.56} x={60} y={760} w={700}>
        <Chip label="Rischiamo di delegare" color={C.red} Icon={AlertTriangle} size={30} solid />
      </PopIn>
    </Scene>
  );
};

/* 73.8–78.95  The brain is plastic → concrete risk of becoming more stupid */
export const PlasticBrain: React.FC<{t: number}> = ({t}) => {
  const shrink = prog(t, 78.3, 0.5);
  const blob = (k: number) => {
    const pts = 10;
    let d = '';
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const r = 120 + Math.sin(a * 3 + t * 3 * k) * 14 + Math.cos(a * 2 - t * 2.3) * 10;
      const x = 150 + Math.cos(a) * r;
      const y = 150 + Math.sin(a) * r;
      d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d + 'Z';
  };
  return (
    <Scene t={t} start={75.4} end={79.0}>
      <PopIn t={t} at={75.64} x={50} y={150} w={300} h={300} from="scale">
        <div style={{width: 300, height: 300, transform: `scale(${1 - shrink * 0.35})`}}>
          <svg width={300} height={300} style={{position: 'absolute', overflow: 'visible'}}>
            <path d={blob(1)} fill={`${C.magenta}33`} stroke={C.magenta} strokeWidth={5} style={{filter: `drop-shadow(0 0 16px ${C.magenta})`}} />
          </svg>
          <div style={{position: 'absolute', left: 75, top: 75, color: C.text}}>
            <Brain size={150} strokeWidth={1.8} />
          </div>
        </div>
      </PopIn>
      <PopIn t={t} at={76.0} x={480} y={190} w={560}>
        <Label size={30} weight={800} color={C.muted} style={{letterSpacing: 3}}>ORGANO</Label>
        <Title size={86} color={C.magenta}>Plastico</Title>
      </PopIn>
      <PopIn t={t} at={77.44} x={480} y={350} w={560}>
        <Chip label="Rischio concreto" color={C.red} Icon={AlertTriangle} size={32} solid />
      </PopIn>
    </Scene>
  );
};

/* 78.95–81.95  "...diventare più stupidi — sta già avvenendo secondo alcuni studi" */
export const Studies: React.FC<{t: number}> = ({t}) => {
  const line = 'M 120 420 C 300 400, 440 430, 560 500 S 800 640, 940 720';
  return (
    <Scene t={t} start={79.0} end={82.0}>
      <PopIn t={t} at={79.0} x={60} y={190} w={960} h={640} from="scale">
        <Panel glow={C.red} />
      </PopIn>
      <PopIn t={t} at={79.2} x={100} y={225} w={600}>
        <Label size={28} weight={900} style={{letterSpacing: 3}}>CAPACITÀ COGNITIVE</Label>
      </PopIn>
      <DrawPath t={t} at={79.74} d={1.0} path={line} color={C.red} width={9} arrow />
      <PopIn t={t} at={80.28} x={640} y={290} w={360}>
        <Chip label="Già in corso" color={C.red} Icon={TrendingDown} size={28} />
      </PopIn>
      {[0, 1, 2].map((i) => (
        <PopIn key={i} t={t} at={81.08 + i * 0.12} x={120 + i * 46} y={560 + i * 22} w={180} h={220} from="up" rot={-8 + i * 7}>
          <Panel style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#EEF2F8', border: 'none'}}>
            <div style={{color: '#0B1020'}}><FileText size={70} /></div>
            <Label size={22} weight={900} color="#0B1020">STUDIO</Label>
          </Panel>
        </PopIn>
      ))}
    </Scene>
  );
};

export const _unused = range;
