# Suggestion Service

## 概要

Suggestion（サジェスト）機能は、ユーザーの入力に応じて候補をリアルタイムで提示する仕組みです。
このサービスはGoogleサジェストAPIや独自の候補生成ロジックと連携し、検索体験を向上させます。

## 主な役割
- ユーザーのクエリに対して候補ワードを返す
- 履歴やブックマーク、Googleサジェストなど複数ソースを統合
- 候補のランキングやフィルタリング

## ディレクトリ構成例

```
src/services/suggestion/
  ├─ service.ts         # サジェストのビジネスロジック
  ├─ types.ts           # 型定義
  ├─ index.ts           # エクスポート
  └─ README.md          # このファイル
```

## 代表的な型
- SuggestionRequest: サジェスト取得リクエスト
- SuggestionResponse: サジェスト取得レスポンス

## 代表的なメソッド
- `getSuggestions(request: SuggestionRequest): Promise<SuggestionResponse[]>`
  - クエリに対する候補リストを返す

## 実装例
```ts
const suggestions = await suggestionService.getSuggestions({ query: 'zen' });
console.log(suggestions); // ["zen-search", "zen garden", ...]
```

## 注意点
- Google APIのレートリミットやエラー処理に注意
- 候補の重複排除やランキングロジックの工夫

---

何か質問があれば気軽にどうぞ！🚀
