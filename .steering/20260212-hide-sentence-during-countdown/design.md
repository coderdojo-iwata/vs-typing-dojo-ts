# 設計: カウントダウン中の課題文非表示

## 実装アプローチ

GameScreenコンポーネントで、ゲームの状態（`game.state`）を`PlayerArea`にpropsとして渡し、カウントダウン中は`SentenceDisplay`を非表示にする。

### 方針

`PlayerArea`に`isPlaying`プロパティを追加し、`false`の場合は`SentenceDisplay`の代わりにプレースホルダー（同じサイズの空ボックス）を表示する。これにより：

- カウントダウン中にレイアウトが崩れない（高さが維持される）
- カウントダウン終了後にスムーズに課題文が表示される
- 既存のコンポーネントへの影響を最小限に抑えられる

## 変更するコンポーネント

### 1. `PlayerArea.tsx`

- `isPlaying` propを追加
- `isPlaying === false`のとき、`SentenceDisplay`の代わりにプレースホルダーを表示

```tsx
interface PlayerAreaProps {
  player: Player;
  sentences: Sentence[];
  label: string;
  flash?: boolean;
  isPlaying: boolean;  // 追加
}
```

### 2. `GameScreen.tsx`

- `PlayerArea`に`isPlaying={game.state === 'playing'}`を渡す

## 影響範囲の分析

- **影響あり**: `GameScreen.tsx`, `PlayerArea.tsx`
- **影響なし**: `SentenceDisplay.tsx`, `Countdown.tsx`, `useGame.ts`, `gameReducer.ts`, ドメイン層全体

## 代替案の検討

| 案 | メリット | デメリット |
|---|---|---|
| A. PlayerAreaにisPlayingを渡す（採用） | 最小変更、レイアウト維持 | PlayerAreaのpropsが増える |
| B. Countdownのオーバーレイを不透明にする | 変更1箇所のみ | カウントダウンのデザインが変わる |
| C. GameScreenでPlayerArea自体を条件分岐 | シンプル | カウントダウン中にスコアボードも消える |

案Aを採用する理由：課題文のみを非表示にし、スコアボードやプレイヤーラベルは維持したまま、レイアウトシフトも防げるため。
