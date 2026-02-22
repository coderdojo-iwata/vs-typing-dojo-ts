# 要求内容: Dev Container 対応

## 概要

VS Code の Dev Containers 機能を使って、Docker コンテナ内で統一された開発環境を提供する。

## ユーザーストーリー

- 開発者として、リポジトリをクローンしてすぐに開発環境を立ち上げたい
- 開発者として、Node.js のバージョンや拡張機能の設定を手動でそろえる手間を省きたい
- 開発者として、コンテナ内で `npm run dev` を実行し、ホストのブラウザからアプリにアクセスしたい

## 受け入れ条件

- [ ] `.devcontainer/devcontainer.json` が存在し、VS Code の "Reopen in Container" で起動できる
- [ ] コンテナ起動後に `npm install` が自動実行される
- [ ] Vite 開発サーバーのポート 5173 がホストへ自動フォワードされる
- [ ] VS Code 拡張機能（ESLint・Prettier・Tailwind CSS IntelliSense・Vitest）がコンテナ内に自動インストールされる
- [ ] 保存時に Prettier フォーマットと ESLint 自動修正が動作する
- [ ] README に Dev Container を使った起動手順が記載されている

## 制約事項

- ベースイメージは Microsoft 公式の `devcontainers/javascript-node` を使用する
- Node.js バージョンは LTS（22）に合わせる
- 追加の Dockerfile は作成しない（イメージのカスタマイズが不要な間は `image` 指定のみ）
