import { useCallback, useEffect, useRef } from 'react';
import { useGameContext } from './useGameContext';
import { LocalSentenceRepository } from '../../infrastructure/repositories/LocalSentenceRepository';
import { getWinner } from '../../domain/entities/Game';
import { shuffle } from '../../shared/shuffle';

const COUNTDOWN_MS = 3000;
const TICK_INTERVAL_MS = 1000;

export function useGame() {
  const { game, dispatch } = useGameContext();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGame = useCallback(async () => {
    const sentences = shuffle(await LocalSentenceRepository.getSentences());
    dispatch({ type: 'INIT', sentences });
    dispatch({ type: 'START_COUNTDOWN' });

    setTimeout(() => {
      dispatch({ type: 'START_GAME' });
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, TICK_INTERVAL_MS);
    }, COUNTDOWN_MS);
  }, [dispatch]);

  const resetGame = useCallback(() => {
    clearTimer();
    dispatch({ type: 'RESET' });
  }, [dispatch, clearTimer]);

  useEffect(() => {
    if (game.state === 'finished') {
      clearTimer();
    }
  }, [game.state, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    game,
    dispatch,
    startGame,
    resetGame,
    winner: game.state === 'finished' ? getWinner(game) : null,
  };
}
