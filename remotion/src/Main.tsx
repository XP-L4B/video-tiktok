import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Background} from './components/Background';
import {Presenter} from './components/Presenter';
import {Captions} from './components/Captions';
import {FPS} from './lib/theme';
import {SFX} from './lib/sfx';
import {Hook, AttentionDrop, CompanyLoop, SamePerson, AIAmplify} from './scenes/Part1';
import {Point1, Personalize, BoringRest, AttentionMeter, Point2, BrainShortcut, Delegate, ThinkingDelegated, PlasticBrain, Studies} from './scenes/Part2';
import {Strategy, Gamification, Benefits, AchiviaApp, IntoGame, CTA} from './scenes/Part3';

const SCENES = [Hook, AttentionDrop, CompanyLoop, SamePerson, AIAmplify, Point1, Personalize, BoringRest, AttentionMeter, Point2, BrainShortcut, Delegate, ThinkingDelegated, PlasticBrain, Studies, Strategy, Gamification, Benefits, AchiviaApp, IntoGame, CTA];

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background t={t} />
      <Presenter t={t} />
      {SCENES.map((S, i) => (
        <S key={i} t={t} />
      ))}
      <Captions t={t} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * FPS))} durationInFrames={FPS * 2} layout="none">
          <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
