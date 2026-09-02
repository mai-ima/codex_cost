# KAGO

買うものと買ったものを、ブラウザ内でシンプルに管理する買い物メモです。

## 開発

```bash
npm install
npm run dev
```

データモデルと永続化は `src/store.js`、画面ロジックは `src/app.js` に分離しています。将来 Swift に移行するときも `Item` / `History` モデルと Store を同じ責務で実装できます。データは現在、端末の `localStorage` に保存されます。

## Vercel

リポジトリを Vercel にインポートすると、Vite プロジェクトとして自動でビルド・配信できます。
