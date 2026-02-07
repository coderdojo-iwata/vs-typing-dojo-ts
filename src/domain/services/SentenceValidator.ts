import type { RawSentence } from '../entities/Sentence';
import { RomajiConverter } from './RomajiConverter';

const VALID_JAPANESE_PATTERN = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/;

function isConvertibleReading(reading: string): boolean {
  const { chunks } = RomajiConverter.convert(reading);
  const converted = chunks.map((c) => c.char).join('');
  return converted === reading;
}

export function isValidSentence(sentence: RawSentence): boolean {
  if (!sentence.japanese || !sentence.reading) {
    return false;
  }

  if (!VALID_JAPANESE_PATTERN.test(sentence.japanese)) {
    return false;
  }

  if (!isConvertibleReading(sentence.reading)) {
    return false;
  }

  return true;
}

export function filterValidSentences(sentences: RawSentence[]): RawSentence[] {
  return sentences.filter(isValidSentence);
}
