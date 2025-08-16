# TabService

タブ関連の操作を担当するサービスクラスです。

## ファイル構成

- **`tab.service.ts`** - メインのサービスクラス
- **`tab.types.ts`** - タブ関連の型定義（`type`プロパティ削除済み）
- **`tab.converter.ts`** - Chrome APIタブデータの変換ロジック
- **`tab.utils.ts`** - タブフィルタリングのユーティリティ関数
- **`index.ts`** - エクスポート定義

## 機能

- タブの検索（クエリベース）
- 新しいタブの作成
- タブの更新（アクティブ化とウィンドウフォーカス）
- タブの削除

## 使用例

```typescript
import { TabService } from '@/services/tab';

const tabService = new TabService();

// タブを検索
const result = await tabService.query({
  query: 'github',
  count: 10,
  currentWindow: true
});

// 新しいタブを作成
await tabService.create({
  url: 'https://github.com'
});

// タブを更新（アクティブ化）
await tabService.update({
  tabId: 123,
  windowId: 456
});

// タブを削除
await tabService.remove({
  tabId: 123
});
```

## 今回の主な変更点

### Phase 2: TabServiceの統合完了 ✅

1. **型定義の整理** (`tab.types.ts`)
   - 各インターフェースから`type`プロパティを削除
   - クリーンな型定義に変更

2. **フィルタリングロジックの分離** (`tab.utils.ts`)
   - タブフィルター機能をユーティリティファイルに移行
   - `filterTabsByQuery()` - メインのフィルタリング関数
   - `matchTabTitle()` - タイトルマッチ
   - `matchTabUrl()` - URLマッチ
   - `matchTab()` - 総合マッチ

3. **サービスクラスの簡素化** (`tab.service.ts`)
   - フィルターロジックをutilファイルに委譲
   - `searchChromeTab()`メソッドが簡潔に

## 移行された機能

### utils/chrome.ts から移行
- `actionQuery` → TabService内の`searchChromeTab`メソッドに統合
- フィルタリングロジック → `tab.utils.ts`に分離

### function/chrome/tab.ts から移行
- `queryTabs` → `query`メソッドに統合
- `createTab` → `create`メソッドに統合
- `updateTab` → `update`メソッドに統合
- `removeTab` → `remove`メソッドに統合

## アーキテクチャの改善点

- **関心の分離**: フィルタリングロジックを独立したutilファイルに移行
- **型安全性**: 不要な`type`プロパティを除去してクリーンな型定義
- **再利用性**: utilファイルにより、フィルタリング機能の再利用が容易
- **テスタビリティ**: 各機能が独立してテスト可能
