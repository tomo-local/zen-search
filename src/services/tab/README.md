# Tab Service

タブ関連の操作を担当するサービスです。

## 機能

- **タブの検索**: 開いているタブから検索クエリに一致するものを見つける
- **タブの作成**: 新しいタブを指定のURLで開く
- **タブの更新**: 既存のタブをアクティブにする
- **タブの削除**: 指定されたタブを閉じる

## API

### queryTabs(message: QueryMessage)
開いているタブから検索クエリに一致するものを取得します。

### createTab(message: CreateMessage)
新しいタブを作成します。

### updateTab(message: UpdateMessage)
指定されたタブをアクティブにします。

### removeTab(message: RemoveMessage)
指定されたタブを閉じます。

## 使用例

```typescript
const tabService = new TabService();
await tabService.initialize();

// タブを検索
const result = await tabService.queryTabs({
  query: 'GitHub',
  count: 10
});
```
