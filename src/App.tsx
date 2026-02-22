import { useState, useCallback } from 'react';
import { GameProvider } from './presentation/contexts/GameContext';
import { TitleScreen } from './presentation/components/TitleScreen';
import { GameScreenWrapper } from './presentation/components/GameScreenWrapper';
import { useSoundEnabled } from './presentation/hooks/useSoundEnabled';
import type { SentenceSource } from './shared/types';
import { GAME_CONFIG, type GameDuration } from './shared/gameConfig';

type Screen = 'title' | 'game';

interface GameParams {
  source: SentenceSource;
  apiKey?: string;
  duration: GameDuration;
}

export const App = () => {
  const [screen, setScreen] = useState<Screen>('title');
  const [gameParams, setGameParams] = useState<GameParams>({ source: 'local', duration: GAME_CONFIG.DURATION_SECONDS as GameDuration });
  const { soundEnabled, toggleSound } = useSoundEnabled();

  const handleStart = useCallback(
    (source: SentenceSource, duration: GameDuration, apiKey?: string) => {
      setGameParams({ source, apiKey, duration });
      setScreen('game');
    },
    []
  );

  const handleTitle = useCallback(() => {
    setScreen('title');
  }, []);

  return (
    <GameProvider>
      {screen === 'title' && <TitleScreen onStart={handleStart} initialDuration={gameParams.duration} soundEnabled={soundEnabled} onToggleSound={toggleSound} />}
      {screen === 'game' && (
        <GameScreenWrapper
          onTitle={handleTitle}
          source={gameParams.source}
          apiKey={gameParams.apiKey}
          duration={gameParams.duration}
          soundEnabled={soundEnabled}
        />
      )}
    </GameProvider>
  );
};
