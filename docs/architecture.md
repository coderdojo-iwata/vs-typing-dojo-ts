# 技術仕様書

## テクノロジースタック

### フロントエンド

| カテゴリ | 技術 | バージョン | 理由 |
|---------|------|-----------|------|
| 言語 | TypeScript | 5.x | 型安全性、開発体験向上 |
| UIライブラリ | React | 18.x | コンポーネント指向、エコシステムの充実 |
| ビルドツール | Vite | 5.x | 高速な開発サーバー、シンプルな設定 |
| スタイリング | Tailwind CSS | 3.x | ユーティリティクラス、軽量、カスタマイズ自由 |

### テスト

| カテゴリ | 技術 | 理由 |
|---------|------|------|
| テストフレームワーク | Vitest | Viteとの統合、Jest互換API |
| コンポーネントテスト | React Testing Library | ユーザー視点でReactコンポーネントをテスト |

### 開発ツール

| カテゴリ | 技術 | 理由 |
|---------|------|------|
| リンター | ESLint | コード品質の維持 |
| フォーマッター | Prettier | コードスタイルの統一 |
| パッケージマネージャ | npm | 標準的、追加設定不要 |

## アーキテクチャ

### クリーンアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  React Components, Hooks, CSS Modules                       │
│  - 画面表示、ユーザー入力の受付                              │
│  - Application Layer への委譲                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  Use Cases                                                  │
│  - ゲーム進行の制御                                          │
│  - Domain Layer のオーケストレーション                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│  Entities, Domain Services                                  │
│  - ビジネスロジック（スコア計算、入力判定など）               │
│  - 外部依存なし                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  Repositories, External Services                            │
│  - データの永続化・取得                                      │
│  - 外部APIとの通信（将来）                                   │
└─────────────────────────────────────────────────────────────┘
```

### 依存関係のルール

- 上位層は下位層に依存できる
- 下位層は上位層に依存してはならない
- Domain Layer は外部ライブラリに依存しない（純粋なTypeScript）

```
Presentation → Application → Domain ← Infrastructure
                               ↑
                    （依存性逆転の原則）
```

## 状態管理

### React Hooks + Context

シンプルなアプリケーションのため、外部の状態管理ライブラリ（Redux等）は使用しない。

```typescript
// GameContext で全体の状態を管理
interface GameContextValue {
  game: Game;
  dispatch: (action: GameAction) => void;
}

// useReducer で状態遷移を管理
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'TICK' }
  | { type: 'INPUT'; player: 1 | 2; key: string }
  | { type: 'END_GAME' };
```

## 開発手法

### TDD（テスト駆動開発）

```
1. Red:   失敗するテストを書く
2. Green: テストを通す最小限のコードを書く
3. Refactor: コードを改善する
```

#### テスト対象と優先度

| 対象 | 優先度 | 理由 |
|------|--------|------|
| Domain Layer | 高 | ビジネスロジックの正確性が重要 |
| Application Layer | 中 | ユースケースの動作確認 |
| Presentation Layer | 低 | UIは変更が多い、統合テストで補完 |

#### テストの種類

| 種類 | ツール | 対象 |
|------|--------|------|
| 単体テスト | Vitest | Domain層, Application層 |
| 統合テスト | Vitest + React Testing Library | コンポーネント連携 |

### コード品質

```bash
# リント
npm run lint

# フォーマット
npm run format

# 型チェック
npm run typecheck

# テスト
npm run test
```

## パフォーマンス要件

| 項目 | 目標値 | 計測方法 |
|------|--------|---------|
| キー入力から画面反映 | 50ms以内 | Performance API |
| 初期表示 | 2秒以内 | Lighthouse |
| バンドルサイズ | 500KB以内 | Vite build |

### 最適化戦略

- React.memo によるコンポーネントの再レンダリング抑制
- useCallback / useMemo による関数・値のメモ化
- コード分割は MVP では不要（小規模のため）

## ブラウザ対応

| ブラウザ | バージョン |
|---------|-----------|
| Chrome | 最新2バージョン |
| Firefox | 最新2バージョン |
| Safari | 最新2バージョン |
| Edge | 最新2バージョン |

## セキュリティ

### XSS対策

- React のエスケープ機能を利用
- dangerouslySetInnerHTML は使用しない

### 入力バリデーション

- キー入力は英字（a-z, A-Z）のみ許可
- 不正な入力は無視

## 将来の拡張性

### API連携の準備

```typescript
// Repository インターフェースを定義
interface SentenceRepository {
  getSentences(): Promise<Sentence[]>;
}

// MVP: ローカルJSONから取得
class LocalSentenceRepository implements SentenceRepository {
  async getSentences(): Promise<Sentence[]> {
    return sentences; // import from JSON
  }
}

// 将来: APIから取得
class ApiSentenceRepository implements SentenceRepository {
  async getSentences(): Promise<Sentence[]> {
    const response = await fetch('/api/sentences');
    return response.json();
  }
}
```

### 設定の外部化

将来的に設定画面を追加する場合に備え、定数を一箇所にまとめる。

```typescript
// src/shared/constants.ts
export const GAME_CONFIG = {
  DEFAULT_TIME_LIMIT: 30,
  COUNTDOWN_SECONDS: 3,
} as const;
```
