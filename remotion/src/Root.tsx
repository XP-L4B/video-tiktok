import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS, DURATION_S, W, H} from './lib/theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RikiTiktok"
    component={Main}
    durationInFrames={Math.round(DURATION_S * FPS)}
    fps={FPS}
    width={W}
    height={H}
  />
);
