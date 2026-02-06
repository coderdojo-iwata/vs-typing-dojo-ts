# 初回実装タスクリスト

## Phase 1: プロジェクトセットアップ

- [x] 1.1 Vite + React + TypeScript プロジェクト初期化
- [x] 1.2 Tailwind CSS 設定
- [x] 1.3 ESLint 設定
- [x] 1.4 Prettier 設定
- [x] 1.5 Vitest 設定
- [x] 1.6 VSCode 設定（.vscode/settings.json, extensions.json）
- [x] 1.7 ディレクトリ構造作成（src/domain, application, infrastructure, presentation）
- [x] 1.8 動作確認（npm run dev, npm run test）

## Phase 2: Domain層

### 2.1 RomajiConverter

- [x] 2.1.1 テスト作成: 基本的なひらがな変換（あ→a, か→ka）
- [x] 2.1.2 テストレビュー依頼
- [x] 2.1.3 実装: 基本的なひらがな変換
- [x] 2.1.4 テスト作成: 拗音の変換（きょ→kyo）
- [x] 2.1.5 テストレビュー依頼
- [x] 2.1.6 実装: 拗音の変換
- [x] 2.1.7 テスト作成: 促音の変換（っか→kka, xtuka）
- [x] 2.1.8 テストレビュー依頼
- [x] 2.1.9 実装: 促音の変換
- [x] 2.1.10 テスト作成: 撥音の変換（ん→n, nn）
- [x] 2.1.11 テストレビュー依頼
- [x] 2.1.12 実装: 撥音の変換

### 2.2 InputValidator

- [x] 2.2.1 テスト作成: 正解判定・部分一致判定・不正解判定
- [x] 2.2.2 テストレビュー依頼
- [x] 2.2.3 実装: 入力判定

### 2.3 Sentence エンティティ

- [x] 2.3.1 型定義作成（Sentence, RomajiChunk）

### 2.4 Player エンティティ

- [x] 2.4.1 テスト作成: スコア加算
- [x] 2.4.2 テストレビュー依頼
- [x] 2.4.3 実装: スコア加算
- [x] 2.4.4 テスト作成: 位置管理（nextChunk, nextSentence）
- [x] 2.4.5 テストレビュー依頼
- [x] 2.4.6 実装: 位置管理

### 2.5 Game エンティティ

- [x] 2.5.1 テスト作成: 状態遷移（idle → countdown → playing → finished）
- [x] 2.5.2 テストレビュー依頼
- [x] 2.5.3 実装: 状態遷移
- [x] 2.5.4 テスト作成: 勝者判定
- [x] 2.5.5 テストレビュー依頼
- [x] 2.5.6 実装: 勝者判定

## Phase 3: Infrastructure層

- [x] 3.1 sentences.json 作成（最低10文）
- [x] 3.2 LocalSentenceRepository 実装
- [x] 3.3 動作確認（データ読み込み）

## Phase 4: Application層

### 4.1 GameUseCase

- [x] 4.1.1 テスト作成: ゲーム開始フロー
- [x] 4.1.2 テストレビュー依頼
- [x] 4.1.3 実装: ゲーム開始フロー
- [x] 4.1.4 テスト作成: タイマー更新
- [x] 4.1.5 テストレビュー依頼
- [x] 4.1.6 実装: タイマー更新
- [x] 4.1.7 テスト作成: ゲーム終了
- [x] 4.1.8 テストレビュー依頼
- [x] 4.1.9 実装: ゲーム終了

### 4.2 InputUseCase

- [x] 4.2.1 テスト作成: プレイヤー振り分け（大文字/小文字）
- [x] 4.2.2 テストレビュー依頼
- [x] 4.2.3 実装: プレイヤー振り分け
- [x] 4.2.4 テスト作成: 入力処理とスコア更新
- [x] 4.2.5 テストレビュー依頼
- [x] 4.2.6 実装: 入力処理とスコア更新

## Phase 5: Presentation層

### 5.1 状態管理

- [x] 5.1.1 GameContext 作成
- [x] 5.1.2 useGame フック作成
- [x] 5.1.3 useKeyboardInput フック作成

### 5.2 コンポーネント

- [x] 5.2.1 App コンポーネント（画面切り替え）
- [x] 5.2.2 TitleScreen コンポーネント
- [x] 5.2.3 Timer コンポーネント
- [x] 5.2.4 ScoreBoard コンポーネント
- [x] 5.2.5 SentenceDisplay コンポーネント
- [x] 5.2.6 PlayerArea コンポーネント
- [x] 5.2.7 GameScreen コンポーネント
- [x] 5.2.8 ResultModal コンポーネント

### 5.3 スタイリング

- [x] 5.3.1 タイトル画面のスタイリング
- [x] 5.3.2 ゲーム画面のスタイリング
- [x] 5.3.3 結果モーダルのスタイリング

## Phase 6: 統合・動作確認

- [x] 6.1 全体の結合
- [ ] 6.2 手動動作確認
- [x] 6.3 バグ修正
- [x] 6.4 コードレビュー
- [x] 6.5 リファクタリング

## 進捗管理

| Phase | 状態 | 完了タスク数 |
|-------|------|-------------|
| Phase 1: セットアップ | 完了 | 8/8 |
| Phase 2: Domain層 | 完了 | 22/22 |
| Phase 3: Infrastructure層 | 完了 | 3/3 |
| Phase 4: Application層 | 完了 | 12/12 |
| Phase 5: Presentation層 | 完了 | 14/14 |
| Phase 6: 統合 | 進行中 | 4/5 |
| **合計** | **進行中** | **63/64** |
