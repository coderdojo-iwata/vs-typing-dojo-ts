# 開発ガイドライン

## コーディング規約

### コメント

コメントは「コードを読めばわかること」には書かない。コードから読み取れない意図を説明する場合のみ使用する。

```typescript
const score = 0;
const isGameOver = state === 'finished';

// RFC 7231 Section 6.5.4 に従いレート制限時は 429 を返す
if (rateLimited) {
  return 429;
}
```

### TypeScript

#### 型定義

```typescript
const score: number = 0;
const playerName: string = 'Player 1';

const items = ['a', 'b', 'c'];

function processInput(input: unknown): string {
  if (typeof input === 'string') {
    return input;
  }
  throw new Error('Invalid input');
}
```

#### 関数

```typescript
// アロー関数を基本とする
const calculateScore = (correctChars: number): number => {
  return correctChars * 10;
};

// 早期リターンを推奨
const validateInput = (key: string): boolean => {
  if (key.length !== 1) return false;
  if (!/[a-zA-Z]/.test(key)) return false;
  return true;
};
```

#### エクスポート

```typescript
// 名前付きエクスポートを基本とする
export const GameUseCase = { ... };
export type GameState = 'idle' | 'playing' | 'finished';

// default export は避ける（リファクタリング時に追跡しづらい）
```

### React

#### コンポーネント

```typescript
// 関数コンポーネント + アロー関数
type Props = {
  score: number;
  playerName: string;
};

export const ScoreBoard = ({ score, playerName }: Props) => {
  return (
    <div className="p-4">
      <span>{playerName}</span>
      <span>{score}</span>
    </div>
  );
};
```

#### フック

```typescript
// カスタムフックは use 接頭辞
export const useGame = () => {
  const [state, setState] = useState<GameState>('idle');
  // ...
  return { state, startGame, endGame };
};
```

#### イベントハンドラ

```typescript
// handle 接頭辞
const handleStartClick = () => {
  startGame();
};

const handleKeyDown = (event: KeyboardEvent) => {
  processInput(event.key);
};
```

## 命名規則

| 種類                       | 規則                           | 例                               |
| -------------------------- | ------------------------------ | -------------------------------- |
| 変数・関数                 | camelCase                      | `currentScore`, `calculateScore` |
| 定数                       | UPPER_SNAKE_CASE               | `DEFAULT_TIME_LIMIT`             |
| 型・インターフェース       | PascalCase                     | `GameState`, `Player`            |
| コンポーネント             | PascalCase                     | `GameScreen`, `PlayerArea`       |
| ファイル（コンポーネント） | PascalCase                     | `GameScreen.tsx`                 |
| ファイル（その他）         | camelCase                      | `constants.ts`, `useGame.ts`     |
| CSSクラス                  | Tailwindのユーティリティクラス | `bg-blue-500`                    |

### 意味のある命名

```typescript
// 良い例
const remainingTimeInSeconds = 30;
const isGameOver = state === 'finished';
const handlePlayerInput = (key: string) => { ... };

// 悪い例
const t = 30;           // 何の時間？
const flag = true;      // 何のフラグ？
const doSomething = () => { ... };  // 何をする？
```

## スタイリング規約（Tailwind CSS）

### 基本方針

```tsx
// クラス名は直接記述
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  対戦開始
</button>
```

### クラスの順序

1. レイアウト（`flex`, `grid`, `block`）
2. サイズ（`w-`, `h-`, `p-`, `m-`）
3. 背景・境界（`bg-`, `border-`, `rounded`）
4. テキスト（`text-`, `font-`）
5. 状態（`hover:`, `focus:`, `active:`）

```tsx
// 順序の例
<div className="flex items-center justify-center w-full h-screen bg-gray-100 text-gray-800 hover:bg-gray-200">
```

### 共通スタイルの抽出

繰り返し使うスタイルは定数化する。

```typescript
// src/shared/styles.ts
export const buttonStyles = {
  primary:
    'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
  secondary:
    'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded',
};
```

## テスト規約

### TDD（テスト駆動開発）

```
1. Red:   失敗するテストを書く
2. Green: テストを通す最小限のコードを書く
3. Refactor: コードを改善する（テストは通ったまま）
```

### TDD運用フロー

```
┌─────────────────────────────────────────────────────────────┐
│  1. テスト設計                                              │
│     - 実装する機能の仕様を確認                              │
│     - テストケースを洗い出す                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. テストコード作成                                        │
│     - 失敗するテストを書く（Red）                           │
│     - テストが仕様を正しく表現しているか確認                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. テストレビュー依頼 ★人間によるレビュー★                │
│     - テストコードをコミット                                │
│     - レビュー観点:                                         │
│       ・テストケースに漏れがないか                          │
│       ・境界値、異常系が網羅されているか                    │
│       ・テスト名が仕様を正しく表現しているか                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. レビュー承認後、実装開始                                │
│     - テストを通す最小限のコードを書く（Green）             │
│     - リファクタリング（Refactor）                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. 実装完了                                                │
│     - 全テストが通ることを確認                              │
│     - コミット & 次の機能へ                                 │
└─────────────────────────────────────────────────────────────┘
```

### テストレビュー依頼のタイミング

| 状況                   | レビュー依頼   |
| ---------------------- | -------------- |
| 新機能のテスト作成時   | 必須           |
| 既存テストの修正時     | 変更内容による |
| バグ修正のテスト追加時 | 推奨           |

### レビュー依頼時のチェックリスト

