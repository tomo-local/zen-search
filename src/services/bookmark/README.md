# Bookmark Service

ブックマーク関連の操作を担当するサービスです。

## 機能

- **ブックマークの検索**: ブックマークから検索クエリに一致するものを見つける

## API

### queryBookmarks(message: QueryMessage)
ブックマークから検索クエリに一致するものを取得します。

## 使用例

```typescript
const bookmarkService = new BookmarkService();
await bookmarkService.initialize();

// ブックマークを検索
const result = await bookmarkService.queryBookmarks({
  query: 'GitHub'
});
```
