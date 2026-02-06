# ユビキタス言語定義

## ドメイン用語

### ゲーム関連

| 日本語 | 英語 | コード上の名前 | 説明 |
|--------|------|---------------|------|
| ゲーム | Game | `Game` | 1回の対戦全体を表す |
| プレイヤー | Player | `Player` | 対戦に参加する人（1または2） |
| 対戦 | Match | - | 2人のプレイヤーによる1回のゲーム |
| ゲーム状態 | Game State | `GameState` | ゲームの進行状態（待機中、プレイ中、終了） |

### 出題関連

| 日本語 | 英語 | コード上の名前 | 説明 |
|--------|------|---------------|------|
| 出題文 | Sentence | `Sentence` | タイピングする1つの文章 |
| 日本語表示 | Japanese | `japanese` | 画面に表示する日本語の文章 |
| 読み | Reading | `reading` | 出題文のひらがな読み |
| ローマ字 | Romaji | `romaji` | 表示用のローマ字 |
| チャンク | Chunk | `RomajiChunk` | 入力判定の単位（1文字または複合文字） |
| 入力パターン | Input Patterns | `inputPatterns` | 1つのチャンクに対して許容される入力方法 |

### 入力関連

| 日本語 | 英語 | コード上の名前 | 説明 |
|--------|------|---------------|------|
| 入力位置 | Position | `currentChunkIndex` | 現在入力中のチャンクのインデックス |
| 入力中文字列 | Current Input | `currentInput` | 現在のチャンクに対する入力途中の文字列 |
| 正解入力 | Correct Input | - | パターンと一致する入力 |
| 誤入力 | Wrong Input | - | パターンと一致しない入力 |

### スコア関連

| 日本語 | 英語 | コード上の名前 | 説明 |
|--------|------|---------------|------|
| スコア | Score | `score` | プレイヤーの得点 |
| 残り時間 | Remaining Time | `remainingTime` | ゲーム終了までの秒数 |
| 勝者 | Winner | `winner` | スコアが高いプレイヤー |

## ローマ字入力関連

### 特殊文字

| 日本語 | 英語 | 説明 |
|--------|------|------|
| 拗音 | Palatalized Sound | 「きょ」「しゃ」など小さい「ゃゅょ」を含む音 |
| 促音 | Geminated Sound | 「っ」、次の子音を重ねるか単独入力 |
| 撥音 | Moraic Nasal Sound | 「ん」、状況により n または nn |

### 入力方式

| 日本語 | 英語 | 説明 | 例 |
|--------|------|------|-----|
| 子音重ね入力 | Consonant Doubling Input | 促音を次の子音を重ねて入力 | っか → kka |
| 分離入力 | Separated Input | 促音を xtu/ltu などで個別入力 | っか → xtuka |

## UI/UX用語

| 日本語 | 英語 | コード上の名前 | 説明 |
|--------|------|---------------|------|
| タイトル画面 | Title Screen | `TitleScreen` | ゲーム開始前の画面 |
| ゲーム画面 | Game Screen | `GameScreen` | 対戦中のメイン画面 |
| プレイヤーエリア | Player Area | `PlayerArea` | 各プレイヤーのタイピング領域 |
| 出題表示 | Sentence Display | `SentenceDisplay` | 出題文とローマ字を表示する部分 |
| タイマー | Timer | `Timer` | 残り時間を表示するコンポーネント |
| スコアボード | Score Board | `ScoreBoard` | スコアを表示するコンポーネント |
| 結果モーダル | Result Modal | `ResultModal` | ゲーム終了時の結果表示 |
| カウントダウン | Countdown | - | ゲーム開始前の 3, 2, 1 表示 |

## ゲーム状態

| 状態 | 英語 | コード上の値 | 説明 |
|------|------|-------------|------|
| 待機中 | Idle | `'idle'` | ゲーム開始前 |
| カウントダウン中 | Countdown | `'countdown'` | 開始ボタン押下後、ゲーム開始前 |
| プレイ中 | Playing | `'playing'` | ゲーム進行中 |
| 終了 | Finished | `'finished'` | タイマー終了後 |

## プレイヤー識別

| 識別方法 | Player 1 | Player 2 |
|---------|----------|----------|
| Caps Lock | OFF | ON |
| 入力文字 | 小文字 (a-z) | 大文字 (A-Z) |
| 画面位置 | 上 | 下 |
| ID | `1` | `2` |

## アーキテクチャ用語

| 日本語 | 英語 | 説明 |
|--------|------|------|
| プレゼンテーション層 | Presentation Layer | UIを担当する層（Reactコンポーネント） |
| アプリケーション層 | Application Layer | ユースケースを担当する層 |
| ドメイン層 | Domain Layer | ビジネスロジックを担当する層 |
| インフラストラクチャ層 | Infrastructure Layer | 外部接続を担当する層 |
| ユースケース | Use Case | アプリケーション固有のビジネスルール |
| エンティティ | Entity | ドメインの中核となるオブジェクト |
| リポジトリ | Repository | データ取得・保存のインターフェース |

## 略語一覧

| 略語 | 正式名称 | 説明 |
|------|---------|------|
| TDD | Test-Driven Development | テスト駆動開発 |
| MVP | Minimum Viable Product | 実用最小限の製品 |
