# Zen Search

[English README](../README.md)

Zen Searchは、[WXT](https://wxt.dev/) + React 19 + TypeScript + Tailwind CSS v4で構築された軽量で直感的なChrome/Firefox拡張機能です。検索ポップアップ（`Cmd+T` / `Ctrl+T`）を開き、タブ、ブックマーク、履歴、ブラウザの候補をひとつの画面から検索できます。

## 特徴

- **統合検索**: タブ、ブックマーク、履歴、ブラウザの候補を1つのポップアップで横断検索。
- **キーボードショートカット**: 矢印キーやEnterキーで結果を操作。
- **軽量で高速**: 最小限のリソースで動作し、スムーズなパフォーマンスを提供。
- **モダンなデザイン**: Tailwind CSS v4を使用した洗練されたレスポンシブUI。

## アーキテクチャ

### ディレクトリ構成

```
src/
  entrypoints/    # 拡張機能のエントリーポイント
    popup/        # 検索UI (main.tsxがReactを起動、App.tsxがフックを統合)
    background/   # サービスワーカー (コマンド・メッセージルーティング)
  features/       # ドメインごとのFeatureスコープのコンポーネントとフック
    search/       # 検索状態、結果取得、キーボード操作、ショートカット
    theme/        # テーマ管理 (useTheme, ThemeProvider)
    tab/          # タブ関連のコンポーネントとフック
    bookmark/     # ブックマーク関連のコンポーネント
    history/      # 履歴関連のコンポーネント
    suggestion/   # サジェスト関連のコンポーネント
    action/       # アクションコンポーネント (例: 計算機)
  services/       # ビジネスロジックとChrome拡張API
    result/       # 結果を並列で集約し、Fuse.jsで統合
    tab/          # chrome.tabs APIへの問い合わせ
    bookmark/     # chrome.bookmarks APIへの問い合わせ
    history/      # chrome.history APIへの問い合わせ
    suggestion/   # chrome.omnibox / 検索サジェストの問い合わせ
    action/       # mathjsによる計算機アクション
    storage/      # chrome.storage.syncのラッパー
    content/      # chrome.action.openPopupによるポップアップの開閉
    runtime/      # 型付きメッセージパッシングヘルパー
  shared/         # 再利用可能なUIプリミティブ (Layout, ButtonItem, SquareIcon)
  lib/            # ライブラリラッパー (i18n)
  locales/        # ロケールファイル (en.json, ja.json)
  utils/          # 共有ヘルパーやアルゴリズム関数
  assets/         # グローバルスタイル
```

## インストール方法

1. リポジトリをクローンします:
   ```bash
   git clone https://github.com/your-repo/zen-search.git
   cd zen-search
   ```

2. 必要な依存関係をインストールします:
   ```bash
   pnpm install
   ```

3. 開発サーバーを起動します:
   ```bash
   pnpm dev
   ```

4. ブラウザで拡張機能を読み込み、Zen Searchをお楽しみください！

## ロードマップ

TBD

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。
