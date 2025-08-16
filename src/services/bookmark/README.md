# Bookmark Service

ブックマーク関連の操作を担当するサービスです。

## 概要

Chrome Bookmarks API を使用して、ブックマークの検索と最近のブックマーク取得を行います。
URLを持つブックマーク（サイト）のみを対象とし、アプリケーション用の形式に変換します。

## 機能

- **ブックマーク検索**: クエリに基づいてブックマークを検索
- **最近のブックマーク取得**: 最近追加されたブックマークを取得
- **サイトのみフィルタ**: URLを持つブックマークのみを対象（フォルダ除外）
- **マッチ率計算**: タイトルとURLに対するクエリのマッチ率を算出

## 構成

### `BookmarkService`
メインのサービスクラス。Chrome API との通信とビジネスロジックを担当。

### `BookmarkConverter`
Chrome API のレスポンスをアプリケーション形式に変換する専用クラス。

## API

### `queryBookmarks(request: QueryMessage)`

ブックマークを検索または最近のブックマークを取得します。

**パラメータ:**
- `request.query`: 検索クエリ（BookmarkQuery型）
  - 文字列: `"GitHub"`
  - オブジェクト: `{ query: "GitHub" }`
  - `null/undefined`: 最近のブックマークを取得
- `request.count?`: 取得件数上限（デフォルト: 10件）

**戻り値:**
```typescript
{
  type: MessageType.QUERY_BOOKMARK;
  result: Bookmark[];
}
```

**Bookmark型:**
```typescript
interface Bookmark {
  type: ResultType.Bookmark;
  id: number | string;
  title: string;
  url: string;
  match: number; // マッチ率（0-1）
}
```

## 使用例

```typescript
import { BookmarkService } from '@/services/bookmark';

const bookmarkService = new BookmarkService();
await bookmarkService.initialize();

// 1. キーワードでブックマークを検索
const searchResult = await bookmarkService.queryBookmarks({
  type: MessageType.QUERY_BOOKMARK,
  query: "GitHub",
  count: 5
});

// 2. 最近のブックマークを取得
const recentResult = await bookmarkService.queryBookmarks({
  type: MessageType.QUERY_BOOKMARK,
  query: null,
  count: 10
});

console.log(searchResult.result); // Bookmark[]
```

## 内部処理

1. **クエリ判定**: queryの有無で処理を分岐
2. **API呼び出し**: `chrome.bookmarks.search()` または `chrome.bookmarks.getRecent()`
3. **フィルタリング**: URLを持つブックマークのみ抽出
4. **変換**: `BookmarkConverter` でアプリケーション形式に変換
5. **件数制限**: 指定件数でスライス
