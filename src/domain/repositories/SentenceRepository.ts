import type { Sentence } from '../entities/Sentence';

export interface SentenceRepository {
  getSentences(): Promise<Sentence[]>;
}
