import { useState, useCallback } from 'react';
import { GameProvider } from './presentation/contexts/GameContext';
import { TitleScreen } from './presentation/components/TitleScreen';
import { GameScreenWrapper } from './presentation/components/GameScreenWrapper';
import type { SentenceSource } from './shared/types';

type Screen = 'title' | 'game';

interface GameParams {
  source: SentenceSource;
  apiKey?: string;
}

export const App = () => {
  const [screen, setScreen] = useState<Screen>('title');
  const [gameParams, setGameParams] = useState<GameParams>({ source: 'local' });

  const handleStart = useCallback(
    (source: SentenceSource, apiKey?: string) => {
      setGameParams({ source, apiKey });
      setScreen('game');
    },
    []
  );

  const handleTitle = useCallback(() => {
    setScreen('title');
  }, []);

  return (
    <GameProvider>
      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      {screen === 'game' && (
        <GameScreenWrapper
          onTitle={handleTitle}
          source={gameParams.source}
          apiKey={gameParams.apiKey}
        />
      )}
    </GameProvider>
  );
};
