# 設計書：ゲーム時間選択機能

## 実装アプローチ

`App.tsx` が管理する `GameParams`（現在は `source`, `apiKey`）に `duration` を追加し、
既存の prop チェーンと同じ方法で `TitleScreen → App → GameScreenWrapper → useGame` へ伝播させる。

## 変更するファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/shared/gameConfig.ts` | `DURATION_SECONDS` を 30 に変更、`GAME_DURATION_OPTIONS` 定数を追加 |
| `src/domain/entities/Game.ts` | `createGame(sentences, duration)` に引数追加 |
| `src/domain/services/StatsCalculator.ts` | `calcKpm` の引数に `duration` を追加し、ハードコードを排除 |
| `src/presentation/contexts/gameReducer.ts` | `INIT` アクションに `duration` フィールドを追加 |
| `src/presentation/hooks/useGame.ts` | `startGame(source, duration, apiKey?)` に引数追加 |
| `src/presentation/components/TitleScreen.tsx` | 時間選択 UI を追加、`onStart` シグネチャ変更 |
| `src/presentation/components/GameScreenWrapper.tsx` | `duration` prop を受け取り `startGame` へ渡す |
| `src/App.tsx` | `GameParams` に `duration` を追加、TitleScreen・GameScreenWrapper へ渡す |

## 各ファイルの変更詳細

### 1. `gameConfig.ts`

```ts
export const GAME_DURATION_OPTIONS = [10, 30, 60] as const;
export type GameDuration = (typeof GAME_DURATION_OPTIONS)[number]; // 10 | 30 | 60

export const GAME_CONFIG = {
  DURATION_SECONDS: 30,   // 60 → 30 に変更（デフォルト値）
  ...
} as const;
```

### 2. `Game.ts`

```ts
export function createGame(sentences: Sentence[], duration: number): Game {
  return {
    ...
    remainingTime: duration,   // GAME_CONFIG.DURATION_SECONDS → duration
  };
}
```

### 3. `StatsCalculator.ts`

```ts
// duration を引数として受け取る（GAME_CONFIG.DURATION_SECONDS への依存を除去）
export function calcKpm(player: Player, remainingTime: number, duration: number): number {
  const elapsed = duration - remainingTime;
  ...
}
```

### 4. `gameReducer.ts`

```ts
// INIT アクションに duration を追加
| { type: 'INIT'; sentences: Sentence[]; duration: number }

// createGame 呼び出し時に duration を渡す
case 'INIT':
  return createGame(action.sentences, action.duration);
```

### 5. `useGame.ts`

```ts
// startGame に duration を追加
const startGame = useCallback(
  async (source: SentenceSource = 'local', duration: number, apiKey?: string) => {
    const sentences = await initializeGame(source, apiKey);
    dispatch({ type: 'INIT', sentences, duration });
    startCountdownSequence();
  },
  [...]
);
```

### 6. `TitleScreen.tsx`

- `onStart` のシグネチャ変更: `(source, duration, apiKey?) => void`
- コンポーネント内に `duration` state を追加（デフォルト: `30`）
- 出題ソース選択の下に時間選択セクションを追加

**UI イメージ（セグメントボタン）:**

```
ゲーム時間
[  10秒  ] [■ 30秒 ■] [  60秒  ]
```

既存の `w-80 space-y-6` レイアウトに `space-y-2` セクションとして追加する。

### 7. `GameScreenWrapper.tsx`

```ts
interface GameScreenWrapperProps {
  ...
  duration: number;   // 追加
}

// startGame 呼び出し時に duration を渡す
useEffect(() => {
  startGame(source, duration, apiKey);
}, []);
```

### 8. `App.tsx`

```ts
interface GameParams {
  source: SentenceSource;
  apiKey?: string;
  duration: number;   // 追加
}

// 初期値: duration: 30
const [gameParams, setGameParams] = useState<GameParams>({ source: 'local', duration: 30 });

// handleStart のシグネチャ変更
const handleStart = useCallback(
  (source: SentenceSource, duration: number, apiKey?: string) => {
    setGameParams({ source, apiKey, duration });
    setScreen('game');
  }, []
);
```

## 影響範囲の分析

### 影響あり
- `calcKpm` を呼び出している箇所（`ResultModal.tsx` など）は引数に `game.remainingTime` の初期値（= duration）を追加で渡す必要がある

### 影響なし
- `tickGame`, `finish`, `getWinner` などのゲームロジック（時間のデクリメント方法は変わらない）
- `Countdown.tsx`, `Timer.tsx`（表示のみ、値の算出には関与しない）
- `useKeyboardInput.ts`, `InputUseCase.ts`（入力処理は時間に依存しない）
- サウンド関連（`useSoundEffect.ts`, `useSoundEnabled.ts`）

## データの流れ

```
TitleScreen
  └─ duration を state で保持
  └─ onStart(source, duration, apiKey?) を呼び出す
        ↓
App.tsx
  └─ GameParams.duration に保存
  └─ GameScreenWrapper へ duration prop として渡す
        ↓
GameScreenWrapper
  └─ startGame(source, duration, apiKey?) を呼び出す
        ↓
useGame.ts
  └─ dispatch({ type: 'INIT', sentences, duration })
        ↓
gameReducer.ts
  └─ createGame(sentences, duration)
        ↓
Game.ts
  └─ remainingTime: duration でゲーム生成
```

## 型定義の追加

`src/shared/gameConfig.ts` に `GameDuration` 型を定義し、props/state で使用する。
ただし `duration: number` として扱う箇所も多いため、過度な型付けは避ける。
