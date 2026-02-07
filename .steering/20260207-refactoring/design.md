# リファクタリング - 設計書

## REF-001: useGame フックの責務分割

### 実装アプローチ

ゲーム初期化ロジックを Application 層の `InitializeGameUseCase` に抽出する。

### 新規ファイル

`src/application/usecases/InitializeGameUseCase.ts`

```typescript
export async function initializeGame(
  source: SentenceSource,
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
```

### useGame の変更

`startGame` は `initializeGame` を呼ぶだけになる:

```typescript
const startGame = useCallback(
  async (source: SentenceSource = 'local', apiKey?: string) => {
    const sentences = await initializeGame(source, apiKey);
    dispatch({ type: 'INIT', sentences });
    startCountdownSequence();
  },
  [dispatch, startCountdownSequence]
);
```

---

## REF-002: InputUseCase のプレイヤー更新ロジック重複排除

### 実装アプローチ

ファイル内にヘルパー関数を追加する。

```typescript
function updateGameWithPlayer(
  game: Game,
  playerId: 1 | 2,
  player: Player,
  validation: ValidationResult
): Game {
  const updated =
    playerId === 1
      ? { ...game, player1: player }
      : { ...game, player2: player };
  return { ...updated, lastValidation: { playerId, result: validation } };
}
```

`processInput` 内の2箇所（incorrect 分岐 + correct/partial 分岐）をこのヘルパーで置換。

---

## REF-003: 成績計算ロジックの Domain 層移動

### 新規ファイル

`src/domain/services/StatsCalculator.ts`

```typescript
import type { Player } from '../entities/Player';
import { GAME_CONFIG } from '../../shared/gameConfig';

export function calcAccuracy(player: Player): number {
  const total = player.correctTypes + player.missTypes;
  if (total === 0) return 0;
  return Math.round((player.correctTypes / total) * 1000) / 10;
}

export function calcKpm(player: Player, remainingTime: number): number {
  const elapsed = GAME_CONFIG.DURATION_SECONDS - remainingTime;
  if (elapsed === 0) return 0;
  return Math.round((player.correctTypes / elapsed) * 60);
}
```

### テスト

`tests/domain/services/StatsCalculator.test.ts` を新規作成。

### ResultModal の変更

ローカルの `calcAccuracy` / `calcKpm` を削除し、`StatsCalculator` からインポートする。

---

## REF-004: マジックナンバーの定数化

### gameConfig.ts の変更

```typescript
export const GAME_CONFIG = {
  DURATION_SECONDS: 60,
  COUNTDOWN_MS: 3000,
  COUNTDOWN_VALUE: 3,        // 追加
  TICK_INTERVAL_MS: 1000,
  NO_MISS_BONUS: 10,
  FLASH_DURATION_MS: 80,     // 追加
} as const;
```

### API 設定定数

`src/shared/apiConfig.ts` を新規作成:

```typescript
export const API_CONFIG = {
  MODEL: 'gpt-4o-mini',
  TIMEOUT_MS: 60000,
  TEMPERATURE: 0.8,
} as const;
```

### 変更箇所

| 変更前 | 変更先 | ファイル |
|--------|--------|----------|
| `let count = 3` | `GAME_CONFIG.COUNTDOWN_VALUE` | useGame.ts |
| `}, 80)` | `GAME_CONFIG.FLASH_DURATION_MS` | GameScreen.tsx |
| `'gpt-4o-mini'` | `API_CONFIG.MODEL` | ApiSentenceRepository.ts |
| `AbortSignal.timeout(60000)` | `API_CONFIG.TIMEOUT_MS` | openaiClient.ts |
| `temperature: 0.8` | `API_CONFIG.TEMPERATURE` | ApiSentenceRepository.ts |

---

## REF-005: RomajiConverter のマッピング分離

### 新規ファイル

`src/domain/services/romajiMappings.ts`

- `ROMAJI_MAP` 定数と型定義 `RomajiMapping` をここに移動

### RomajiConverter.ts の変更

- `ROMAJI_MAP` のインポートのみに変更
- ファイルは型定義（`RomajiChunk`, `ConvertResult`）と `convert` ロジックのみ残る
- 285行 → 約 50行

---

## REF-006: openaiClient のレスポンス検証強化

### 変更箇所

`src/infrastructure/api/openaiClient.ts` の `data.choices[0].message.content` アクセスにガードを追加:

```typescript
const data = await response.json();
const content = data?.choices?.[0]?.message?.content;
if (typeof content !== 'string') {
  throw new Error('APIから有効なレスポンスを取得できませんでした。');
}
return content;
```

---

## 変更まとめ

### 新規作成

| ファイル | 内容 |
|---------|------|
| `src/application/usecases/InitializeGameUseCase.ts` | ゲーム初期化ユースケース |
| `src/domain/services/StatsCalculator.ts` | 成績計算サービス |
| `src/domain/services/romajiMappings.ts` | ローマ字マッピング定義 |
| `src/shared/apiConfig.ts` | API 設定定数 |
| `tests/domain/services/StatsCalculator.test.ts` | 成績計算テスト |

### 変更

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/hooks/useGame.ts` | 初期化ロジック → InitializeGameUseCase 呼び出し |
| `src/application/usecases/InputUseCase.ts` | ヘルパー関数抽出 |
| `src/presentation/components/ResultModal.tsx` | 計算ロジック → StatsCalculator 呼び出し |
| `src/presentation/components/GameScreen.tsx` | フラッシュ定数化 |
| `src/domain/services/RomajiConverter.ts` | マッピング分離 |
| `src/infrastructure/api/openaiClient.ts` | レスポンス検証追加 |
| `src/infrastructure/repositories/ApiSentenceRepository.ts` | API 定数化 |
| `src/shared/gameConfig.ts` | 定数追加 |
