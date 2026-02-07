import type { SentenceRepository } from '../../domain/repositories/SentenceRepository';
import type { RawSentence } from '../../domain/entities/Sentence';
import sentencesData from '../../data/sentences.json';

export const LocalSentenceRepository: SentenceRepository = {
  async getSentences(): Promise<RawSentence[]> {
    return sentencesData.sentences as RawSentence[];
  },
};
