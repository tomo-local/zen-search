# 🔄 リファクタリング TODO リスト

## 🎯 目標
`function/` フォルダーの処理を `services/` に統合し、コード構造をクリーンにする

## 📋 実施計画

### Phase 1: BookmarkService の統合 ✅ (完了)
- [x] `utils/chrome.ts` の `actionBookmarkQuery`, `actionRecentBookmarks` を `BookmarkService` に移行
- [x] `function/chrome/bookmark.ts` の `queryBookmarks` ロジックを `BookmarkService` に統合
- [x] 型定義の移行 (`Bookmark`, `QueryBookmarkMessage`)
- [x] 依存関係の更新
- [ ] テスト実行

### Phase 2: TabService の統合 ✅ (完了)
- [x] `utils/chrome.ts` の `actionQuery` を `TabService` に移行
- [x] `function/chrome/tab.ts` の全ての処理を `TabService` に統合
  - [x] `queryTabs`
  - [x] `createTab`
  - [x] `updateTab`
  - [x] `removeTab`
- [x] 依存関係の更新
- [x] テスト実行

### Phase 3: HistoryService の統合 ✅ (完了)
- [x] `function/chrome/history.ts` の `queryHistory` を `HistoryService` に統合
- [x] 依存関係の更新
- [x] テスト実行

### Phase 4: PopupService の統合
- [x] `utils/chrome.ts` の popup関連処理を `PopupService` に移行
  - [x] `actionRuntimeContent`
  - [x] `actionTabsContent`
  - [x] `actionPopupContent`
- [x] `function/chrome/open.ts` の処理を `PopupService` に統合
- [x] 依存関係の更新
- [x] テスト実行

### Phase 5: StorageService の作成と統合
- [ ] `StorageService` クラスの作成
- [ ] `function/chrome/storage.ts` の処理を統合
- [ ] 依存関係の更新
- [ ] テスト実行

### Phase 6: Google検索サービスの統合
- [x] `GoogleService` クラスの作成（新規）
- [x] `function/google/query.ts` の処理を統合
- [x] 依存関係の更新
- [x] テスト実行

### Phase 7: クリーンアップ
- [ ] `function/` フォルダーの削除
- [ ] `utils/chrome.ts` の削除
- [ ] 残ったインポート文の修正
- [ ] 最終テスト実行

## 📁 最終的な構造

```
src/
  utils/          # 純粋な汎用ユーティリティのみ
    algorithm.ts  # N-gram等のアルゴリズム
    calculation.ts # 数学計算
    match.ts      # マッチング処理
    math.ts       # 数学ユーティリティ

  services/       # Chrome拡張のビジネスロジック
    bookmark/
      bookmark.service.ts # ブックマーク関連の全処理
    tab/
      tab.service.ts      # タブ関連の全処理
    history/
      history.service.ts  # 履歴関連の全処理
    popup/
      popup.service.ts    # ポップアップ関連の全処理
    storage/
      storage.service.ts  # ストレージ関連の全処理
    google/
      google.service.ts   # Google検索関連の全処理
```

## 🎖️ 実施状況
- [x] 計画立案
- [x] Phase 1: BookmarkService
- [x] Phase 2: TabService
- [x] Phase 3: HistoryService
- [ ] Phase 4: PopupService
- [ ] Phase 5: StorageService
- [ ] Phase 6: GoogleService
- [ ] Phase 7: クリーンアップ

## 🔍 注意点
- 各Phase完了後にテスト実行
- 段階的な実施で問題を早期発見
- 依存関係の破綻に注意
- 型定義の整合性確認
