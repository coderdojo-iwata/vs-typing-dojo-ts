import { describe, it, expect } from 'vitest';
import { createGameUseCase } from '../../../src/application/usecases/GameUseCase';
import type { SentenceRepository } from '../../../src/domain/repositories/SentenceRepository';
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

const mockRepository: SentenceRepository = {
  async getSentences() {
    return dummySentences;
  },
};

describe('GameUseCase', () => {
  describe('ゲーム開始フロー', () => {
    it('startGame で countdown 状態になる', async () => {
      const useCase = createGameUseCase(mockRepository);
      await useCase.startGame();
      expect(useCase.getGame().state).toBe('countdown');
      expect(useCase.getGame().sentences).toEqual(dummySentences);
    });

    it('startPlaying で playing 状態になる', async () => {
      const useCase = createGameUseCase(mockRepository);
      await useCase.startGame();
      useCase.startPlaying();
      expect(useCase.getGame().state).toBe('playing');
    });
  });

  describe('タイマー更新', () => {
    it('tick で残り時間が1減る', async () => {
      const useCase = createGameUseCase(mockRepository);
      await useCase.startGame();
      useCase.startPlaying();
      const before = useCase.getGame().remainingTime;
      useCase.tick();
      expect(useCase.getGame().remainingTime).toBe(before - 1);
    });

    it('残り時間が0になると finished になる', async () => {
      const useCase = createGameUseCase(mockRepository);
      await useCase.startGame();
      useCase.startPlaying();
      for (let i = 0; i < 60; i++) {
        useCase.tick();
      }
      expect(useCase.getGame().state).toBe('finished');
      expect(useCase.getGame().remainingTime).toBe(0);
    });
  });

  describe('ゲーム終了', () => {
    it('endGame で finished 状態になる', async () => {
      const useCase = createGameUseCase(mockRepository);
      await useCase.startGame();
      useCase.startPlaying();
      useCase.endGame();
      expect(useCase.getGame().state).toBe('finished');
    });
  });
});
