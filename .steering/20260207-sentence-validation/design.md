# 出題文バリデーション - 設計書

## 実装アプローチ

Domain サービスとして `SentenceValidator` を新規作成する。
`RawSentence` を受け取り、各バリデーションルールを適用して有効/無効を判定する。

## 新規作成ファイル

| ファイル | 層 | 役割 |
|---------|---|------|
| `src/domain/services/SentenceValidator.ts` | Domain | バリデーションロジック |
| `tests/domain/services/SentenceValidator.test.ts` | Test | テスト |

## 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/hooks/useGame.ts` | ローマ字変換前にバリデーション適用 |

## バリデーション設計

### 判定関数

```typescript
// 1文が有効かどうかを判定
function isValidSentence(sentence: RawSentence): boolean

// 有効な文のみをフィルタ
function filterValidSentences(sentences: RawSentence[]): RawSentence[]
```

### 各ルールの実装方針

#### SV-001: japanese の記号チェック

漢字・ひらがな・カタカナ以外の文字が含まれていたら無効とする。

```typescript
// 漢字・ひらがな・カタカナのみで構成されているか
const VALID_JAPANESE_PATTERN = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/;
```

#### SV-002: reading の変換可能性チェック

reading の全文字が `RomajiConverter.convert()` で処理可能かを判定する。
RomajiConverter の ROMAJI_MAP のキーを公開し、reading の各文字（1文字 or 2文字単位）が全て存在するかを検証する。

```typescript
// RomajiConverter から変換可能な文字セットを取得
RomajiConverter.canConvert(reading: string): boolean
```

RomajiConverter に `canConvert` メソッドを追加するのではなく、convert 結果のチャンクから判定する。
convert で生成されたチャンクの文字を結合して元の reading と一致するか比較する。

```typescript
function isConvertibleReading(reading: string): boolean {
  const { chunks } = RomajiConverter.convert(reading);
  const converted = chunks.map(c => c.char).join('');
  return converted === reading;
}
```

#### SV-003: reading の長音符チェック

SV-002 で自動検出される（「ー」は ROMAJI_MAP にないため convert でスキップされ、reading と不一致になる）。
独立ルールとしては不要。

#### SV-004: reading の空白チェック

SV-002 で自動検出される（スペースは ROMAJI_MAP にないため同上）。

#### SV-005: reading のカタカナ混入チェック

SV-002 で自動検出される（カタカナは ROMAJI_MAP にないため同上）。

#### SV-006: 空文字チェック

japanese / reading が空文字または未定義でないかをチェック。

### まとめ

SV-003, SV-004, SV-005 は SV-002 の `isConvertibleReading` で一括検出できるため、
実装上のチェックは以下の3つに集約される:

1. **空文字チェック** (SV-006)
2. **japanese の文字種チェック** (SV-001)
3. **reading の変換可能性チェック** (SV-002, SV-003, SV-004, SV-005)

## useGame.ts への適用

```typescript
// 変更前
const rawSentences = await repository.getSentences();
const sentences = shuffle(rawSentences.map(...));

// 変更後
const rawSentences = await repository.getSentences();
const validSentences = filterValidSentences(rawSentences);
if (validSentences.length === 0) {
  throw new Error('有効な出題文がありません。');
}
const sentences = shuffle(validSentences.map(...));
```

## 影響範囲

### 変更なし

- RomajiConverter（変更せず、convert の結果を利用して判定）
- InputValidator
- Game / Player / Sentence エンティティ
- Infrastructure 層
- UI コンポーネント

### 変更あり

- `useGame.ts`: フィルタ処理追加（1行）
- Domain 層: `SentenceValidator.ts` 新規追加
