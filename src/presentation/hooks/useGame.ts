import { useCallback, useEffect, useRef } from 'react';
import { useGameContext } from './useGameContext';
import { getWinner } from '../../domain/entities/Game';
import { initializeGame } from '../../application/usecases/InitializeGameUseCase';
import { GAME_CONFIG } from '../../shared/gameConfig';
import type { SentenceSource } from '../../shared/types';

export function useGame() {
  const { game, dispatch, countdownValue, setCountdownValue } = useGameContext();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startCountdownSequence = useCallback(() => {
    let count = GAME_CONFIG.COUNTDOWN_VALUE;
    setCountdownValue(count);
    dispatch({ type: 'START_COUNTDOWN' });

    countdownRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
      } else {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        setCountdownValue(null);
        dispatch({ type: 'START_GAME' });
        timerRef.current = setInterval(() => {
          dispatch({ type: 'TICK' });
        }, GAME_CONFIG.TICK_INTERVAL_MS);
      }
    }, 1000);
  }, [dispatch, setCountdownValue]);

  const startGame = useCallback(
    async (source: SentenceSource = 'local', duration: number, apiKey?: string) => {
      const sentences = await initializeGame(source, apiKey);
      dispatch({ type: 'INIT', sentences, duration });
      startCountdownSequence();
    },
    [dispatch, startCountdownSequence]
  );

  const restartGame = useCallback(() => {
    clearTimer();
    dispatch({ type: 'RESET' });
    startCountdownSequence();
  }, [dispatch, clearTimer, startCountdownSequence]);

  const resetGame = useCallback(() => {
    clearTimer();
    setCountdownValue(null);
    dispatch({ type: 'RESET' });
  }, [dispatch, clearTimer, setCountdownValue]);

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
    restartGame,
    resetGame,
    countdownValue,
    winner: game.state === 'finished' ? getWinner(game) : null,
  };
}
