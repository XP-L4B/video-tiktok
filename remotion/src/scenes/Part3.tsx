import {Lightbulb, Shield, TrendingDown, Gamepad2, Dices, Briefcase, Users, Zap, RefreshCw, HeartHandshake, BarChart3, MessageSquareHeart, Square, Swords, Home, Building2, Star, Globe, MousePointer2, FlaskConical, Trophy} from 'lucide-react';
import {C, fontHead} from '../lib/theme';
import {bump, lerp, pop, prog} from '../lib/anim';
import {Bar, Chip, IconBadge, Label, Panel, PopIn, Scene, Title} from '../components/ui';

/* 81.95–85.8  A strategy that can help limit the problem */
export const Strategy: React.FC<{t: number}> = ({t}) => {
  const guard = prog(t, 84.52, 0.4);
  return (
    <Scene t={t} start={82.3} end={85.85}>
      <PopIn t={t} at={82.64} x={0} y={140} w={1080} from="down">
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Chip label="Una strategia" color={C.yellow} Icon={Lightbulb} size={42} solid />
        </div>
      </PopIn>
      <PopIn t={t} at={83.76} x={330} y={250} w={420} h={130} from="scale">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
          <div style={{color: C.red, opacity: 1 - guard * 0.6, transform: `scale(${1 - guard * 0.3})`, filter: `drop-shadow(0 0 16px ${C.red})`}}>
            <TrendingDown size={96} strokeWidth={2.4} />
          </div>
          <div style={{color: C.green, transform: `scale(${pop(t, 84.52)})`, filter: `drop-shadow(0 0 20px ${C.green})`}}>
            <Shield size={110} strokeWidth={2.2} fill={`${C.green}33`} />
          </div>
        </div>
      </PopIn>
    </Scene>
  );
};

