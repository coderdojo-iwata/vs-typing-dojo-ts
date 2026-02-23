# タスクリスト：ゲーム時間選択機能

## タスク一覧

| # | タスク | ステータス |
|---|--------|-----------|
| 1 | `gameConfig.ts`: `DURATION_SECONDS` を 30 に変更、`GAME_DURATION_OPTIONS` と `GameDuration` 型を追加 | 完了 |
| 2 | `Game.ts`: `createGame` に `duration` 引数を追加 | 完了 |
| 3 | `StatsCalculator.ts`: `calcKpm` に `duration` 引数を追加し `GAME_CONFIG.DURATION_SECONDS` 依存を除去 | 完了 |
| 4 | `gameReducer.ts`: `INIT` アクションに `duration` フィールドを追加 | 完了 |
| 5 | `useGame.ts`: `startGame` に `duration` 引数を追加 | 完了 |
| 6 | `TitleScreen.tsx`: 時間選択 UI（セグメントボタン）を追加、`onStart` シグネチャ変更 | 完了 |
| 7 | `GameScreenWrapper.tsx`: `duration` prop を追加し `startGame` へ渡す | 完了 |
| 8 | `App.tsx`: `GameParams` に `duration` を追加、TitleScreen・GameScreenWrapper へ渡す | 完了 |
| 9 | `ResultModal.tsx`: `calcKpm` 呼び出しに `duration` 引数を追加 | 完了 |
| 10 | 型チェック・リントの確認 | 完了 |

## 完了条件

- [ ] タイトル画面で 10秒 / 30秒 / 60秒 が選択でき、デフォルトは 30秒
- [ ] 選択した時間でゲームがカウントダウンする
- [ ] リザルトの KPM が選択した時間を元に正しく計算される
- [ ] 「もう一度対戦」で同じ時間が引き継がれる
- [ ] `tsc --noEmit` および `eslint` がエラーなしで通過する
