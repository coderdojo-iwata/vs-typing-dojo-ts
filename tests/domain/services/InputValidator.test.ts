import { describe, it, expect } from 'vitest';
import { InputValidator } from '../../../src/domain/services/InputValidator';
import type { RomajiChunk } from '../../../src/domain/services/RomajiConverter';

describe('InputValidator', () => {
  describe('validate', () => {
    it.each([
      [{ char: 'あ', inputPatterns: ['a'] }, 'a', 'correct'],
      [{ char: 'か', inputPatterns: ['ka'] }, 'ka', 'correct'],
      [{ char: 'し', inputPatterns: ['si', 'shi'] }, 'si', 'correct'],
      [{ char: 'し', inputPatterns: ['si', 'shi'] }, 'shi', 'correct'],
      [{ char: 'きょ', inputPatterns: ['kyo', 'kilyo', 'kixyo'] }, 'kyo', 'correct'],
      [{ char: 'っか', inputPatterns: ['kka', 'ltuka'] }, 'kka', 'correct'],
      [{ char: 'ん', inputPatterns: ['n', 'nn'] }, 'n', 'correct'],
      [{ char: 'ん', inputPatterns: ['n', 'nn'] }, 'nn', 'correct'],
    ])(
      '正解判定: chunk=%s, input="%s" → %s',
      (chunk: RomajiChunk, input: string, expected: string) => {
        const result = InputValidator.validate(input, chunk);
        expect(result).toBe(expected);
      }
    );

    it.each([
      [{ char: 'か', inputPatterns: ['ka'] }, 'k', 'partial'],
      [{ char: 'し', inputPatterns: ['si', 'shi'] }, 's', 'partial'],
      [{ char: 'し', inputPatterns: ['si', 'shi'] }, 'sh', 'partial'],
      [{ char: 'きょ', inputPatterns: ['kyo', 'kilyo', 'kixyo'] }, 'k', 'partial'],
      [{ char: 'きょ', inputPatterns: ['kyo', 'kilyo', 'kixyo'] }, 'ky', 'partial'],
      [{ char: 'きょ', inputPatterns: ['kyo', 'kilyo', 'kixyo'] }, 'ki', 'partial'],
      [{ char: 'きょ', inputPatterns: ['kyo', 'kilyo', 'kixyo'] }, 'kil', 'partial'],
      [{ char: 'っか', inputPatterns: ['kka', 'ltuka'] }, 'kk', 'partial'],
      [{ char: 'っか', inputPatterns: ['kka', 'ltuka'] }, 'ltu', 'partial'],
      [{ char: 'っか', inputPatterns: ['kka', 'ltuka'] }, 'ltuk', 'partial'],
    ])(
      '部分一致判定: chunk=%s, input="%s" → %s',
      (chunk: RomajiChunk, input: string, expected: string) => {
        const result = InputValidator.validate(input, chunk);
        expect(result).toBe(expected);
      }
    );

    it.each([
      [{ char: 'あ', inputPatterns: ['a'] }, 'b', 'incorrect'],
      [{ char: 'か', inputPatterns: ['ka'] }, 'x', 'incorrect'],
      [{ char: 'か', inputPatterns: ['ka'] }, 'ki', 'incorrect'],
      [{ char: 'し', inputPatterns: ['si', 'shi'] }, 'sa', 'incorrect'],
      [{ char: 'きょ', inputPatterns: ['kyo', 'kilyo', 'kixyo'] }, 'ka', 'incorrect'],
      [{ char: 'っか', inputPatterns: ['kka', 'ltuka'] }, 'ka', 'incorrect'],
      [{ char: 'ん', inputPatterns: ['n', 'nn'] }, 'na', 'incorrect'],
    ])(
      '不正解判定: chunk=%s, input="%s" → %s',
      (chunk: RomajiChunk, input: string, expected: string) => {
        const result = InputValidator.validate(input, chunk);
        expect(result).toBe(expected);
      }
    );

    it('空文字入力は partial を返す', () => {
      const chunk: RomajiChunk = { char: 'あ', inputPatterns: ['a'] };
      const result = InputValidator.validate('', chunk);
      expect(result).toBe('partial');
    });
  });
});
