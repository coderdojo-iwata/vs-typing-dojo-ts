import { LocalSentenceRepository } from '../../infrastructure/repositories/LocalSentenceRepository';
import { createApiSentenceRepository } from '../../infrastructure/repositories/ApiSentenceRepository';
import { RomajiConverter } from '../../domain/services/RomajiConverter';
import { filterValidSentences } from '../../domain/services/SentenceValidator';
import { shuffle } from '../../shared/shuffle';
import type { Sentence, RawSentence } from '../../domain/entities/Sentence';
import type { SentenceSource } from '../../shared/types';

export async function initializeGame(
  source: SentenceSource = 'local',
  apiKey?: string
): Promise<Sentence[]> {
  const repository =
    source === 'api' && apiKey
      ? createApiSentenceRepository(apiKey)
      : LocalSentenceRepository;
  const rawSentences = filterValidSentences(await repository.getSentences());
  if (rawSentences.length === 0) {
    throw new Error('有効な出題文がありません。');
  }
  return shuffle(
    rawSentences.map((raw: RawSentence) => {
      const { romaji, chunks } = RomajiConverter.convert(raw.reading);
      return { japanese: raw.japanese, reading: raw.reading, romaji, chunks };
    })
  );
}
