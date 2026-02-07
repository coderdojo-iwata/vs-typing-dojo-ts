import { ROMAJI_MAP } from './romajiMappings';

/**
 * ローマ字チャンク（入力判定の単位）
 */
export interface RomajiChunk {
  /** 元のひらがな（例: "きょ", "う", "ん"） */
  char: string;
  /** 許容される入力パターン（例: ["kyo", "kilyo", "kixyo"]） */
  inputPatterns: string[];
}

/**
 * ローマ字変換結果
 */
export interface ConvertResult {
  /** 表示用ローマ字 */
  romaji: string;
  /** 入力判定用チャンク */
  chunks: RomajiChunk[];
}

export const RomajiConverter = {
  convert(reading: string): ConvertResult {
    const chunks: RomajiChunk[] = [];
    let romaji = '';
    let i = 0;

    while (i < reading.length) {
      const twoChars = reading.slice(i, i + 2);
      const oneChar = reading[i];

      if (twoChars.length === 2 && ROMAJI_MAP[twoChars]) {
        const mapping = ROMAJI_MAP[twoChars];
        chunks.push({
          char: twoChars,
          inputPatterns: mapping.inputPatterns,
        });
        romaji += mapping.romaji;
        i += 2;
      } else if (oneChar && ROMAJI_MAP[oneChar]) {
        const mapping = ROMAJI_MAP[oneChar];
        chunks.push({
          char: oneChar,
          inputPatterns: mapping.inputPatterns,
        });
        romaji += mapping.romaji;
        i += 1;
      } else {
        i += 1;
      }
    }

    return { romaji, chunks };
  },
};
