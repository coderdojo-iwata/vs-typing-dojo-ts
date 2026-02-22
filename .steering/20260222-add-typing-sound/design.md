# 設計: キー入力サウンドエフェクトの追加

## サウンド仕様

| イベント | 音の種類 | 周波数 | 波形 | 長さ |
|---|---|---|---|---|
| 正しい入力（部分一致・チャンク完成） | 短いビープ音 | 660Hz | sine | 0.06s |
| 課題文完成（ミスあり） | 上昇2音 | 660Hz → 880Hz | sine | 0.1s × 2 |
| 課題文完成（ノーミス） | 上昇3音ファンファーレ | 660Hz → 880Hz → 1100Hz | sine | 0.1s × 3 |
| 不正解 | 下降ブザー音 | 220Hz → 110Hz | sawtooth | 0.15s |

## 実装アプローチ

`game.lastValidation` を拡張し、課題文完成・ノーミス情報を付加する。
新規フック `useSoundEffect` が `lastValidation` を監視して音を鳴らす。

## 変更するファイル

### 1. `src/domain/entities/Game.ts` — `LastValidation` の拡張

`sentenceCompleted` と `noMiss` フィールドを追加する。

```ts
export interface LastValidation {
  playerId: 1 | 2;
  result: ValidationResult;
  sentenceCompleted?: boolean;
  noMiss?: boolean;
}
```

### 2. `src/application/usecases/InputUseCase.ts` — 課題文完成時に情報を付加

`updateGameWithPlayer` に `extra` パラメータを追加し、
課題文の最終チャンクを正解した時点で `sentenceCompleted` と `noMiss` をセットする。

```ts
// 課題文完成時
return {
  game: updateGameWithPlayer(game, playerId, updatedPlayer, validation, {
    sentenceCompleted: true,
    noMiss: !scored.hasMissedCurrentSentence,
  }),
  validation,
};
```

### 3. `src/presentation/hooks/useSoundEnabled.ts` — 新規作成

サウンド ON/OFF 設定を管理するフック。`localStorage` で永続化する。

```ts
useSoundEnabled(): { soundEnabled: boolean; toggleSound: () => void }
```

### 4. `src/presentation/hooks/useSoundEffect.ts` — 新規作成

`lastValidation` と `soundEnabled` を受け取り、Web Audio API で音を生成・再生するフック。

```ts
useSoundEffect(lastValidation: LastValidation | undefined, soundEnabled: boolean): void
```

**音の優先判定順序:**
1. `sentenceCompleted && noMiss` → ノーミス完成音（3音ファンファーレ）
2. `sentenceCompleted && !noMiss` → 文章完成音（2音上昇）
3. `result === 'correct' || result === 'partial'` → 正解音（短いビープ）
4. `result === 'incorrect'` → 不正解音（下降ブザー）

**AudioContext の管理:**
- `useRef` で `AudioContext` を保持
- 初回呼び出し時に生成（ブラウザの自動再生ポリシー対応）
- `suspended` 状態なら `resume()` してから再生
- アンマウント時に `close()`

### 5. `src/App.tsx` — サウンド設定の状態管理

`useSoundEnabled` を呼び出し、`soundEnabled` と `toggleSound` を子コンポーネントへ渡す。

### 6. `src/presentation/components/TitleScreen.tsx` — サウンドトグルUIの追加

`soundEnabled` と `onToggleSound` を props で受け取り、出題ソース選択の下にトグルを表示する。

```
[ サウンド  ON ] ← トグルボタン
```

### 7. `src/presentation/components/GameScreenWrapper.tsx` — props の中継

`soundEnabled` を受け取り `GameScreen` へ渡す。

### 8. `src/presentation/components/GameScreen.tsx` — フック呼び出しを更新

```ts
useSoundEffect(game.lastValidation, soundEnabled);
```

## 状態の流れ

```
App（useSoundEnabled）
  ├── TitleScreen（soundEnabled, onToggleSound）← トグルUI表示
  └── GameScreenWrapper（soundEnabled）
        └── GameScreen（soundEnabled）
              └── useSoundEffect（lastValidation, soundEnabled）
```

## 影響範囲

| ファイル | 変更種別 |
|---|---|
| `src/domain/entities/Game.ts` | 既存型の拡張（後方互換あり）※実装済み |
| `src/application/usecases/InputUseCase.ts` | 既存関数の引数追加 ※実装済み |
| `src/presentation/hooks/useSoundEnabled.ts` | 新規作成 |
| `src/presentation/hooks/useSoundEffect.ts` | `soundEnabled` 引数を追加 |
| `src/App.tsx` | `useSoundEnabled` の呼び出し・props 追加 |
| `src/presentation/components/TitleScreen.tsx` | トグルUI・props 追加 |
| `src/presentation/components/GameScreenWrapper.tsx` | `soundEnabled` props の中継 |
| `src/presentation/components/GameScreen.tsx` | `soundEnabled` props の受け取り |

## 注意事項

- `LastValidation` の新フィールドはオプショナルなため、既存テストへの影響は最小限
- `AudioContext` はユーザー操作（キー入力）後に初期化されるため、自動再生ブロックは発生しない
