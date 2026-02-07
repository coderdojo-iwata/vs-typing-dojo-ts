import type { SentenceRepository } from '../../domain/repositories/SentenceRepository';
import type { Sentence } from '../../domain/entities/Sentence';
import { RomajiConverter } from '../../domain/services/RomajiConverter';
import { callChatCompletion } from '../api/openaiClient';

interface RawSentence {
  japanese: string;
  reading: string;
}

const PROMPT = `タイピング練習用の日本語の短文を10個生成してください。

条件:
- 各文は10〜25文字程度
- 日常的で自然な日本語
- ひらがな読みが正確に対応する文（漢字にはふりがなが一意に決まるものを使用）
- 固有名詞は避ける
- 以下の JSON 形式で出力:

[
  { "japanese": "今日はいい天気です", "reading": "きょうはいいてんきです" },
  { "japanese": "桜の花が咲いた", "reading": "さくらのはながさいた" }
]

JSON のみを出力し、それ以外のテキストは含めないでください。`;

export function createApiSentenceRepository(
  apiKey: string
): SentenceRepository {
  return {
    async getSentences(): Promise<Sentence[]> {
      const content = await callChatCompletion(apiKey, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'あなたはタイピング練習用の文章を生成するアシスタントです。指定された形式のJSONのみを出力してください。',
          },
          { role: 'user', content: PROMPT },
        ],
        temperature: 0.8,
      });

      let rawSentences: RawSentence[];
      try {
        rawSentences = JSON.parse(content);
      } catch {
        throw new Error('APIのレスポンスが不正です。再度お試しください。');
      }

      if (!Array.isArray(rawSentences) || rawSentences.length === 0) {
        throw new Error('APIのレスポンスが不正です。再度お試しください。');
      }

      return rawSentences.map((raw) => {
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
}
