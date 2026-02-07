# リファクタリング - タスクリスト

## Phase 1: Application / Domain 層

- [x] 1.1 InitializeGameUseCase 作成（REF-001）
- [x] 1.2 useGame から初期化ロジックを削除し InitializeGameUseCase を使用（REF-001）
- [x] 1.3 InputUseCase に updateGameWithPlayer ヘルパー抽出（REF-002）
- [x] 1.4 StatsCalculator 作成 + テスト追加（REF-003）
- [x] 1.5 ResultModal の計算ロジックを StatsCalculator に置換（REF-003）

## Phase 2: Infrastructure / Shared 層

- [x] 2.1 gameConfig に COUNTDOWN_VALUE, FLASH_DURATION_MS 追加（REF-004）
- [x] 2.2 apiConfig.ts 新規作成（REF-004）
- [x] 2.3 useGame, GameScreen, ApiSentenceRepository, openaiClient のマジックナンバー置換（REF-004）
- [x] 2.4 romajiMappings.ts に ROMAJI_MAP を分離（REF-005）
- [x] 2.5 RomajiConverter から ROMAJI_MAP をインポートに変更（REF-005）
- [x] 2.6 openaiClient のレスポンス検証強化（REF-006）

## Phase 3: 品質チェック

- [x] 3.1 全テスト通過確認
- [x] 3.2 lint / typecheck 通過確認

## 進捗管理

| Phase | 状態 | 完了タスク数 |
|-------|------|-------------|
| Phase 1: Application / Domain | 完了 | 5/5 |
| Phase 2: Infrastructure / Shared | 完了 | 6/6 |
| Phase 3: 品質チェック | 完了 | 2/2 |
| **合計** | **完了** | **13/13** |
