/**
 * Runtime Service Types - runtime通信で使用する型定義
 */

// レスポンス型定義
export interface RuntimeResponse<T = unknown> {
  type: string;
  result: T;
}

// リクエスト型定義（将来的な拡張用）
export interface QueryTabsRequest {
  query: string;
  count?: number;
}
