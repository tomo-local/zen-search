# サービス層の設計

## 概要

zen-search のサービス層はレイヤードアーキテクチャをベースに構成されており、ブラウザ拡張機能という環境に合わせて実用的にアレンジしています。サービスは責務に応じて3つの層に分類されます。

## サービス層

### アプリケーションサービス

複数のインフラサービスを調整し、単一のユースケースを実現します。

| サービス | 責務 |
| --- | --- |
| `result` | すべてのソースサービスから並列で結果を集約し、ファジー検索を適用して統合された結果一覧を返す |

### ドメインサービス

Chrome API や外部システムへの依存を持たない、純粋なビジネスロジックをカプセル化します。

| サービス | 責務 |
| --- | --- |
| `action` | mathjs による数式の検出と評価。現在は計算処理のみですが、アクション種別の追加にともない `result` と同様のオーケストレーターへ発展する予定です。 |

### インフラサービス

Chrome API や外部システムをラップし、型付きインターフェースとして提供します。これらのサービスは独自のビジネスロジックを持たず、Chrome の型とアプリのドメイン型の間の変換を行います。

| サービス | 責務 |
| --- | --- |
| `tab` | `chrome.tabs` のラッパー — ブラウザタブの検索・作成・アクティブ化・削除 |
| `bookmark` | `chrome.bookmarks` のラッパー — ブックマークの検索および最近のブックマークの取得 |
| `history` | `chrome.history` のラッパー — 時間範囲フィルタ付きのブラウザ履歴検索 |
| `suggestion` | 外部検索サジェスト API のラッパー — 複数エンジンにまたがるサジェストの取得と重複排除 |
| `storage` | `chrome.storage.sync` のラッパー — ユーザー設定の永続化と変更購読 |
| `content` | `chrome.action` のラッパー — 拡張機能のポップアップまたはサイドパネルの開閉 |
| `runtime` | `chrome.runtime` を通じた UI とバックグラウンドのサービスワーカー間の型付き IPC ブリッジ |

## データフロー

### 読み取り（検索）

```
UI
 └─ runtimeService.queryResults()
      └─ sendMessage(QUERY_RESULT)
           └─ background router        ← アプリケーション層
                └─ resultService       ← 並列で調整
                     ├─ tabService.query()
                     ├─ bookmarkService.query()
                     ├─ historyService.query()
                     ├─ suggestionService.query()
                     └─ actionService.calculate()
```

### 書き込み（タブ操作）

```
UI
 └─ runtimeService.createTab()
      └─ sendMessage(CREATE_TAB)
           └─ background router        ← アプリケーション層
                └─ tabService.create() ← インフラ（調整不要のため直接呼び出し）
```

書き込み操作は background router から直接呼び出されます。各書き込みは Chrome API の1つの呼び出しに対応するため、調整は不要です。

## アクセスルール

### 目標アーキテクチャ

UI コンテキスト（popup・sidepanel・features）は実行時に **`runtime` サービスのみ** を参照しなければなりません。すべてのサービスロジックはバックグラウンドのサービスワーカー内でのみ実行されます。

```
[UI: popup / sidepanel / features]
        │
        │  runtime サービスのみ
        ▼
[runtime service] ──(chrome.runtime.sendMessage)──▶ [background]
                                                           │
                                         ┌─────────────────┼──────────────────┐
                                         ▼                 ▼                  ▼
                                     content           storage     result / tab / bookmark
                                                                   history / suggestion / action
```

UI コードで任意のサービスから型のみをインポートすること（`import type { ... }`）は許可されています。型はビルド時に消去されるため、実行時の依存関係は発生しません。

### 現状

コードベースは目標アーキテクチャへ移行中です。以下の乖離が残っています。

| サービス | UIから使用 | 備考 |
| --- | --- | --- |
| `runtime` | ✅ 正しい | `useControlTab`・`useSearchResults` から呼び出し |
| `storage` | ⚠️ 乖離あり | `useTheme`・`useViewMode` から直接呼び出し |
| `content` | ⚠️ 乖離あり | `popup/main.tsx` から直接呼び出し |
| その他 | ✅ 型のみ | `result`・`tab`・`bookmark`・`history`・`suggestion`・`action` |

`useTheme`・`useViewMode`・`popup/main.tsx` を変更する際は、直接のサービス呼び出しを追加せず、`runtime` を経由してルーティングしてください。

## 内部構造

各サービスは一貫したファイル構成に従います。

```
src/services/<name>/
  types.ts      # インターフェース・列挙型・リクエスト/レスポンス型
  service.ts    # サービスの公開実装
  helper.ts     # 副作用のない純粋なユーティリティ関数
  converter.ts  # Chrome API の型からドメイン型へのデータ変換（必要な場合）
  index.ts      # 公開 API の再エクスポート
```

## 設計の考え方

### なぜ tab/bookmark/history はインフラサービスに分類されるのか

これらのサービスは Chrome API の薄いラッパーです。Chrome の生の型（`chrome.tabs.Tab`・`chrome.bookmarks.BookmarkTreeNode` など）をアプリのドメイン型に変換しますが、ビジネスロジックは持ちません。いつ呼ぶか・どう組み合わせるかという判断は `result` サービスまたは background router が担います。

### なぜ result は tab/bookmark/history の上位に位置するのか

`result` は複数のソースを調整する唯一のサービスです。`Promise.allSettled` で並列にクエリを実行し、結果をマージし、ファジー検索を適用します。これらはすべて Chrome API の関心事ではなく、アプリケーション層の関心事です。

### action の将来の方向性

現在の `action` は計算処理のみを持つドメインサービスです。アクション種別が増えるにつれ（単位変換・URL操作など）、`action` は `result` と同様のオーケストレーター（アプリケーションサービス）へ発展する予定です。各ハンドラーは可能な限り純粋関数として実装し、外部 API が必要なハンドラーはインフラサービスとして扱います。

```
src/services/action/         ← 将来の構成
  service.ts                 ← オーケストレーター（result と同様）
  types.ts
  handlers/
    calculation.ts           ← 現在のロジック（純粋なドメイン）
    conversion.ts            ← 将来（単位・通貨変換）
    ...
```

### なぜ UI からのアクセスを runtime のみに限定するのか

バックグラウンドのサービスワーカーは Chrome API に対して安定した長期アクセスを持つ唯一のコンテキストです。すべてのサービス呼び出しをバックグラウンド経由にすることで、サービスワーカーのライフサイクルに起因するタイミング問題を回避し、UI コードを Chrome API の依存から解放します。

### トレードオフ

- `storage` は現在 UI フック（`useTheme`・`useViewMode`）から直接アクセスされています。これは `chrome.storage.onChanged` の購読をリアクティブな状態更新のために UI コンテキストで実行する必要があるためです。移行が進むにつれて解消される予定です。
- `converter.ts` はレイヤードアーキテクチャの観点ではファクトリに相当しますが、実用的なシンプルさを優先して純粋関数のファイルとして管理しています。
