# 設計: Dev Container 対応

## 実装アプローチ

Microsoft 公式の `devcontainers/javascript-node` イメージをベースに、
`devcontainer.json` 1 ファイルのみで構成する。
Dockerfile によるカスタマイズは行わない。

## 変更ファイル一覧

| ファイル | 変更種別 | 内容 |
|---|---|---|
| `.devcontainer/devcontainer.json` | 新規作成 | Dev Container 設定 |
| `README.md` | 更新 | Dev Container を使った起動手順を追記 |

## `.devcontainer/devcontainer.json` の構成

```json
{
  "name": "vs-typing-dojo-ts",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm",
  "forwardPorts": [5173, 4173],
  "portsAttributes": {
    "5173": { "label": "Vite Dev Server", "onAutoForward": "notify" },
    "4173": { "label": "Vite Preview",    "onAutoForward": "notify" }
  },
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": [...],
      "settings": { ... }
    }
  }
}
```

### VS Code 拡張機能

| 拡張機能 ID | 用途 |
|---|---|
| `dbaeumer.vscode-eslint` | ESLint |
| `esbenp.prettier-vscode` | Prettier |
| `bradlc.vscode-tailwindcss` | Tailwind CSS IntelliSense |
| `ms-vscode.vscode-typescript-next` | TypeScript |
| `vitest.explorer` | Vitest テストエクスプローラー |

### VS Code 設定

- `editor.defaultFormatter`: Prettier
- `editor.formatOnSave`: true
- `editor.codeActionsOnSave`: ESLint 自動修正
- `typescript.tsdk`: `node_modules/typescript/lib`（ワークスペースの TypeScript を使用）

## README の変更

「起動方法」セクションに **Dev Container を使う（推奨）** を先頭に追加する。
既存のローカル環境手順は **ローカル環境で使う** として残す。

## 影響範囲

- ランタイムコード・既存の設定ファイルへの影響なし
- CI/CD への影響なし（GitHub Actions を使用していないため）
