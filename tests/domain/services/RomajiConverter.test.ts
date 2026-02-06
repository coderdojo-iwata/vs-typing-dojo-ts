import { describe, it, expect } from 'vitest';
import { RomajiConverter } from '../../../src/domain/services/RomajiConverter';

describe('RomajiConverter', () => {
  describe('convert', () => {
    it.each([
      ['あ', 'a', ['a']],
      ['い', 'i', ['i']],
      ['う', 'u', ['u']],
      ['え', 'e', ['e']],
      ['お', 'o', ['o']],
    ])(
      '母音: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it.each([
      ['か', 'ka', ['ka']],
      ['き', 'ki', ['ki']],
      ['く', 'ku', ['ku']],
      ['け', 'ke', ['ke']],
      ['こ', 'ko', ['ko']],
    ])(
      'か行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it.each([
      ['さ', 'sa', ['sa']],
      ['し', 'si', ['si', 'shi']],
      ['す', 'su', ['su']],
      ['せ', 'se', ['se']],
      ['そ', 'so', ['so']],
    ])(
      'さ行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it.each([
      ['た', 'ta', ['ta']],
      ['ち', 'ti', ['ti', 'chi']],
      ['つ', 'tu', ['tu', 'tsu']],
      ['て', 'te', ['te']],
      ['と', 'to', ['to']],
    ])(
      'た行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it.each([
      ['な', 'na', ['na']],
      ['に', 'ni', ['ni']],
      ['ぬ', 'nu', ['nu']],
      ['ね', 'ne', ['ne']],
      ['の', 'no', ['no']],
    ])(
      'な行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it.each([
      ['は', 'ha', ['ha']],
      ['ひ', 'hi', ['hi']],
      ['ふ', 'hu', ['hu', 'fu']],
      ['へ', 'he', ['he']],
      ['ほ', 'ho', ['ho']],
    ])(
      'は行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it.each([
      ['ま', 'ma', ['ma']],
      ['み', 'mi', ['mi']],
      ['む', 'mu', ['mu']],
      ['め', 'me', ['me']],
      ['も', 'mo', ['mo']],
    ])(
      'ま行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it.each([
      ['や', 'ya', ['ya']],
      ['ゆ', 'yu', ['yu']],
      ['よ', 'yo', ['yo']],
    ])(
      'や行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it.each([
      ['ら', 'ra', ['ra']],
      ['り', 'ri', ['ri']],
      ['る', 'ru', ['ru']],
      ['れ', 're', ['re']],
      ['ろ', 'ro', ['ro']],
    ])(
      'ら行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it.each([
      ['わ', 'wa', ['wa']],
      ['を', 'wo', ['wo']],
    ])(
      'わ行: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it.each([
      ['が', 'ga', ['ga']],
      ['ぎ', 'gi', ['gi']],
      ['ぐ', 'gu', ['gu']],
      ['げ', 'ge', ['ge']],
      ['ご', 'go', ['go']],
      ['ざ', 'za', ['za']],
      ['じ', 'zi', ['zi', 'ji']],
      ['ず', 'zu', ['zu']],
      ['ぜ', 'ze', ['ze']],
      ['ぞ', 'zo', ['zo']],
      ['だ', 'da', ['da']],
      ['ぢ', 'di', ['di']],
      ['づ', 'du', ['du']],
      ['で', 'de', ['de']],
      ['ど', 'do', ['do']],
      ['ば', 'ba', ['ba']],
      ['び', 'bi', ['bi']],
      ['ぶ', 'bu', ['bu']],
      ['べ', 'be', ['be']],
      ['ぼ', 'bo', ['bo']],
    ])(
      '濁音: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it.each([
      ['ぱ', 'pa', ['pa']],
      ['ぴ', 'pi', ['pi']],
      ['ぷ', 'pu', ['pu']],
      ['ぺ', 'pe', ['pe']],
      ['ぽ', 'po', ['po']],
    ])(
      '半濁音: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(expectedPatterns);
      }
    );

    it('複数文字: 「あい」を2つのチャンクに変換する', () => {
      const result = RomajiConverter.convert('あい');

      expect(result.romaji).toBe('ai');
      expect(result.chunks).toHaveLength(2);
      expect(result.chunks[0]?.char).toBe('あ');
      expect(result.chunks[1]?.char).toBe('い');
    });

    it('複数文字: 「かきく」を3つのチャンクに変換する', () => {
      const result = RomajiConverter.convert('かきく');

      expect(result.romaji).toBe('kakiku');
      expect(result.chunks).toHaveLength(3);
    });

    it.each([
      ['きゃ', 'kya', ['kya', 'kilya', 'kixya']],
      ['きゅ', 'kyu', ['kyu', 'kilyu', 'kixyu']],
      ['きょ', 'kyo', ['kyo', 'kilyo', 'kixyo']],
      ['しゃ', 'sya', ['sya', 'sha', 'silya', 'sixya', 'shilya', 'shixya']],
      ['しゅ', 'syu', ['syu', 'shu', 'silyu', 'sixyu', 'shilyu', 'shixyu']],
      ['しょ', 'syo', ['syo', 'sho', 'silyo', 'sixyo', 'shilyo', 'shixyo']],
      ['ちゃ', 'tya', ['tya', 'cha', 'tilya', 'tixya', 'chilya', 'chixya']],
      ['ちゅ', 'tyu', ['tyu', 'chu', 'tilyu', 'tixyu', 'chilyu', 'chixyu']],
      ['ちょ', 'tyo', ['tyo', 'cho', 'tilyo', 'tixyo', 'chilyo', 'chixyo']],
      ['にゃ', 'nya', ['nya', 'nilya', 'nixya']],
      ['にゅ', 'nyu', ['nyu', 'nilyu', 'nixyu']],
      ['にょ', 'nyo', ['nyo', 'nilyo', 'nixyo']],
      ['ひゃ', 'hya', ['hya', 'hilya', 'hixya']],
      ['ひゅ', 'hyu', ['hyu', 'hilyu', 'hixyu']],
      ['ひょ', 'hyo', ['hyo', 'hilyo', 'hixyo']],
      ['みゃ', 'mya', ['mya', 'milya', 'mixya']],
      ['みゅ', 'myu', ['myu', 'milyu', 'mixyu']],
      ['みょ', 'myo', ['myo', 'milyo', 'mixyo']],
      ['りゃ', 'rya', ['rya', 'rilya', 'rixya']],
      ['りゅ', 'ryu', ['ryu', 'rilyu', 'rixyu']],
      ['りょ', 'ryo', ['ryo', 'rilyo', 'rixyo']],
    ])(
      '拗音: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it.each([
      ['ぎゃ', 'gya', ['gya', 'gilya', 'gixya']],
      ['ぎゅ', 'gyu', ['gyu', 'gilyu', 'gixyu']],
      ['ぎょ', 'gyo', ['gyo', 'gilyo', 'gixyo']],
      ['じゃ', 'zya', ['zya', 'ja', 'zilya', 'zixya', 'jilya', 'jixya']],
      ['じゅ', 'zyu', ['zyu', 'ju', 'zilyu', 'zixyu', 'jilyu', 'jixyu']],
      ['じょ', 'zyo', ['zyo', 'jo', 'zilyo', 'zixyo', 'jilyo', 'jixyo']],
      ['びゃ', 'bya', ['bya', 'bilya', 'bixya']],
      ['びゅ', 'byu', ['byu', 'bilyu', 'bixyu']],
      ['びょ', 'byo', ['byo', 'bilyo', 'bixyo']],
      ['ぴゃ', 'pya', ['pya', 'pilya', 'pixya']],
      ['ぴゅ', 'pyu', ['pyu', 'pilyu', 'pixyu']],
      ['ぴょ', 'pyo', ['pyo', 'pilyo', 'pixyo']],
    ])(
      '拗音（濁音・半濁音）: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it('拗音を含む文字列: 「きょう」を2つのチャンクに変換する', () => {
      const result = RomajiConverter.convert('きょう');

      expect(result.romaji).toBe('kyou');
      expect(result.chunks).toHaveLength(2);
      expect(result.chunks[0]?.char).toBe('きょ');
      expect(result.chunks[1]?.char).toBe('う');
    });

    it.each([
      ['っか', 'kka', ['kka', 'ltuka', 'ltsuka', 'xtuka', 'xtsuka']],
      ['っき', 'kki', ['kki', 'ltuki', 'ltsuki', 'xtuki', 'xtsuki']],
      ['っく', 'kku', ['kku', 'ltuku', 'ltsuku', 'xtuku', 'xtsuku']],
      ['っけ', 'kke', ['kke', 'ltuke', 'ltsuke', 'xtuke', 'xtsuke']],
      ['っこ', 'kko', ['kko', 'ltuko', 'ltsuko', 'xtuko', 'xtsuko']],
      ['っさ', 'ssa', ['ssa', 'ltusa', 'ltsusa', 'xtusa', 'xtsusa']],
      ['っし', 'ssi', ['ssi', 'sshi', 'ltusi', 'ltsusi', 'xtusi', 'xtsusi']],
      ['っす', 'ssu', ['ssu', 'ltusu', 'ltsusu', 'xtusu', 'xtsusu']],
      ['っせ', 'sse', ['sse', 'ltuse', 'ltsuse', 'xtuse', 'xtsuse']],
      ['っそ', 'sso', ['sso', 'ltuso', 'ltsuso', 'xtuso', 'xtsuso']],
      ['った', 'tta', ['tta', 'ltuta', 'ltsuta', 'xtuta', 'xtsuta']],
      ['っち', 'tti', ['tti', 'cchi', 'ltuti', 'ltsuti', 'xtuti', 'xtsuti']],
      ['っつ', 'ttu', ['ttu', 'ttsu', 'ltutu', 'ltsutu', 'xtutu', 'xtsutu']],
      ['って', 'tte', ['tte', 'ltute', 'ltsute', 'xtute', 'xtsute']],
      ['っと', 'tto', ['tto', 'ltuto', 'ltsuto', 'xtuto', 'xtsuto']],
      ['っぱ', 'ppa', ['ppa', 'ltupa', 'ltsupa', 'xtupa', 'xtsupa']],
      ['っぴ', 'ppi', ['ppi', 'ltupi', 'ltsupi', 'xtupi', 'xtsupi']],
      ['っぷ', 'ppu', ['ppu', 'ltupu', 'ltsupu', 'xtupu', 'xtsupu']],
      ['っぺ', 'ppe', ['ppe', 'ltupe', 'ltsupe', 'xtupe', 'xtsupe']],
      ['っぽ', 'ppo', ['ppo', 'ltupo', 'ltsupo', 'xtupo', 'xtsupo']],
    ])(
      '促音: "%s" を romaji="%s", inputPatterns=%s に変換する',
      (input, expectedRomaji, expectedPatterns) => {
        const result = RomajiConverter.convert(input);

        expect(result.romaji).toBe(expectedRomaji);
        expect(result.chunks).toHaveLength(1);
        expect(result.chunks[0]?.char).toBe(input);
        expect(result.chunks[0]?.inputPatterns).toEqual(
          expect.arrayContaining(expectedPatterns)
        );
      }
    );

    it('促音を含む文字列: 「がっこう」を3つのチャンクに変換する', () => {
      const result = RomajiConverter.convert('がっこう');

      expect(result.romaji).toBe('gakkou');
      expect(result.chunks).toHaveLength(3);
      expect(result.chunks[0]?.char).toBe('が');
      expect(result.chunks[1]?.char).toBe('っこ');
      expect(result.chunks[2]?.char).toBe('う');
    });

    it('撥音: 「ん」を romaji="n", inputPatterns=["n", "nn"] に変換する', () => {
      const result = RomajiConverter.convert('ん');

      expect(result.romaji).toBe('n');
      expect(result.chunks).toHaveLength(1);
      expect(result.chunks[0]?.char).toBe('ん');
      expect(result.chunks[0]?.inputPatterns).toEqual(['n', 'nn']);
    });

    it('撥音を含む文字列: 「しんぶん」を4つのチャンクに変換する', () => {
      const result = RomajiConverter.convert('しんぶん');

      expect(result.romaji).toBe('sinbun');
      expect(result.chunks).toHaveLength(4);
      expect(result.chunks[0]?.char).toBe('し');
      expect(result.chunks[1]?.char).toBe('ん');
      expect(result.chunks[2]?.char).toBe('ぶ');
      expect(result.chunks[3]?.char).toBe('ん');
    });

    it('撥音を含む文字列: 「にほん」を3つのチャンクに変換する', () => {
      const result = RomajiConverter.convert('にほん');

      expect(result.romaji).toBe('nihon');
      expect(result.chunks).toHaveLength(3);
      expect(result.chunks[0]?.char).toBe('に');
      expect(result.chunks[1]?.char).toBe('ほ');
      expect(result.chunks[2]?.char).toBe('ん');
    });
  });
});
