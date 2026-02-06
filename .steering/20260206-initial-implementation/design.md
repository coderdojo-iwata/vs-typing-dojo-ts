# 初回実装設計

## 実装アプローチ

TDDで進める。各層をボトムアップで実装し、テストを先に書いてからコードを実装する。

```
1. プロジェクトセットアップ
2. Domain層（テスト → 実装）
3. Application層（テスト → 実装）
4. Infrastructure層
5. Presentation層
6. 統合・動作確認
```

## プロジェクトセットアップ

### 作成するファイル

```
vs-typing-dojo-ts/
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── src/
│   └── main.tsx              # エントリポイント（空）
├── tests/                    # テストディレクトリ（空）
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .prettierrc
├── .eslintrc.cjs
└── .gitignore
```

### package.json の依存関係

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "jsdom": "^24.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "@typescript-eslint/eslint-plugin": "^7.x",
    "@typescript-eslint/parser": "^7.x"
  }
}
```

## Domain層の設計

### エンティティ

#### Sentence

```typescript
// src/domain/entities/Sentence.ts
interface RomajiChunk {
  char: string;           // ひらがな（例: "きょ"）
  inputPatterns: string[]; // 許容パターン（例: ["kyo", "kilyo", "kixyo"]）
}

interface Sentence {
  japanese: string;       // 日本語表示
  reading: string;        // ひらがな読み
  romaji: string;         // 表示用ローマ字
  chunks: RomajiChunk[];  // 入力判定用
}
```

#### Player

```typescript
// src/domain/entities/Player.ts
interface Player {
  id: 1 | 2;
  score: number;
  currentSentenceIndex: number;
  currentChunkIndex: number;
  currentInput: string;
}

// メソッド
// - addScore(points: number): void
// - nextChunk(): void
// - nextSentence(): void
// - resetInput(): void
```

#### Game

```typescript
// src/domain/entities/Game.ts
type GameState = 'idle' | 'countdown' | 'playing' | 'finished';

interface Game {
  state: GameState;
  player1: Player;
  player2: Player;
  remainingTime: number;
  sentences: Sentence[];
}

// メソッド
// - start(): void
// - tick(): void
// - finish(): void
// - getWinner(): Player | null
```

### ドメインサービス

#### RomajiConverter

```typescript
// src/domain/services/RomajiConverter.ts

// 責務: ひらがな読みからローマ字とチャンクを生成
// - convert(reading: string): { romaji: string; chunks: RomajiChunk[] }
```

#### InputValidator

```typescript
// src/domain/services/InputValidator.ts

// 責務: 入力の正誤判定
// - validate(input: string, chunk: RomajiChunk): ValidationResult
// - ValidationResult: 'correct' | 'partial' | 'invalid'
```

## Application層の設計

### GameUseCase

```typescript
// src/application/usecases/GameUseCase.ts

// 責務: ゲーム全体の進行管理
// - startGame(): void
// - tick(): void          // タイマー更新
// - endGame(): void
// - getGameState(): Game
```

### InputUseCase

```typescript
// src/application/usecases/InputUseCase.ts

// 責務: 入力処理
// - processInput(key: string): void
//   - 大文字/小文字でプレイヤー判定
//   - InputValidator で正誤判定
//   - Player の状態更新
```

## Infrastructure層の設計

### LocalSentenceRepository

```typescript
// src/infrastructure/repositories/LocalSentenceRepository.ts

// 責務: 出題データの取得
// - getSentences(): Promise<Sentence[]>
// - sentences.json からデータを読み込み
// - RomajiConverter でローマ字・チャンクを生成
```

### 出題データ

```typescript
// src/data/sentences.json
{
  "sentences": [
    { "japanese": "今日はいい天気です", "reading": "きょうはいいてんきです" },
    { "japanese": "タイピングは楽しい", "reading": "たいぴんぐはたのしい" },
    // ... 最低10文
  ]
}
```

## Presentation層の設計

### コンポーネント階層

```
App
├── TitleScreen
│   └── StartButton
└── GameScreen
    ├── Timer
    ├── PlayerArea (x2)
    │   ├── ScoreBoard
    │   └── SentenceDisplay
    └── ResultModal
        └── ActionButtons
```

### 状態管理

```typescript
// src/presentation/contexts/GameContext.tsx

// useReducer で状態管理
type GameAction =
  | { type: 'START_COUNTDOWN' }
  | { type: 'START_GAME' }
  | { type: 'TICK' }
  | { type: 'INPUT'; key: string }
  | { type: 'END_GAME' }
  | { type: 'RESET' };
```

### カスタムフック

```typescript
// src/presentation/hooks/useGame.ts
// - ゲーム状態へのアクセスとアクション

// src/presentation/hooks/useKeyboardInput.ts
// - キーボード入力の監視と振り分け
```

## テスト戦略

### Domain層（優先度: 高）

| 対象 | テスト内容 |
|------|-----------|
| RomajiConverter | ひらがな→ローマ字変換、拗音・促音の処理 |
| InputValidator | 正解・部分一致・不正解の判定 |
| Player | スコア加算、位置管理 |
| Game | 状態遷移、勝者判定 |

### Application層（優先度: 中）

| 対象 | テスト内容 |
|------|-----------|
| GameUseCase | ゲーム進行フロー |
| InputUseCase | 入力処理、プレイヤー振り分け |

### Presentation層（優先度: 低）

| 対象 | テスト内容 |
|------|-----------|
| 統合テスト | ゲーム開始→入力→終了の一連の流れ |

## 実装順序

TDDの流れに沿って、以下の順序で実装する。

### Phase 1: セットアップ
1. プロジェクト初期化（Vite + React + TypeScript）
2. Tailwind CSS 設定
3. ESLint / Prettier 設定
4. Vitest 設定
5. VSCode 設定

### Phase 2: Domain層
1. RomajiConverter（テスト → 実装）
2. InputValidator（テスト → 実装）
3. Sentence エンティティ
4. Player エンティティ（テスト → 実装）
5. Game エンティティ（テスト → 実装）

### Phase 3: Infrastructure層
1. sentences.json 作成
2. LocalSentenceRepository 実装

### Phase 4: Application層
1. GameUseCase（テスト → 実装）
2. InputUseCase（テスト → 実装）

### Phase 5: Presentation層
1. GameContext / useGame
2. useKeyboardInput
3. TitleScreen
4. GameScreen（PlayerArea, SentenceDisplay, Timer, ScoreBoard）
5. ResultModal

### Phase 6: 統合
1. 全体の結合
2. 動作確認
3. バグ修正
