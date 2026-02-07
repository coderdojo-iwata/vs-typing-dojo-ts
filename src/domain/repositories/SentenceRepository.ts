import type { RawSentence } from '../entities/Sentence';

export interface SentenceRepository {
  getSentences(): Promise<RawSentence[]>;
}
