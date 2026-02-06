import type { RomajiChunk } from './RomajiConverter';

export type ValidationResult = 'correct' | 'partial' | 'incorrect';

export const InputValidator = {
  validate(input: string, chunk: RomajiChunk): ValidationResult {
    if (input === '') return 'partial';

    if (chunk.inputPatterns.some((pattern) => pattern === input)) {
      return 'correct';
    }

    if (chunk.inputPatterns.some((pattern) => pattern.startsWith(input))) {
      return 'partial';
    }

    return 'incorrect';
  },
};
