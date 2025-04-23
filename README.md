# SmartMemo

高機能なメモアプリケーション（React実装）

## 特徴

- マークダウン記法対応
- タグ付け機能
- お気に入り機能
- アーカイブ機能
- ゴミ箱機能
- テーマカスタマイズ
- オフライン対応（IndexedDB/localforage）

## 技術スタック

- React (Hooks)
- React Router
- Styled Components
- localforage (IndexedDBラッパー)
- Marked.js (マークダウンパーサー)
- React Icons

## インストール方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start

# ビルド
npm run build
```

## 使い方

1. メモの作成：右下の + ボタンをクリック
2. メモの編集：メモを開いて編集ボタンをクリック
3. メモの削除：メモカードの ... メニューから削除を選択
4. タグの追加：メモ編集時にタグを追加

## ライセンス

MIT
