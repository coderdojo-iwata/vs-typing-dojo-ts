import type { SentenceRepository } from '../../domain/repositories/SentenceRepository';
import type { Sentence } from '../../domain/entities/Sentence';
import { RomajiConverter } from '../../domain/services/RomajiConverter';
import sentencesData from '../../data/sentences.json';

interface RawSentence {
  japanese: string;
  reading: string;
}

export const LocalSentenceRepository: SentenceRepository = {
  async getSentences(): Promise<Sentence[]> {
    return (sentencesData.sentences as RawSentence[]).map((raw) => {
      const { romaji, chunks } = RomajiConverter.convert(raw.reading);
      return {
        japanese: raw.japanese,
        reading: raw.reading,
        romaji,
        chunks,
      };
    });
  },
};
