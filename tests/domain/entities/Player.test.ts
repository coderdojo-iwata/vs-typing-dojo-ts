import { describe, it, expect } from 'vitest';
import {
  createPlayer,
  addScore,
  nextChunk,
  nextSentence,
  resetInput,
} from '../../../src/domain/entities/Player';

describe('Player', () => {
  describe('createPlayer', () => {
    it('初期状態が正しい', () => {
      const player = createPlayer(1);
      expect(player.id).toBe(1);
      expect(player.score).toBe(0);
      expect(player.currentSentenceIndex).toBe(0);
      expect(player.currentChunkIndex).toBe(0);
      expect(player.currentInput).toBe('');
    });
  });

  describe('addScore', () => {
    it('スコアが加算される', () => {
      const player = createPlayer(1);
      const updated = addScore(player, 10);
      expect(updated.score).toBe(10);
    });

    it('複数回加算できる', () => {
      const player = createPlayer(1);
      const updated = addScore(addScore(player, 10), 5);
      expect(updated.score).toBe(15);
    });

    it('元のオブジェクトは変更されない', () => {
      const player = createPlayer(1);
      addScore(player, 10);
      expect(player.score).toBe(0);
    });
  });

  describe('nextChunk', () => {
    it('チャンクインデックスが1進む', () => {
      const player = createPlayer(1);
      const updated = nextChunk(player);
      expect(updated.currentChunkIndex).toBe(1);
    });

    it('入力がリセットされる', () => {
      const player = { ...createPlayer(1), currentInput: 'ka' };
      const updated = nextChunk(player);
      expect(updated.currentInput).toBe('');
    });
  });

  describe('nextSentence', () => {
    it('文インデックスが1進む', () => {
      const player = createPlayer(1);
      const updated = nextSentence(player);
      expect(updated.currentSentenceIndex).toBe(1);
    });

    it('チャンクインデックスが0にリセットされる', () => {
      const player = { ...createPlayer(1), currentChunkIndex: 3 };
      const updated = nextSentence(player);
      expect(updated.currentChunkIndex).toBe(0);
    });

    it('入力がリセットされる', () => {
      const player = { ...createPlayer(1), currentInput: 'shi' };
      const updated = nextSentence(player);
      expect(updated.currentInput).toBe('');
    });
  });

  describe('resetInput', () => {
    it('入力がリセットされる', () => {
      const player = { ...createPlayer(1), currentInput: 'ky' };
      const updated = resetInput(player);
      expect(updated.currentInput).toBe('');
    });
  });
});
