import { useState, useCallback } from 'react';
import { GameProvider } from './presentation/contexts/GameContext';
import { TitleScreen } from './presentation/components/TitleScreen';
import { GameScreenWrapper } from './presentation/components/GameScreenWrapper';

type Screen = 'title' | 'game';

export const App = () => {
  const [screen, setScreen] = useState<Screen>('title');

  const handleStart = useCallback(() => {
    setScreen('game');
  }, []);

  const handleTitle = useCallback(() => {
    setScreen('title');
  }, []);

  return (
    <GameProvider>
      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      {screen === 'game' && <GameScreenWrapper onTitle={handleTitle} />}
    </GameProvider>
  );
};