- [ ] テストが失敗することを確認済み（Red状態）
- [ ] テスト名が「何をテストするか」を明確に表現している
- [ ] 正常系のテストケースがある
- [ ] 異常系・境界値のテストケースがある
- [ ] テストコードが読みやすい（Arrange-Act-Assert）

### テストファイルの配置

```
tests/
├── domain/
│   ├── entities/
│   │   └── Player.test.ts
│   └── services/
│       └── RomajiConverter.test.ts
└── application/
    └── usecases/
        └── GameUseCase.test.ts
```

### テストの書き方

```typescript
import { describe, it, expect } from 'vitest';
import { Player } from '@domain/entities/Player';

describe('Player', () => {
  describe('addScore', () => {
    it('スコアが加算される', () => {
      // Arrange（準備）
      const player = new Player(1);

      // Act（実行）
      player.addScore(10);

      // Assert（検証）
      expect(player.score).toBe(10);
    });

    it('複数回加算できる', () => {
      const player = new Player(1);

      player.addScore(10);
      player.addScore(5);

      expect(player.score).toBe(15);
    });
  });
});
```

### テストの構造

describe は2階層まで（ファイル、メソッド）。3階層以上にネストしない。

```typescript
describe('RomajiConverter', () => {
  describe('convert', () => {
    it('ひらがなをローマ字に変換する', () => { ... });
    it('拗音を正しく変換する', () => { ... });
    it('促音を正しく変換する', () => { ... });
  });
});
```

### テストの命名

日本語で「何をテストするか」を明確に記述する。

### パラメータライズドテスト

同じロジックを複数の入力値でテストする場合は、`it.each` を使用する。

```typescript
import { describe, it, expect } from 'vitest';
import { RomajiConverter } from '@domain/services/RomajiConverter';

describe('RomajiConverter', () => {
  describe('convert', () => {
    // 基本的なひらがな変換
    it.each([
      ['あ', 'a'],
      ['い', 'i'],
      ['う', 'u'],
      ['え', 'e'],
      ['お', 'o'],
      ['か', 'ka'],
      ['き', 'ki'],
    ])('"%s" を "%s" に変換する', (input, expected) => {
      const result = RomajiConverter.convert(input);
      expect(result.romaji).toBe(expected);
    });

    // 拗音の変換
    it.each([
      ['きょ', ['kyo', 'kilyo', 'kixyo']],
      ['しゃ', ['sya', 'sha']],
      ['ちゅ', ['tyu', 'chu']],
    ])('拗音 "%s" の許容パターンが %s である', (input, expectedPatterns) => {
      const result = RomajiConverter.convert(input);
      expect(result.inputPatterns).toEqual(
        expect.arrayContaining(expectedPatterns)
      );
    });

    // 促音の変換
    it.each([
      ['っか', ['kka', 'ltuka', 'ltsuka', 'xtuka', 'xtsuka']],
      ['っと', ['tto', 'ltuto', 'ltsuto', 'xtuto', 'xtsuto']],
    ])('促音 "%s" の許容パターンが %s を含む', (input, expectedPatterns) => {
      const result = RomajiConverter.convert(input);
      expect(result.inputPatterns).toEqual(
        expect.arrayContaining(expectedPatterns)
      );
    });
  });
});
```

#### パラメータライズドテストを使うべき場面

| 場面                       | 例                             |
| -------------------------- | ------------------------------ |
| 入出力のパターンが多い     | ローマ字変換、バリデーション   |
| 境界値テスト               | 0, 1, 最大値, 最大値+1         |
| 複数の入力で同じ結果になる | 「し」→ si, shi, ci すべて正解 |

#### 使わない方がよい場面

| 場面                     | 理由                             |
| ------------------------ | -------------------------------- |
| テストごとに準備が異なる | 可読性が下がる                   |
| 失敗時の原因特定が難しい | 個別テストの方がデバッグしやすい |

### カバレッジ目標

| 層           | 目標             |
| ------------ | ---------------- |
| Domain       | 90%以上          |
| Application  | 80%以上          |
| Presentation | 統合テストで補完 |

## Git規約

### ブランチ命名

```
main                    # 本番リリース
feature/xxx             # 機能追加
fix/xxx                 # バグ修正
refactor/xxx            # リファクタリング
```

### コミットメッセージ

```
<type>: <subject>

<body>（任意）
```

#### type の種類

| type     | 説明                             |
| -------- | -------------------------------- |
| feat     | 新機能                           |
| fix      | バグ修正                         |
| refactor | リファクタリング                 |
| test     | テスト追加・修正                 |
| docs     | ドキュメント                     |
| style    | コードスタイル（動作に影響なし） |
| chore    | ビルド、設定など                 |

#### 例

```
feat: プレイヤーのスコア計算機能を追加

- Player エンティティに addScore メソッドを追加
- スコアは正しく入力した文字数 × 10
```

### コミットの粒度

- 1つのコミットは1つの論理的な変更
- TDDのサイクルごとにコミットしても良い
- 動作する状態でコミット（ビルドが通る状態）

## コード品質チェック

### 開発時のコマンド

```bash
# 開発サーバー起動
npm run dev

# リント
npm run lint

# リント（自動修正）
npm run lint:fix

# フォーマット
npm run format

# 型チェック
npm run typecheck

# テスト
npm run test

# テスト（ウォッチモード）
npm run test:watch

# 全チェック（CI用）
npm run check
```

### コミット前のチェックリスト

- [ ] `npm run lint` がエラーなし
- [ ] `npm run typecheck` がエラーなし
- [ ] `npm run test` が全て通る
- [ ] 新機能にはテストがある
