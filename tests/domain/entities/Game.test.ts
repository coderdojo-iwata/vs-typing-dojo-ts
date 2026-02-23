import { describe, it, expect } from 'vitest';
import {
  createGame,
  startCountdown,
  startPlaying,
  tickGame,
  finish,
  getWinner,
} from '../../../src/domain/entities/Game';
import { createPlayer } from '../../../src/domain/entities/Player';
import type { Sentence } from '../../../src/domain/entities/Sentence';

const dummySentences: Sentence[] = [
  {
    japanese: 'テスト',
    reading: 'てすと',
    romaji: 'tesuto',
    chunks: [
      { char: 'て', inputPatterns: ['te'] },
      { char: 'す', inputPatterns: ['su'] },
      { char: 'と', inputPatterns: ['to'] },
    ],
  },
];

describe('Game', () => {
  describe('createGame', () => {
    it('初期状態が idle である', () => {
      const game = createGame(dummySentences);
      expect(game.state).toBe('idle');
      expect(game.remainingTime).toBe(30);
      expect(game.sentences).toBe(dummySentences);
    });

    it('カスタム duration が設定される', () => {
      const game = createGame(dummySentences, 10);
      expect(game.duration).toBe(10);
      expect(game.remainingTime).toBe(10);
    });
  });

  describe('状態遷移', () => {
    it('idle → countdown', () => {
      const game = createGame(dummySentences);
      const updated = startCountdown(game);
      expect(updated.state).toBe('countdown');
    });

    it('countdown → playing', () => {
      const game = startCountdown(createGame(dummySentences));
      const updated = startPlaying(game);
      expect(updated.state).toBe('playing');
    });

    it('playing → finished (tick で時間切れ)', () => {
      const game = startPlaying(
        startCountdown({ ...createGame(dummySentences), remainingTime: 1 })
      );
      const updated = tickGame(game);
      expect(updated.state).toBe('finished');
      expect(updated.remainingTime).toBe(0);
    });

    it('playing → finished (finish 呼び出し)', () => {
      const game = startPlaying(startCountdown(createGame(dummySentences)));
      const updated = finish(game);
      expect(updated.state).toBe('finished');
    });
  });

  describe('tick', () => {
    it('残り時間が1減る', () => {
      const game = startPlaying(startCountdown(createGame(dummySentences)));
      const updated = tickGame(game);
      expect(updated.remainingTime).toBe(29);
    });

    it('残り時間が0以下にならない', () => {
      const game = startPlaying(
        startCountdown({ ...createGame(dummySentences), remainingTime: 0 })
      );
      const updated = tickGame(game);
      expect(updated.remainingTime).toBe(0);
    });
  });

  describe('getWinner', () => {
    it('スコアが高いプレイヤーが勝者', () => {
      const game: ReturnType<typeof createGame> = {
        state: 'finished',
        player1: { ...createPlayer(1), score: 10 },
        player2: { ...createPlayer(2), score: 5 },
        duration: 30,
        remainingTime: 0,
        sentences: dummySentences,
      };
      expect(getWinner(game)?.id).toBe(1);
    });

    it('player2 のスコアが高い場合', () => {
      const game: ReturnType<typeof createGame> = {
        state: 'finished',
        player1: { ...createPlayer(1), score: 3 },
        player2: { ...createPlayer(2), score: 7 },
        duration: 30,
        remainingTime: 0,
        sentences: dummySentences,
      };
      expect(getWinner(game)?.id).toBe(2);
    });

    it('同点の場合は null を返す', () => {
      const game: ReturnType<typeof createGame> = {
        state: 'finished',
        player1: { ...createPlayer(1), score: 5 },
        player2: { ...createPlayer(2), score: 5 },
        duration: 30,
        remainingTime: 0,
        sentences: dummySentences,
      };
      expect(getWinner(game)).toBeNull();
    });
  });
});
