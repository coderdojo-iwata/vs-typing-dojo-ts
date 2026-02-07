import { describe, it, expect } from 'vitest';
import { LocalSentenceRepository } from '../../../src/infrastructure/repositories/LocalSentenceRepository';

describe('LocalSentenceRepository', () => {
  it('文のリストを取得できる', async () => {
    const sentences = await LocalSentenceRepository.getSentences();
    expect(sentences.length).toBeGreaterThanOrEqual(10);
  });

  it('各文が japanese と reading を持つ', async () => {
    const sentences = await LocalSentenceRepository.getSentences();
    for (const sentence of sentences) {
      expect(sentence.japanese).toBeTruthy();
      expect(sentence.reading).toBeTruthy();
    }
  });
});
