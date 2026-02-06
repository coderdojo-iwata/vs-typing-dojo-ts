import { describe, it, expect } from 'vitest';
import { processInput } from '../../../src/application/usecases/InputUseCase';
import { createGame, startPlaying, startCountdown } from '../../../src/domain/entities/Game';
import type { Sentence } from '../../../src/domain/entities/Sentence';

const sentences: Sentence[] = [
  {
    japanese: 'あか',
    reading: 'あか',
    romaji: 'aka',
    chunks: [
      { char: 'あ', inputPatterns: ['a'] },
      { char: 'か', inputPatterns: ['ka'] },
    ],
  },
  {
    japanese: 'い',
    reading: 'い',
    romaji: 'i',
    chunks: [{ char: 'い', inputPatterns: ['i'] }],
  },
];

function createPlayingGame() {
  return startPlaying(startCountdown(createGame(sentences)));
}

describe('InputUseCase', () => {
  describe('プレイヤー振り分け', () => {
    it('小文字入力は player1 に反映される', () => {
      const game = createPlayingGame();
      const { game: updated } = processInput(game, 'a');
      expect(updated.player1.score).toBe(1);
      expect(updated.player2.score).toBe(0);
    });

    it('大文字入力は player2 に反映される', () => {
      const game = createPlayingGame();
      const { game: updated } = processInput(game, 'A');
      expect(updated.player2.score).toBe(1);
      expect(updated.player1.score).toBe(0);
    });

    it('アルファベット以外は incorrect を返す', () => {
      const game = createPlayingGame();
      const { validation } = processInput(game, '1');
      expect(validation).toBe('incorrect');
    });
  });

  describe('入力処理とスコア更新', () => {
    it('正解で score が加算される', () => {
      const game = createPlayingGame();
      const { game: updated, validation } = processInput(game, 'a');
      expect(validation).toBe('correct');
      expect(updated.player1.score).toBe(1);
    });

    it('部分一致で currentInput が更新される', () => {
      const game = createPlayingGame();
      // 'あ' を正解して 'か' に進み、'k' を入力 → partial
      const { game: afterA } = processInput(game, 'a');
      const { game: afterK, validation } = processInput(afterA, 'k');
      expect(validation).toBe('partial');
      expect(afterK.player1.currentInput).toBe('k');
    });

    it('不正解では状態が変わらない', () => {
      const game = createPlayingGame();
      const { game: updated, validation } = processInput(game, 'x');
      expect(validation).toBe('incorrect');
      expect(updated.player1.score).toBe(0);
      expect(updated.player1.currentInput).toBe('');
    });

    it('チャンク正解で次のチャンクに進む', () => {
      const game = createPlayingGame();
      const { game: afterA } = processInput(game, 'a');
      expect(afterA.player1.currentChunkIndex).toBe(1);
    });

    it('最後のチャンク正解で次の文に進む', () => {
      const game = createPlayingGame();
      // 'あ' → 'k' → 'a' で1文目完了
      const { game: g1 } = processInput(game, 'a');
      const { game: g2 } = processInput(g1, 'k');
      const { game: g3 } = processInput(g2, 'a');
      expect(g3.player1.currentSentenceIndex).toBe(1);
      expect(g3.player1.currentChunkIndex).toBe(0);
      expect(g3.player1.score).toBe(2);
    });

    it('全文打ちきりでゲームが finished になる', () => {
      const game = createPlayingGame();
      // 1文目: 'あ'(a) → 'か'(ka)
      const { game: g1 } = processInput(game, 'a');
      const { game: g2 } = processInput(g1, 'k');
      const { game: g3 } = processInput(g2, 'a');
      // 2文目: 'い'(i)
      const { game: g4 } = processInput(g3, 'i');
      expect(g4.state).toBe('finished');
      expect(g4.player1.score).toBe(3);
    });

    it('全文打ちきり前は playing のまま', () => {
      const game = createPlayingGame();
      const { game: g1 } = processInput(game, 'a');
      const { game: g2 } = processInput(g1, 'k');
      const { game: g3 } = processInput(g2, 'a');
      expect(g3.state).toBe('playing');
    });
  });
});
