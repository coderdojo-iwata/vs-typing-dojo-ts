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

const ROMAJI_MAP: Record<string, { romaji: string; inputPatterns: string[] }> = {
  あ: { romaji: 'a', inputPatterns: ['a'] },
  い: { romaji: 'i', inputPatterns: ['i'] },
  う: { romaji: 'u', inputPatterns: ['u'] },
  え: { romaji: 'e', inputPatterns: ['e'] },
  お: { romaji: 'o', inputPatterns: ['o'] },

  か: { romaji: 'ka', inputPatterns: ['ka'] },
  き: { romaji: 'ki', inputPatterns: ['ki'] },
  く: { romaji: 'ku', inputPatterns: ['ku'] },
  け: { romaji: 'ke', inputPatterns: ['ke'] },
  こ: { romaji: 'ko', inputPatterns: ['ko'] },

  さ: { romaji: 'sa', inputPatterns: ['sa'] },
  し: { romaji: 'si', inputPatterns: ['si', 'shi'] },
  す: { romaji: 'su', inputPatterns: ['su'] },
  せ: { romaji: 'se', inputPatterns: ['se'] },
  そ: { romaji: 'so', inputPatterns: ['so'] },

  た: { romaji: 'ta', inputPatterns: ['ta'] },
  ち: { romaji: 'ti', inputPatterns: ['ti', 'chi'] },
  つ: { romaji: 'tu', inputPatterns: ['tu', 'tsu'] },
  て: { romaji: 'te', inputPatterns: ['te'] },
  と: { romaji: 'to', inputPatterns: ['to'] },

  な: { romaji: 'na', inputPatterns: ['na'] },
  に: { romaji: 'ni', inputPatterns: ['ni'] },
  ぬ: { romaji: 'nu', inputPatterns: ['nu'] },
  ね: { romaji: 'ne', inputPatterns: ['ne'] },
  の: { romaji: 'no', inputPatterns: ['no'] },

  は: { romaji: 'ha', inputPatterns: ['ha'] },
  ひ: { romaji: 'hi', inputPatterns: ['hi'] },
  ふ: { romaji: 'hu', inputPatterns: ['hu', 'fu'] },
  へ: { romaji: 'he', inputPatterns: ['he'] },
  ほ: { romaji: 'ho', inputPatterns: ['ho'] },

  ま: { romaji: 'ma', inputPatterns: ['ma'] },
  み: { romaji: 'mi', inputPatterns: ['mi'] },
  む: { romaji: 'mu', inputPatterns: ['mu'] },
  め: { romaji: 'me', inputPatterns: ['me'] },
  も: { romaji: 'mo', inputPatterns: ['mo'] },

  や: { romaji: 'ya', inputPatterns: ['ya'] },
  ゆ: { romaji: 'yu', inputPatterns: ['yu'] },
  よ: { romaji: 'yo', inputPatterns: ['yo'] },

  ら: { romaji: 'ra', inputPatterns: ['ra'] },
  り: { romaji: 'ri', inputPatterns: ['ri'] },
  る: { romaji: 'ru', inputPatterns: ['ru'] },
  れ: { romaji: 're', inputPatterns: ['re'] },
  ろ: { romaji: 'ro', inputPatterns: ['ro'] },

  わ: { romaji: 'wa', inputPatterns: ['wa'] },
  を: { romaji: 'wo', inputPatterns: ['wo'] },
  ん: { romaji: 'n', inputPatterns: ['n', 'nn'] },

  が: { romaji: 'ga', inputPatterns: ['ga'] },
  ぎ: { romaji: 'gi', inputPatterns: ['gi'] },
  ぐ: { romaji: 'gu', inputPatterns: ['gu'] },
  げ: { romaji: 'ge', inputPatterns: ['ge'] },
  ご: { romaji: 'go', inputPatterns: ['go'] },

  ざ: { romaji: 'za', inputPatterns: ['za'] },
  じ: { romaji: 'zi', inputPatterns: ['zi', 'ji'] },
  ず: { romaji: 'zu', inputPatterns: ['zu'] },
  ぜ: { romaji: 'ze', inputPatterns: ['ze'] },
  ぞ: { romaji: 'zo', inputPatterns: ['zo'] },

  だ: { romaji: 'da', inputPatterns: ['da'] },
  ぢ: { romaji: 'di', inputPatterns: ['di'] },
  づ: { romaji: 'du', inputPatterns: ['du'] },
  で: { romaji: 'de', inputPatterns: ['de'] },
  ど: { romaji: 'do', inputPatterns: ['do'] },

  ば: { romaji: 'ba', inputPatterns: ['ba'] },
  び: { romaji: 'bi', inputPatterns: ['bi'] },
  ぶ: { romaji: 'bu', inputPatterns: ['bu'] },
  べ: { romaji: 'be', inputPatterns: ['be'] },
  ぼ: { romaji: 'bo', inputPatterns: ['bo'] },

  ぱ: { romaji: 'pa', inputPatterns: ['pa'] },
  ぴ: { romaji: 'pi', inputPatterns: ['pi'] },
  ぷ: { romaji: 'pu', inputPatterns: ['pu'] },
  ぺ: { romaji: 'pe', inputPatterns: ['pe'] },
  ぽ: { romaji: 'po', inputPatterns: ['po'] },

  きゃ: { romaji: 'kya', inputPatterns: ['kya', 'kilya', 'kixya'] },
  きゅ: { romaji: 'kyu', inputPatterns: ['kyu', 'kilyu', 'kixyu'] },
  きょ: { romaji: 'kyo', inputPatterns: ['kyo', 'kilyo', 'kixyo'] },
  しゃ: {
    romaji: 'sya',
    inputPatterns: ['sya', 'sha', 'silya', 'sixya', 'shilya', 'shixya'],
  },
  しゅ: {
    romaji: 'syu',
    inputPatterns: ['syu', 'shu', 'silyu', 'sixyu', 'shilyu', 'shixyu'],
  },
  しょ: {
    romaji: 'syo',
    inputPatterns: ['syo', 'sho', 'silyo', 'sixyo', 'shilyo', 'shixyo'],
  },
  ちゃ: {
    romaji: 'tya',
    inputPatterns: ['tya', 'cha', 'tilya', 'tixya', 'chilya', 'chixya'],
  },
  ちゅ: {
    romaji: 'tyu',
    inputPatterns: ['tyu', 'chu', 'tilyu', 'tixyu', 'chilyu', 'chixyu'],
  },
  ちょ: {
    romaji: 'tyo',
    inputPatterns: ['tyo', 'cho', 'tilyo', 'tixyo', 'chilyo', 'chixyo'],
  },
  にゃ: { romaji: 'nya', inputPatterns: ['nya', 'nilya', 'nixya'] },
  にゅ: { romaji: 'nyu', inputPatterns: ['nyu', 'nilyu', 'nixyu'] },
  にょ: { romaji: 'nyo', inputPatterns: ['nyo', 'nilyo', 'nixyo'] },
  ひゃ: { romaji: 'hya', inputPatterns: ['hya', 'hilya', 'hixya'] },
  ひゅ: { romaji: 'hyu', inputPatterns: ['hyu', 'hilyu', 'hixyu'] },
  ひょ: { romaji: 'hyo', inputPatterns: ['hyo', 'hilyo', 'hixyo'] },
  みゃ: { romaji: 'mya', inputPatterns: ['mya', 'milya', 'mixya'] },
  みゅ: { romaji: 'myu', inputPatterns: ['myu', 'milyu', 'mixyu'] },
  みょ: { romaji: 'myo', inputPatterns: ['myo', 'milyo', 'mixyo'] },
  りゃ: { romaji: 'rya', inputPatterns: ['rya', 'rilya', 'rixya'] },
  りゅ: { romaji: 'ryu', inputPatterns: ['ryu', 'rilyu', 'rixyu'] },
  りょ: { romaji: 'ryo', inputPatterns: ['ryo', 'rilyo', 'rixyo'] },

  ぎゃ: { romaji: 'gya', inputPatterns: ['gya', 'gilya', 'gixya'] },
  ぎゅ: { romaji: 'gyu', inputPatterns: ['gyu', 'gilyu', 'gixyu'] },
  ぎょ: { romaji: 'gyo', inputPatterns: ['gyo', 'gilyo', 'gixyo'] },
  じゃ: {
    romaji: 'zya',
    inputPatterns: ['zya', 'ja', 'zilya', 'zixya', 'jilya', 'jixya'],
  },
  じゅ: {
    romaji: 'zyu',
    inputPatterns: ['zyu', 'ju', 'zilyu', 'zixyu', 'jilyu', 'jixyu'],
  },
  じょ: {
    romaji: 'zyo',
    inputPatterns: ['zyo', 'jo', 'zilyo', 'zixyo', 'jilyo', 'jixyo'],
  },
  びゃ: { romaji: 'bya', inputPatterns: ['bya', 'bilya', 'bixya'] },
  びゅ: { romaji: 'byu', inputPatterns: ['byu', 'bilyu', 'bixyu'] },
  びょ: { romaji: 'byo', inputPatterns: ['byo', 'bilyo', 'bixyo'] },
  ぴゃ: { romaji: 'pya', inputPatterns: ['pya', 'pilya', 'pixya'] },
  ぴゅ: { romaji: 'pyu', inputPatterns: ['pyu', 'pilyu', 'pixyu'] },
  ぴょ: { romaji: 'pyo', inputPatterns: ['pyo', 'pilyo', 'pixyo'] },

  っか: {
    romaji: 'kka',
    inputPatterns: ['kka', 'ltuka', 'ltsuka', 'xtuka', 'xtsuka'],
  },
  っき: {
    romaji: 'kki',
    inputPatterns: ['kki', 'ltuki', 'ltsuki', 'xtuki', 'xtsuki'],
  },
  っく: {
    romaji: 'kku',
    inputPatterns: ['kku', 'ltuku', 'ltsuku', 'xtuku', 'xtsuku'],
  },
  っけ: {
    romaji: 'kke',
    inputPatterns: ['kke', 'ltuke', 'ltsuke', 'xtuke', 'xtsuke'],
  },
  っこ: {
    romaji: 'kko',
    inputPatterns: ['kko', 'ltuko', 'ltsuko', 'xtuko', 'xtsuko'],
  },
  っさ: {
    romaji: 'ssa',
    inputPatterns: ['ssa', 'ltusa', 'ltsusa', 'xtusa', 'xtsusa'],
  },
  っし: {
    romaji: 'ssi',
    inputPatterns: ['ssi', 'sshi', 'ltusi', 'ltsusi', 'xtusi', 'xtsusi'],
  },
  っす: {
    romaji: 'ssu',
    inputPatterns: ['ssu', 'ltusu', 'ltsusu', 'xtusu', 'xtsusu'],
  },
  っせ: {
    romaji: 'sse',
    inputPatterns: ['sse', 'ltuse', 'ltsuse', 'xtuse', 'xtsuse'],
  },
  っそ: {
    romaji: 'sso',
    inputPatterns: ['sso', 'ltuso', 'ltsuso', 'xtuso', 'xtsuso'],
  },
  った: {
    romaji: 'tta',
    inputPatterns: ['tta', 'ltuta', 'ltsuta', 'xtuta', 'xtsuta'],
  },
  っち: {
    romaji: 'tti',
    inputPatterns: ['tti', 'cchi', 'ltuti', 'ltsuti', 'xtuti', 'xtsuti'],
  },
  っつ: {
    romaji: 'ttu',
    inputPatterns: ['ttu', 'ttsu', 'ltutu', 'ltsutu', 'xtutu', 'xtsutu'],
  },
  って: {
    romaji: 'tte',
    inputPatterns: ['tte', 'ltute', 'ltsute', 'xtute', 'xtsute'],
  },
  っと: {
    romaji: 'tto',
    inputPatterns: ['tto', 'ltuto', 'ltsuto', 'xtuto', 'xtsuto'],
  },
  っぱ: {
    romaji: 'ppa',
    inputPatterns: ['ppa', 'ltupa', 'ltsupa', 'xtupa', 'xtsupa'],
  },
  っぴ: {
    romaji: 'ppi',
    inputPatterns: ['ppi', 'ltupi', 'ltsupi', 'xtupi', 'xtsupi'],
  },
  っぷ: {
    romaji: 'ppu',
    inputPatterns: ['ppu', 'ltupu', 'ltsupu', 'xtupu', 'xtsupu'],
  },
  っぺ: {
    romaji: 'ppe',
    inputPatterns: ['ppe', 'ltupe', 'ltsupe', 'xtupe', 'xtsupe'],
  },
  っぽ: {
    romaji: 'ppo',
    inputPatterns: ['ppo', 'ltupo', 'ltsupo', 'xtupo', 'xtsupo'],
  },
};

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
