import { describe, it, expect } from 'vitest';
import {
  isValidSentence,
  filterValidSentences,
} from '../../../src/domain/services/SentenceValidator';
import type { RawSentence } from '../../../src/domain/entities/Sentence';

const valid: RawSentence = {
  japanese: '今日はいい天気です',
  reading: 'きょうはいいてんきです',
};

describe('SentenceValidator', () => {
  describe('isValidSentence', () => {
    it('有効な文を受け入れる', () => {
      expect(isValidSentence(valid)).toBe(true);
    });

    describe('SV-006: 空文字チェック', () => {
      it('japanese が空文字なら無効', () => {
        expect(isValidSentence({ japanese: '', reading: 'あ' })).toBe(false);
      });

      it('reading が空文字なら無効', () => {
        expect(isValidSentence({ japanese: 'あ', reading: '' })).toBe(false);
      });
    });

    describe('SV-001: japanese の記号チェック', () => {
      it('句読点を含む場合は無効', () => {
        expect(
          isValidSentence({ japanese: '今日は、いい天気です。', reading: 'きょうはいいてんきです' })
        ).toBe(false);
      });

      it('括弧を含む場合は無効', () => {
        expect(
          isValidSentence({ japanese: '「こんにちは」', reading: 'こんにちは' })
        ).toBe(false);
      });

      it('感嘆符を含む場合は無効', () => {
        expect(
          isValidSentence({ japanese: 'すごい！', reading: 'すごい' })
        ).toBe(false);
      });

      it('数字を含む場合は無効', () => {
        expect(
          isValidSentence({ japanese: '3月の空', reading: 'さんがつのそら' })
        ).toBe(false);
      });

      it('全角数字を含む場合は無効', () => {
        expect(
          isValidSentence({ japanese: '３月の空', reading: 'さんがつのそら' })
        ).toBe(false);
      });

      it('漢字・ひらがな・カタカナのみなら有効', () => {
        expect(
          isValidSentence({ japanese: 'タイピングは楽しい', reading: 'たいぴんぐはたのしい' })
        ).toBe(true);
      });
    });

    describe('SV-002: reading の変換可能性チェック', () => {
      it('変換可能な reading は有効', () => {
        expect(
          isValidSentence({ japanese: 'テスト', reading: 'てすと' })
        ).toBe(true);
      });

      it('ROMAJI_MAP にない文字を含む reading は無効', () => {
        expect(
          isValidSentence({ japanese: 'テスト', reading: 'てすとゐ' })
        ).toBe(false);
      });
    });

    describe('SV-003: 長音符チェック（SV-002 で検出）', () => {
      it('長音符「ー」を含む reading は無効', () => {
        expect(
          isValidSentence({ japanese: 'ラーメン', reading: 'らーめん' })
        ).toBe(false);
      });
    });

    describe('SV-004: 空白チェック（SV-002 で検出）', () => {
      it('半角スペースを含む reading は無効', () => {
        expect(
          isValidSentence({ japanese: 'テスト', reading: 'て すと' })
        ).toBe(false);
      });

      it('全角スペースを含む reading は無効', () => {
        expect(
          isValidSentence({ japanese: 'テスト', reading: 'て\u3000すと' })
        ).toBe(false);
      });
    });

    describe('SV-005: カタカナ混入チェック（SV-002 で検出）', () => {
      it('カタカナを含む reading は無効', () => {
        expect(
          isValidSentence({ japanese: 'テスト', reading: 'テスト' })
        ).toBe(false);
      });
    });
  });

  describe('filterValidSentences', () => {
    it('有効な文のみを返す', () => {
      const sentences: RawSentence[] = [
        { japanese: '今日はいい天気です', reading: 'きょうはいいてんきです' },
        { japanese: 'すごい！', reading: 'すごい' },
        { japanese: 'テスト', reading: 'てすと' },
        { japanese: 'ラーメン', reading: 'らーめん' },
      ];
      const result = filterValidSentences(sentences);
      expect(result).toHaveLength(2);
      expect(result[0]!.japanese).toBe('今日はいい天気です');
      expect(result[1]!.japanese).toBe('テスト');
    });

    it('全て無効な場合は空配列を返す', () => {
      const sentences: RawSentence[] = [
        { japanese: '', reading: 'あ' },
        { japanese: 'テスト！', reading: 'てすと' },
      ];
      expect(filterValidSentences(sentences)).toHaveLength(0);
    });
  });
});
