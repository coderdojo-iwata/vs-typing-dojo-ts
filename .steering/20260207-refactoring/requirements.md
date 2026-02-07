# リファクタリング - 要求定義

## 概要

コードベースの保守性・テスタビリティ・アーキテクチャ整合性を向上させるためのリファクタリングを実施する。
機能追加や動作変更は行わず、既存テストが全て通ることを前提とする。

## リファクタリング要件

### REF-001: useGame フックの責務分割

`useGame` フックにリポジトリ選択・バリデーション・ローマ字変換・シャッフル・タイマー管理・カウントダウンが集中しており、可読性と保守性が低い。

**対応方針:**

- ゲーム初期化ロジック（リポジトリ選択、バリデーション、ローマ字変換、シャッフル）を Application 層の `InitializeGameUseCase` に抽出
- useGame はユースケース呼び出し + state 管理に専念させる

**受け入れ条件:**

- `InitializeGameUseCase` が Application 層に作成される
- useGame フックの行数が削減され、責務が明確になる
- 既存の動作に変更がない

### REF-002: InputUseCase のプレイヤー更新ロジック重複排除

`processInput` 内で `playerId === 1 ? {...player1} : {...player2}` のパターンが2箇所で重複している。

**対応方針:**

- `updateGameWithPlayer(game, playerId, player, validation)` ヘルパー関数を抽出

**受け入れ条件:**

- 重複コードが1つのヘルパー関数に集約される
- 既存テストが全て通る

### REF-003: 成績計算ロジックの Domain 層移動

`ResultModal` コンポーネント内に `calcAccuracy` / `calcKpm` が定義されており、テストやモデルの再利用ができない。

**対応方針:**

- `src/domain/services/StatsCalculator.ts` に成績計算ロジックを移動
- 単体テストを追加

**受け入れ条件:**

- 成績計算が Domain 層のサービスとして独立する
- 単体テストが追加される
- ResultModal はサービスを呼び出すだけになる

### REF-004: マジックナンバーの定数化

以下のハードコード値を `GAME_CONFIG` 等の定数に集約する。

- カウントダウン初期値 `3`（`useGame.ts`）
- フラッシュ時間 `80ms`（`GameScreen.tsx`）
- API モデル名 `'gpt-4o-mini'`（`ApiSentenceRepository.ts`）

**受け入れ条件:**

- 上記の値が全て名前付き定数に置き換えられる

### REF-005: RomajiConverter のマッピング分離

`RomajiConverter.ts` の 285 行中 230 行がマッピング定義で、ロジックが埋もれている。

**対応方針:**

- マッピング定義を `romajiMappings.ts` に分離
- `RomajiConverter.ts` は変換ロジックのみに専念

**受け入れ条件:**

- マッピングが別ファイルに分離される
- RomajiConverter のロジック部分が見通しよくなる
- 既存テストが全て通る

### REF-006: openaiClient のレスポンス検証強化

API レスポンスの JSON パースや `choices[0].message.content` のアクセスにガードがなく、不正レスポンスで実行時エラーになりうる。

**対応方針:**

- レスポンス構造のバリデーションを追加
- 不正レスポンス時に明確なエラーを返す

**受け入れ条件:**

- 不正な API レスポンスに対して適切なエラーがスローされる
- 正常系の動作に変更がない
