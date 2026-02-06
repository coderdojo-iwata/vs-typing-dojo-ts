import type { RomajiChunk } from '../services/RomajiConverter';

export interface Sentence {
  /** 日本語表示（例: "今日は天気がいい"） */
  japanese: string;
  /** ひらがな読み（例: "きょうはてんきがいい"） */
  reading: string;
  /** 表示用ローマ字（例: "kyouhatenki..."） */
  romaji: string;
  /** 入力判定用チャンク */
  chunks: RomajiChunk[];
}
