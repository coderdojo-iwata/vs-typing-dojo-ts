# ChatGPT API 出題文生成 - 設計書

## 実装アプローチ

既存の `SentenceRepository` インターフェースを活用し、`ApiSentenceRepository` を新規追加する。
タイトル画面で出題ソースを選択し、選択に応じたリポジトリを `useGame` に渡す。

## 変更するコンポーネント

### 新規作成

| ファイル | 層 | 役割 |
|---------|---|------|
| `src/infrastructure/repositories/ApiSentenceRepository.ts` | Infrastructure | OpenAI API を呼び出し出題文を取得 |
| `src/infrastructure/api/openaiClient.ts` | Infrastructure | OpenAI API 通信の共通処理 |
| `src/presentation/hooks/useApiKey.ts` | Presentation | API キーの localStorage 管理 |
| `src/presentation/components/ApiKeyInput.tsx` | Presentation | API キー入力 UI |
| `tests/infrastructure/repositories/ApiSentenceRepository.test.ts` | Test | ApiSentenceRepository のテスト |

### 変更

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/components/TitleScreen.tsx` | 出題ソース選択 UI と API キー設定 UI を追加 |
| `src/presentation/hooks/useGame.ts` | 出題ソースに応じたリポジトリ切り替え |
| `src/presentation/components/GameScreenWrapper.tsx` | 出題ソース情報の受け渡し |
| `src/App.tsx` | 出題ソース state の管理・受け渡し |

## データフロー

```
TitleScreen                    App                      useGame
┌──────────────────┐    ┌──────────────┐    ┌──────────────────────┐
│ ソース選択       │───►│ sentenceSource│───►│ source に応じて      │
│  ○ ローカル      │    │ state 管理   │    │ Repository を切替    │
│  ○ ChatGPT API  │    └──────────────┘    │                      │
│                  │                        │ 'local' → Local...   │
│ API キー入力     │                        │ 'api'   → Api...     │
│ [sk-xxxxx]      │                        └──────────────────────┘
└──────────────────┘                                 │
                                                     ▼
                                          ┌──────────────────────┐
                                          │ getSentences()       │
                                          │ → Sentence[]         │
                                          │ → shuffle()          │
                                          │ → dispatch(INIT)     │
                                          └──────────────────────┘
```

## ApiSentenceRepository 設計

### OpenAI API 呼び出し

```typescript
// src/infrastructure/api/openaiClient.ts
interface ChatCompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
}

export async function callChatCompletion(
  apiKey: string,
  request: ChatCompletionRequest
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### プロンプト設計

```
タイピング練習用の日本語の短文を10個生成してください。

条件:
- 各文は10〜25文字程度
- 日常的で自然な日本語
- ひらがな読みが正確に対応する文（漢字にはふりがなが一意に決まるものを使用）
- 固有名詞は避ける
- 以下の JSON 形式で出力:

[
  { "japanese": "今日はいい天気です", "reading": "きょうはいいてんきです" },
  ...
]

JSON のみを出力し、それ以外のテキストは含めないでください。
```

### レスポンスパース

```typescript
// src/infrastructure/repositories/ApiSentenceRepository.ts
export function createApiSentenceRepository(apiKey: string): SentenceRepository {
  return {
    async getSentences(): Promise<Sentence[]> {
      const content = await callChatCompletion(apiKey, { ... });
      const rawSentences: RawSentence[] = JSON.parse(content);
      return rawSentences.map((raw) => {
        const { romaji, chunks } = RomajiConverter.convert(raw.reading);
        return { japanese: raw.japanese, reading: raw.reading, romaji, chunks };
      });
    },
  };
}
```

## 出題ソース型定義

```typescript
// src/shared/types.ts に追加
export type SentenceSource = 'local' | 'api';
```

## API キー管理

```typescript
// src/presentation/hooks/useApiKey.ts
const STORAGE_KEY = 'vs-typing-dojo-openai-api-key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '');

  const saveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
  };

  return { apiKey, saveApiKey, clearApiKey, hasApiKey: apiKey !== '' };
}
```

## UI 変更

### TitleScreen レイアウト

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               タイピング道場                         │
│                                                     │
│         ┌─────────────────────────────┐             │
│         │ 出題ソース                   │             │
│         │  (○) ローカル                │             │
│         │  ( ) ChatGPT API             │             │
│         └─────────────────────────────┘             │
│                                                     │
│         ┌─────────────────────────────┐             │
│         │ API キー                     │             │
│         │ [sk-xxxxxxxx...    ] [👁]    │             │
│         │ [保存]  [クリア]             │             │
│         └─────────────────────────────┘             │
│                                                     │
│           [ 対戦開始 ]                              │
│                                                     │
│         操作説明:                                   │
│         Player 1: Caps Lock OFF で入力             │
│         Player 2: Caps Lock ON で入力              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- API キー入力欄は「ChatGPT API」選択時のみ表示
- API キー未入力時は「対戦開始」ボタンを disabled にする（API 選択時のみ）

## useGame の変更

```typescript
// 変更前
const startGame = useCallback(async () => {
  const sentences = shuffle(await LocalSentenceRepository.getSentences());
  ...
}, [dispatch]);

// 変更後
const startGame = useCallback(async (source: SentenceSource, apiKey?: string) => {
  const repository = source === 'api' && apiKey
    ? createApiSentenceRepository(apiKey)
    : LocalSentenceRepository;
  const sentences = shuffle(await repository.getSentences());
  ...
}, [dispatch]);
```

## エラーハンドリング

| エラー種別 | 対応 |
|-----------|------|
| API キー不正 (401) | 「API キーが無効です。確認してください。」を表示 |
| レート制限 (429) | 「API のレート制限に達しました。しばらく待ってからお試しください。」を表示 |
| タイムアウト | 「API の応答がタイムアウトしました。」を表示 |
| JSON パースエラー | 「API のレスポンスが不正です。再度お試しください。」を表示 |
| その他のエラー | 「出題文の取得に失敗しました。」を表示 |

エラー発生時は TitleScreen に戻り、エラーメッセージを表示する。

## 影響範囲

### 変更なし

- Domain 層（Game, Player, Sentence, RomajiConverter, InputValidator）
- Application 層（InputUseCase, gameReducer）
- ゲーム中のコンポーネント（GameScreen, PlayerArea, SentenceDisplay, Timer, ScoreBoard, ResultModal）

### 変更あり

- Infrastructure 層: 新規リポジトリ・API クライアント追加
- Presentation 層: TitleScreen の UI 拡張、useGame の引数追加、App の state 追加
