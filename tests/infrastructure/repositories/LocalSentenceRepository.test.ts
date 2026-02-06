import { describe, it, expect } from 'vitest';
import { LocalSentenceRepository } from '../../../src/infrastructure/repositories/LocalSentenceRepository';

describe('LocalSentenceRepository', () => {
  it('文のリストを取得できる', async () => {
    const sentences = await LocalSentenceRepository.getSentences();
    expect(sentences.length).toBeGreaterThanOrEqual(10);
  });

  it('各文が正しい構造を持つ', async () => {
    const sentences = await LocalSentenceRepository.getSentences();
    for (const sentence of sentences) {
      expect(sentence.japanese).toBeTruthy();
      expect(sentence.reading).toBeTruthy();
      expect(sentence.romaji).toBeTruthy();
      expect(sentence.chunks.length).toBeGreaterThan(0);
    }
  });

  it('チャンクが正しい構造を持つ', async () => {
    const sentences = await LocalSentenceRepository.getSentences();
    const first = sentences[0]!;
    for (const chunk of first.chunks) {
      expect(chunk.char).toBeTruthy();
      expect(chunk.inputPatterns.length).toBeGreaterThan(0);
    }
  });
});
