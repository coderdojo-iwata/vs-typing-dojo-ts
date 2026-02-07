# リポジトリ構造定義書

## ディレクトリ構成

```
vs-typing-dojo-ts/
├── .vscode/                    # VSCode設定
│   ├── settings.json           # エディタ設定
│   └── extensions.json         # 推奨拡張機能
├── docs/                       # 永続的ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md
│   ├── development-guidelines.md
│   └── glossary.md
├── .steering/                  # 作業単位のドキュメント
│   └── YYYYMMDD-xxx/
├── src/
│   ├── domain/                 # Domain Layer
│   │   ├── entities/           # エンティティ
│   │   │   ├── Game.ts
│   │   │   ├── Player.ts
│   │   │   └── Sentence.ts
│   │   ├── services/           # ドメインサービス
│   │   │   ├── RomajiConverter.ts
│   │   │   ├── InputValidator.ts
│   │   │   └── SentenceValidator.ts
│   │   └── repositories/       # リポジトリインターフェース
│   │       └── SentenceRepository.ts
│   ├── application/            # Application Layer
│   │   └── usecases/
│   │       └── InputUseCase.ts
│   ├── infrastructure/         # Infrastructure Layer
│   │   ├── api/
│   │   │   └── openaiClient.ts
│   │   └── repositories/
│   │       ├── LocalSentenceRepository.ts
│   │       └── ApiSentenceRepository.ts
│   ├── presentation/           # Presentation Layer
│   │   ├── components/         # Reactコンポーネント
│   │   │   ├── App.tsx
│   │   │   ├── TitleScreen.tsx
│   │   │   ├── GameScreen.tsx
│   │   │   ├── PlayerArea.tsx
│   │   │   ├── SentenceDisplay.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── ScoreBoard.tsx
│   │   │   ├── ResultModal.tsx
│   │   │   └── ApiKeyInput.tsx
│   │   ├── hooks/              # カスタムフック
│   │   │   ├── useGame.ts
│   │   │   ├── useGameContext.ts
│   │   │   ├── useApiKey.ts
│   │   │   └── useKeyboardInput.ts
│   │   └── contexts/           # React Context
│   │       ├── GameContext.tsx
│   │       └── gameReducer.ts
│   ├── shared/                 # 共通モジュール
│   │   ├── constants.ts        # 定数
│   │   └── types.ts            # 共通型定義
│   ├── data/                   # 静的データ
│   │   └── sentences.json      # 出題データ
│   ├── main.tsx                # エントリポイント
│   └── index.css               # グローバルスタイル（Tailwind）
├── tests/                      # テスト
│   ├── domain/
│   │   ├── entities/
│   │   └── services/
│   ├── application/
│   └── presentation/
├── public/                     # 静的ファイル
│   └── favicon.ico
├── index.html                  # HTMLテンプレート
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .prettierrc
├── .eslintrc.cjs
├── .gitignore
└── CLAUDE.md                   # プロジェクトメモリ
```

## ディレクトリの役割

### src/domain/

ビジネスロジックを格納。外部依存なし（純粋なTypeScript）。

| ディレクトリ | 役割 |
|-------------|------|
| `entities/` | ゲームの中核となるデータ構造と振る舞い |
| `services/` | エンティティに属さないビジネスロジック |
| `repositories/` | データ取得のインターフェース定義 |

### src/application/

ユースケース（アプリケーション固有のビジネスルール）を格納。

| ディレクトリ | 役割 |
|-------------|------|
| `usecases/` | ゲーム進行、入力処理などのユースケース |

### src/infrastructure/

外部との接続を担当。

| ディレクトリ | 役割 |
|-------------|------|
| `api/` | 外部API通信（OpenAI等） |
| `repositories/` | リポジトリインターフェースの実装 |

### src/presentation/

UI層。Reactコンポーネントとフック。

| ディレクトリ | 役割 |
|-------------|------|
| `components/` | Reactコンポーネント |
| `hooks/` | カスタムフック |
| `contexts/` | React Context |

### src/shared/

各層から共通で使用するモジュール。

| ファイル | 役割 |
|---------|------|
| `gameConfig.ts` | ゲーム設定定数 |
| `shuffle.ts` | 配列シャッフルユーティリティ |
| `types.ts` | 共通の型定義（SentenceSource等） |

### tests/

テストファイル。srcと同じ構造でミラーリング。

## VSCode設定

### .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### .vscode/extensions.json

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## ファイル命名規則

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| Reactコンポーネント | PascalCase | `GameScreen.tsx` |
| フック | camelCase（use接頭辞） | `useGame.ts` |
| ユースケース | PascalCase | `GameUseCase.ts` |
| エンティティ | PascalCase | `Player.ts` |
| 定数・設定 | camelCase | `constants.ts` |
| テスト | 対象ファイル名 + `.test.ts` | `Player.test.ts` |

## インポートルール

### 依存方向

```
presentation → application → domain ← infrastructure
```

### 禁止事項

- `domain/` から他の層をインポートしない
- `application/` から `presentation/` をインポートしない
- 循環参照を作らない

### パスエイリアス（任意）

```typescript
// tsconfig.json で設定可能
{
  "compilerOptions": {
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@presentation/*": ["src/presentation/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```
