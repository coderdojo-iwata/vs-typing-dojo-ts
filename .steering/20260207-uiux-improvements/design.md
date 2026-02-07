# UI/UX 改善 - 設計書

## UX-001: カウントダウン表示

### 実装アプローチ

GameScreen のカウントダウン表示を `Countdown` コンポーネントに切り出す。
`useGame` でカウントダウン開始時に countdown state を管理し、1秒ごとに 3 → 2 → 1 と更新する。

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/components/Countdown.tsx` | 新規: カウントダウン表示コンポーネント |
| `src/presentation/hooks/useGame.ts` | カウントダウン state 管理を追加 |
| `src/presentation/components/GameScreen.tsx` | Countdown コンポーネント使用 |
| `src/index.css` | 縮小アニメーション用 CSS |

### カウントダウンの仕組み

```
useGame:
  startGame() → countdownValue = 3
  1秒後 → countdownValue = 2
  2秒後 → countdownValue = 1
  3秒後 → countdownValue = null, START_GAME
```

`countdownValue` を useGame の戻り値に追加し、GameScreen で Countdown に渡す。

### アニメーション

CSS `@keyframes` で大→小の縮小アニメーション:

```css
@keyframes countdown-shrink {
  0% { transform: scale(2); opacity: 1; }
  100% { transform: scale(0.5); opacity: 0.3; }
}
```

各数字表示時に `key` を変えて毎回アニメーションをリセットする。

---

## UX-002: 誤入力時の視覚フィードバック

### 実装アプローチ

gameReducer の INPUT アクション結果に validation 情報を含め、
GameScreen で各プレイヤーの直近の validation を保持する。
`incorrect` の場合に PlayerArea に flash フラグを渡す。

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/contexts/gameReducer.ts` | INPUT 結果に validation を付与 |
| `src/presentation/components/GameScreen.tsx` | flash state 管理 |
| `src/presentation/components/PlayerArea.tsx` | flash 表示対応 |

### flash の仕組み

```
INPUT アクション
  → gameReducer が validation を返す（新しい state 構造）
  → GameScreen で validation を検知
  → incorrect なら該当 PlayerArea に flash=true
  → 200ms 後に flash=false
```

Game エンティティに `lastValidation` フィールドを追加して reducer 経由で伝搬する。

```typescript
// Game に追加
readonly lastValidation?: {
  playerId: 1 | 2;
  result: ValidationResult;
};
```

---

## UX-003: 成績表示

### 実装アプローチ

Player エンティティに統計フィールドを追加し、InputUseCase で更新する。
ResultModal で集計して表示する。

### Player への追加フィールド

```typescript
export interface Player {
  // ... 既存フィールド
  readonly correctTypes: number;    // 正タイプ数
  readonly missTypes: number;       // ミスタイプ数
}
```

### 成績計算

| 項目 | 計算式 |
|------|--------|
| 成功率 | correctTypes / (correctTypes + missTypes) × 100 |
| KPM | correctTypes / 経過秒数 × 60 |
| 完了文数 | currentSentenceIndex |

KPM の経過秒数は `GAME_CONFIG.DURATION_SECONDS - game.remainingTime` で算出する。

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/domain/entities/Player.ts` | correctTypes, missTypes 追加 |
| `src/application/usecases/InputUseCase.ts` | 正タイプ・ミスタイプのカウント更新 |
| `src/presentation/components/ResultModal.tsx` | 成績表示 UI |

---

## UX-004: ノーミスボーナス

### 実装アプローチ

Player に `hasMissedCurrentSentence` フラグを追加する。
誤入力時に true にセット、文完了時に false かつボーナス加算、次の文でリセット。

### Player への追加フィールド

```typescript
export interface Player {
  // ... 既存フィールド
  readonly hasMissedCurrentSentence: boolean;
}
```

### InputUseCase の変更

```
incorrect → hasMissedCurrentSentence = true, missTypes + 1
correct (文完了) →
  if (!hasMissedCurrentSentence) → score + 10 (ボーナス)
  → nextSentence で hasMissedCurrentSentence = false にリセット
```

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/domain/entities/Player.ts` | hasMissedCurrentSentence 追加 |
| `src/application/usecases/InputUseCase.ts` | ミスフラグ更新 + ボーナス加算ロジック |
| `src/shared/gameConfig.ts` | NO_MISS_BONUS 定数追加 |

---

## 変更まとめ

### Domain 層

- `Player`: correctTypes, missTypes, hasMissedCurrentSentence 追加
- `Game`: lastValidation 追加

### Application 層

- `InputUseCase`: 正タイプ/ミスタイプカウント、ミスフラグ更新、ノーミスボーナス

### Presentation 層

- `Countdown.tsx`: 新規コンポーネント
- `useGame.ts`: カウントダウン state 追加
- `GameScreen.tsx`: Countdown 使用、flash state
- `PlayerArea.tsx`: flash 表示
- `ResultModal.tsx`: 成績表示

### Shared

- `gameConfig.ts`: NO_MISS_BONUS 追加
- `index.css`: カウントダウンアニメーション
