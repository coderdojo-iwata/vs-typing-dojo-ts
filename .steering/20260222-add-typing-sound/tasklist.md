# タスクリスト: キー入力サウンドエフェクトの追加

## タスク一覧

### T1. `LastValidation` の拡張
- **ファイル:** `src/domain/entities/Game.ts`
- **内容:** `LastValidation` インターフェースに `sentenceCompleted?: boolean` と `noMiss?: boolean` を追加
- **ステータス:** [x] 完了

### T2. `InputUseCase` の更新
- **ファイル:** `src/application/usecases/InputUseCase.ts`
- **内容:** 課題文の最終チャンク正解時に `sentenceCompleted: true` と `noMiss` をセットして `lastValidation` に反映
- **依存:** T1
- **ステータス:** [x] 完了

### T3. `useSoundEffect` フックの新規作成
- **ファイル:** `src/presentation/hooks/useSoundEffect.ts`
- **内容:** `lastValidation` を受け取り、4種類の音を Web Audio API で生成・再生するフックを実装
- **依存:** T1
- **ステータス:** [x] 完了

### T4. `GameScreen` にフック呼び出しを追加
- **ファイル:** `src/presentation/components/GameScreen.tsx`
- **内容:** `useSoundEffect(game.lastValidation)` を呼び出す1行を追加
- **依存:** T3
- **ステータス:** [x] 完了

### T5. `useSoundEnabled` フックの新規作成
- **ファイル:** `src/presentation/hooks/useSoundEnabled.ts`
- **内容:** サウンド ON/OFF 状態を管理し `localStorage` で永続化するフックを実装
- **ステータス:** [x] 完了

### T6. `useSoundEffect` に `soundEnabled` 引数を追加
- **ファイル:** `src/presentation/hooks/useSoundEffect.ts`
- **内容:** `soundEnabled` が `false` のとき音の再生をスキップする
- **依存:** T5
- **ステータス:** [x] 完了

### T7. `App.tsx` にサウンド設定の状態管理を追加
- **ファイル:** `src/App.tsx`
- **内容:** `useSoundEnabled` を呼び出し、`soundEnabled` と `toggleSound` を子コンポーネントへ渡す
- **依存:** T5
- **ステータス:** [x] 完了

### T8. `TitleScreen` にサウンドトグル UI を追加
- **ファイル:** `src/presentation/components/TitleScreen.tsx`
- **内容:** `soundEnabled` と `onToggleSound` を props で受け取り、トグルボタンを表示する
- **依存:** T7
- **ステータス:** [x] 完了

### T9. `GameScreenWrapper` に `soundEnabled` props を中継
- **ファイル:** `src/presentation/components/GameScreenWrapper.tsx`
- **内容:** `soundEnabled` を受け取り `GameScreen` へ渡す
- **依存:** T7
- **ステータス:** [x] 完了

### T10. `GameScreen` に `soundEnabled` props を追加
- **ファイル:** `src/presentation/components/GameScreen.tsx`
- **内容:** `soundEnabled` を受け取り `useSoundEffect` へ渡す
- **依存:** T9
- **ステータス:** [x] 完了

### T11. 動作確認
- **内容:**
  - タイトル画面でサウンドトグルが表示される
  - ON/OFF が切り替わり、ゲーム中の音に反映される
  - ページリロード後も設定が保持される
  - 正しいキー入力・文章完成・ノーミス完成・不正解の各音が鳴る
- **依存:** T10
- **ステータス:** [x] 完了

### T12. リント・型チェック
- **内容:** `npm run lint` と `npm run typecheck` を実行してエラーがないことを確認
- **依存:** T10
- **ステータス:** [x] 完了
