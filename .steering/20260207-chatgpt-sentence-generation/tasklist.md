# ChatGPT API 出題文生成 - タスクリスト

## Phase 1: ローカル出題データ拡充

- [x] 1.1 sentences.json を30文に拡充（既に30文あり完了済み）

## Phase 2: Infrastructure 層

- [x] 2.1 openaiClient.ts 作成（fetch ラッパー）
- [x] 2.2 ApiSentenceRepository テスト作成
- [x] 2.3 ApiSentenceRepository 実装

## Phase 3: Presentation 層

- [x] 3.1 SentenceSource 型定義追加
- [x] 3.2 useApiKey フック作成
- [x] 3.3 ApiKeyInput コンポーネント作成
- [x] 3.4 TitleScreen に出題ソース選択 UI 追加
- [x] 3.5 useGame を出題ソース対応に変更
- [x] 3.6 App / GameScreenWrapper の state 受け渡し修正
- [x] 3.7 エラーハンドリング・ローディング表示

## Phase 4: 品質チェック

- [x] 4.1 全テスト通過確認（198件 pass）
- [x] 4.2 lint / typecheck 通過確認
- [x] 4.3 ドキュメント更新

## 進捗管理

| Phase | 状態 | 完了タスク数 |
|-------|------|-------------|
| Phase 1: データ拡充 | 完了 | 1/1 |
| Phase 2: Infrastructure | 完了 | 3/3 |
| Phase 3: Presentation | 完了 | 7/7 |
| Phase 4: 品質チェック | 完了 | 3/3 |
| **合計** | **完了** | **14/14** |
