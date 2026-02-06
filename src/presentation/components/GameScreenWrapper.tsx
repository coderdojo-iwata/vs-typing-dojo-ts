import { useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';
import { GameScreen } from './GameScreen';

interface GameScreenWrapperProps {
  onTitle: () => void;
}

export function GameScreenWrapper({ onTitle }: GameScreenWrapperProps) {
  const { startGame } = useGame();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      startGame();
    }
  }, [startGame]);

  return <GameScreen onTitle={onTitle} />;
}
