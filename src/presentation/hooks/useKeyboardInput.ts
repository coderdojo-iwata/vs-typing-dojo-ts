import { useEffect } from 'react';
import type { GameAction } from '../contexts/GameContext';

export function useKeyboardInput(
  dispatch: React.Dispatch<GameAction>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[a-zA-Z]$/.test(key)) {
        dispatch({ type: 'INPUT', key });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, enabled]);
}
