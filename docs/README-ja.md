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
    settings/     # 設定 (表示モード、検索エンジン選択)
  services/       # サービス層 — 層設計の詳細は docs/services.md を参照
    result/       # 結果を並列で集約し、Fuse.jsで統合
    tab/          # chrome.tabs API のラッパー
    bookmark/     # chrome.bookmarks API のラッパー
    history/      # chrome.history API のラッパー
    suggestion/   # 外部検索サジェスト API のラッパー
    action/       # mathjsによる計算機アクション（純粋なドメインロジック）
    storage/      # chrome.storage.sync のラッパー
    content/      # chrome.action.openPopupによるポップアップの開閉
    runtime/      # UIとバックグラウンド間の型付きIPCブリッジ
  shared/         # フィーチャー横断のユーティリティとUIプリミティブ
    components/   # 再利用可能なUIプリミティブ (Layout, ButtonItem, SquareIcon)
    hooks/        # 共有フック (useTranslation)
    utils/        # 純粋なユーティリティ関数 (アルゴリズムヘルパー)
    lib/          # ライブラリラッパー (i18n)
  locales/        # ロケールファイル (en.json, ja.json)
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
