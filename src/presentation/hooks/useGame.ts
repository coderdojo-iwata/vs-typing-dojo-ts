import { useCallback, useEffect, useRef } from 'react';
import { useGameContext } from './useGameContext';
import { LocalSentenceRepository } from '../../infrastructure/repositories/LocalSentenceRepository';
import { createApiSentenceRepository } from '../../infrastructure/repositories/ApiSentenceRepository';
import { getWinner } from '../../domain/entities/Game';
import { RomajiConverter } from '../../domain/services/RomajiConverter';
import { filterValidSentences } from '../../domain/services/SentenceValidator';
import { shuffle } from '../../shared/shuffle';
import { GAME_CONFIG } from '../../shared/gameConfig';
import type { SentenceSource } from '../../shared/types';
import type { RawSentence } from '../../domain/entities/Sentence';

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
    let count = 3;
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
  }, [dispatch]);

  const startGame = useCallback(
    async (source: SentenceSource = 'local', apiKey?: string) => {
      const repository =
        source === 'api' && apiKey
          ? createApiSentenceRepository(apiKey)
          : LocalSentenceRepository;
      const rawSentences = filterValidSentences(await repository.getSentences());
      if (rawSentences.length === 0) {
        throw new Error('有効な出題文がありません。');
      }
      const sentences = shuffle(
        rawSentences.map((raw: RawSentence) => {
          const { romaji, chunks } = RomajiConverter.convert(raw.reading);
          return { japanese: raw.japanese, reading: raw.reading, romaji, chunks };
        })
      );
      dispatch({ type: 'INIT', sentences });
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
    restartGame,
    resetGame,
    countdownValue,
    winner: game.state === 'finished' ? getWinner(game) : null,
  };
}