/* 85.8–91.25  Gamification = playful activities inside contexts that usually don't have them */
export const Gamification: React.FC<{t: number}> = ({t}) => {
  const up = prog(t, 87.6, 0.5);
  const letters = 'GAMIFICATION'.split('');
  return (
    <Scene t={t} start={85.85} end={91.3}>
      <div style={{position: 'absolute', left: 0, right: 0, top: lerp(330, 170, up), display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <div style={{transform: `scale(${pop(t, 85.9)}) rotate(${Math.sin(t * 4) * 6}deg)`, color: C.green, filter: `drop-shadow(0 0 20px ${C.green})`}}>
          <Gamepad2 size={lerp(120, 90, up)} strokeWidth={2.2} />
        </div>
        <div style={{display: 'flex'}}>
          {letters.map((l, i) => {
            const p = pop(t, 85.96 + i * 0.03, 10, 240);
            return (
              <span key={i} style={{fontFamily: fontHead, fontWeight: 700, fontSize: lerp(108, 84, up), color: C.green, display: 'inline-block', opacity: Math.min(1, p), transform: `translateY(${(1 - p) * -60}px)`, textShadow: `0 0 36px ${C.green}88`}}>
                {l}
              </span>
            );
          })}
        </div>
      </div>
      <PopIn t={t} at={86.4} x={190} y={lerp(470, 290, up)} w={700}>
        <Bar t={t} at={86.4} d={1.0} value={0.82} color={C.green} w={700} h={26} />
      </PopIn>
      {/* definition equation */}
      <PopIn t={t} at={88.34} x={50} y={380} w={430} h={360} from="left">
        <Panel glow={C.magenta} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center'}}>
          <IconBadge Icon={Dices} color={C.magenta} size={130} />
          <Label size={34} weight={900}>ATTIVITÀ<br />LUDICHE</Label>
        </Panel>
      </PopIn>
      <PopIn t={t} at={88.94} x={490} y={520} w={100} from="scale">
        <Label size={90} weight={900} color={C.yellow} style={{textAlign: 'center'}}>+</Label>
      </PopIn>
      <PopIn t={t} at={89.4} x={600} y={380} w={430} h={360} from="right">
        <Panel glow={C.cyan} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center'}}>
          <IconBadge Icon={Briefcase} color={C.cyan} size={130} />
          <Label size={30} weight={900}>CONTESTI CHE DI<br />SOLITO NON LE<br />PREVEDONO</Label>
        </Panel>
      </PopIn>
    </Scene>
  );
};

/* 91.25–101.9  What gamification does: engagement, motivation, constant feedback, willing participation */
export const Benefits: React.FC<{t: number}> = ({t}) => {
  const items = [
    {at: 92.08, Icon: Zap, color: C.yellow, label: 'Coinvolgimento', sub: 'anche nelle attività noiose e ripetitive', subAt: 94.28, bar: 0.9},
    {at: 95.98, Icon: Trophy, color: C.orange, label: 'Motivazione', sub: 'migliora', subAt: 96.3, bar: 0.85},
    {at: 97.34, Icon: RefreshCw, color: C.cyan, label: 'Feedback costanti', sub: 'sempre aggiornati', subAt: 98.04, bar: 1, spin: true},
    {at: 98.9, Icon: HeartHandshake, color: C.magenta, label: 'Partecipazione', sub: 'più volentieri', subAt: 101.0, bar: 0.95},
  ];
  return (
    <Scene t={t} start={91.3} end={101.95}>
      <PopIn t={t} at={91.4} x={50} y={170} w={480}>
        <Chip label="Gamification" color={C.green} Icon={Gamepad2} size={28} />
      </PopIn>
      {items.map((it, i) => (
        <PopIn key={i} t={t} at={it.at} x={50} y={260 + i * 270} w={480} h={245} from="left">
          <Panel glow={it.color} style={{padding: 26, display: 'flex', flexDirection: 'column', gap: 14}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{transform: it.spin ? `rotate(${t * 120}deg)` : undefined}}>
                <IconBadge Icon={it.Icon} color={it.color} size={84} round />
              </div>
              <Label size={i === 2 ? 32 : 36} weight={900}>{it.label}</Label>
            </div>
            <Bar t={t} at={it.at + 0.2} d={0.7} value={it.bar} color={it.color} w={420} h={18} />
            <Label size={24} weight={600} color={C.muted} style={{opacity: prog(t, it.subAt, 0.3)}}>{it.sub}</Label>
          </Panel>
        </PopIn>
      ))}
    </Scene>
  );
};

/* 101.9–111.0  Achivia: the app on screen + what it does */
export const AchiviaApp: React.FC<{t: number}> = ({t}) => {
  const morph = prog(t, 106.18, 0.45);
  return (
    <Scene t={t} start={101.95} end={111.05}>
      <PopIn t={t} at={101.94} x={0} y={160} w={1080} from="down">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
          <Title size={96} color={C.text} style={{letterSpacing: 4}}>
            ACHI<span style={{color: C.cyan}}>VIA</span>
          </Title>
          <div style={{opacity: prog(t, 102.46, 0.2)}}>
            <Chip label="web app" color={C.cyan} size={28} />
          </div>
        </div>
      </PopIn>
      {/* task → quest morph chip */}
      <PopIn t={t} at={104.24} x={160} y={1250} w={760} h={130} from="up">
        <Panel glow={morph > 0.5 ? C.yellow : undefined} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: 1 - morph * 0.55}}>
            <Square size={50} color={C.muted} strokeWidth={2.6} />
            <Label size={38} weight={900} color={C.muted}>TASK</Label>
          </div>
          <Label size={50} weight={900} color={C.yellow}>→</Label>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${0.5 + 0.5 * pop(t, 106.18)})`, opacity: Math.min(1, morph * 2)}}>
            <Swords size={56} color={C.yellow} strokeWidth={2.4} />
            <Label size={44} weight={900} color={C.yellow}>QUEST</Label>
          </div>
        </Panel>
      </PopIn>
      <PopIn t={t} at={107.18} x={60} y={420} w={430} from="left" rot={-3}>
        <Chip label="Dati performance" color={C.green} Icon={BarChart3} size={28} solid />
      </PopIn>
      <PopIn t={t} at={109.38} x={520} y={560} w={500} from="right" rot={3}>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Chip label="Feedback immediati" color={C.magenta} Icon={MessageSquareHeart} size={28} solid />
        </div>
      </PopIn>
    </Scene>
  );
};

/* 111.0–114.25  Turns daily and business activities into a game */
export const IntoGame: React.FC<{t: number}> = ({t}) => {
  const cards = [
    {at: 112.06, Icon: Home, label: 'Quotidiane', color: C.cyan},
    {at: 113.2, Icon: Building2, label: 'Aziendali', color: C.violet},
    {at: 114.02, Icon: Users, label: '…e non', color: C.magenta},
  ];
  return (
    <Scene t={t} start={111.1} end={114.3}>
      <PopIn t={t} at={111.3} x={0} y={170} w={1080} from="down">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
          <Title size={70}>Trasforma in un</Title>
          <div style={{transform: `scale(${pop(t, 111.74)})`}}><Chip label="gioco" color={C.green} Icon={Gamepad2} size={44} solid /></div>
        </div>
      </PopIn>
      {cards.map((c, i) => {
        const flip = prog(t, c.at + 0.35, 0.4);
        return (
          <PopIn key={i} t={t} at={c.at} x={60 + i * 330} y={330} w={300} h={420} from="up">
            <Panel glow={flip > 0.5 ? C.yellow : c.color} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, transform: `rotateY(${(1 - flip) * 0}deg)`}}>
              <IconBadge Icon={c.Icon} color={c.color} size={120} />
              <Label size={34} weight={900}>{c.label}</Label>
              <div style={{display: 'flex', gap: 6, opacity: flip}}>
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{transform: `scale(${pop(t, c.at + 0.4 + k * 0.08)})`, color: C.yellow, filter: `drop-shadow(0 0 8px ${C.yellow})`}}>
                    <Star size={40} fill={C.yellow} />
                  </div>
                ))}
              </div>
              <div style={{opacity: flip}}><Label size={22} weight={800} color={C.yellow} style={{letterSpacing: 2}}>+ XP</Label></div>
            </Panel>
          </PopIn>
        );
      })}
    </Scene>
  );
};

/* 114.25–119.78  CTA: achivia.org · free up to five members · beta test almost done */
export const CTA: React.FC<{t: number}> = ({t}) => {
  const click = bump(t, 115.75, 0.06, 0.3);
  return (
    <Scene t={t} start={114.9} end={119.95}>
      <PopIn t={t} at={115.0} x={140} y={870} w={800} h={150} from="up">
        <div style={{width: '100%', height: '100%', borderRadius: 75, background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, boxShadow: `0 0 60px ${C.cyan}77, 0 20px 50px rgba(0,0,0,0.5)`, transform: `scale(${1 - click * 0.05})`}}>
          <Globe size={64} color="#06101C" strokeWidth={2.4} />
          <span style={{fontFamily: fontHead, fontWeight: 700, fontSize: 76, color: '#06101C', letterSpacing: 1}}>achivia.org</span>
        </div>
      </PopIn>
      <div style={{position: 'absolute', left: lerp(1000, 720, prog(t, 115.3, 0.45)), top: lerp(1100, 970, prog(t, 115.3, 0.45)), opacity: prog(t, 115.3, 0.2) * (1 - prog(t, 116.2, 0.3)), color: C.text, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'}}>
        <MousePointer2 size={80} fill={C.text} strokeWidth={1.5} color="#06101C" />
      </div>
      <PopIn t={t} at={116.34} x={60} y={1060} w={900} h={170} from="up">
        <Panel glow={C.green} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'}}>
          <div>
            <Chip label="Gratuita" color={C.green} size={30} solid />
            <Label size={30} weight={800} style={{marginTop: 12}}>fino a 5 membri</Label>
          </div>
          <div style={{display: 'flex'}}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{marginLeft: i ? -18 : 0, transform: `scale(${pop(t, 117.04 + i * 0.07)})`}}>
                <div style={{width: 84, height: 84, borderRadius: 42, border: '4px solid #101828', background: [C.cyan, C.violet, C.magenta, C.orange, C.green][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06101C', fontFamily: fontHead, fontWeight: 700, fontSize: 36}}>{i + 1}</div>
              </div>
            ))}
          </div>
        </Panel>
      </PopIn>
      <PopIn t={t} at={117.84} x={60} y={1250} w={900} h={130} from="up">
        <Panel glow={C.yellow} style={{padding: '22px 32px', display: 'flex', flexDirection: 'column', gap: 14}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <FlaskConical size={34} color={C.yellow} />
            <Label size={28} weight={900} style={{letterSpacing: 2}}>BETA TEST · PRIMA FASE</Label>
            <Label size={24} weight={700} color={C.yellow} style={{marginLeft: 'auto', opacity: prog(t, 118.4, 0.3)}}>quasi finita</Label>
          </div>
          <Bar t={t} at={118.0} d={1.2} value={0.93} color={C.yellow} w={830} h={20} />
        </Panel>
      </PopIn>
    </Scene>
  );
};
