# Zen Search

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

今後の開発計画を重要度とテーマで整理しています。

### ✅ リリース済み
- [x] ダークモードのサポートを追加。

### 🏁 次に対応したい項目
- [ ] 重要なコンポーネントの単体テストを追加。
- [ ] 検索結果のフィルタリングオプションを強化。
- [ ] 大規模データセット向けのパフォーマンスを最適化。

### 🌐 検索体験の向上
- [ ] 複数の検索エンジン（Google、Bing、DuckDuckGoなど）をサポート。
- [ ] UIの多言語対応を実装。

### ⚙️ ワークフローと自動化
- [ ] 新しいActionのtypeを追加:
  - [ ] ウィンドウを閉じる。
  - [ ] ウィンドウを開く。
  - [ ] タブを開く。
  - [ ] タブをリロードする。
  - [ ] タブを複製する。
  - [ ] タブをピン留めまたはピン留め解除する。
  - [ ] 新しいタブグループを作成する。
  - [ ] タブをグループに追加する。
  - [ ] タブをグループから削除する。
  - [ ] タブグループの名前を変更する。
  - [ ] タブグループを閉じる。
- [ ] ユーザーがカスタムアクションを定義して追加できるようにする。

### 🛠 設定とパーソナライズ
- [ ] 設定画面を実装して以下を設定可能にする:
  - [ ] デフォルトの検索エンジン。
  - [ ] カスタムアクション。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。
