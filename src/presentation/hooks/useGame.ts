import { useCallback, useEffect, useRef } from 'react';
import { useGameContext } from './useGameContext';
import { LocalSentenceRepository } from '../../infrastructure/repositories/LocalSentenceRepository';
import { createApiSentenceRepository } from '../../infrastructure/repositories/ApiSentenceRepository';
import { getWinner } from '../../domain/entities/Game';
import { RomajiConverter } from '../../domain/services/RomajiConverter';
import { shuffle } from '../../shared/shuffle';
import { GAME_CONFIG } from '../../shared/gameConfig';
import type { SentenceSource } from '../../shared/types';
import type { RawSentence } from '../../domain/entities/Sentence';

export function useGame() {
  const { game, dispatch } = useGameContext();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGame = useCallback(
    async (source: SentenceSource = 'local', apiKey?: string) => {
      const repository =
        source === 'api' && apiKey
          ? createApiSentenceRepository(apiKey)
          : LocalSentenceRepository;
      const rawSentences = await repository.getSentences();
      const sentences = shuffle(
        rawSentences.map((raw: RawSentence) => {
          const { romaji, chunks } = RomajiConverter.convert(raw.reading);
          return { japanese: raw.japanese, reading: raw.reading, romaji, chunks };
        })
      );
      dispatch({ type: 'INIT', sentences });
      dispatch({ type: 'START_COUNTDOWN' });

      setTimeout(() => {
        dispatch({ type: 'START_GAME' });
        timerRef.current = setInterval(() => {
          dispatch({ type: 'TICK' });
        }, GAME_CONFIG.TICK_INTERVAL_MS);
      }, GAME_CONFIG.COUNTDOWN_MS);
    },
    [dispatch]
  );

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
