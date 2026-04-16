/**
 * useSearch関連の型定義
 */

import type { Kind } from "@/services/result";

/** 検索結果のタイプ */
export type ResultType = "All" | "Tab" | "History" | "Bookmark" | "Google";

/** クエリの状態 */
export interface QueryState {
  /** 現在のタイプ */
  type: ResultType;
  /** 検索クエリ */
  query: string;
  /** 検索対象のカテゴリ */
  categories: Kind[];
  /** サジェストされたタイプ */
  suggestion: ResultType | null;
  /** 初期化フラグ */
  init: boolean;
}

/** Reducerのアクション */
export type QueryAction =
  | { type: "type"; value: ResultType }
  | { type: "category"; value: Kind[] }
  | { type: "query"; value: string }
  | { type: "suggestion"; value: ResultType | null }
  | { type: "resetType" };

/** useSearchのオプション */
export interface UseSearchOptions {
  /** デバウンス時間（ミリ秒）。デフォルト: 200 */
  debounceMs?: number;
  /** クエリの最大文字数。デフォルト: 500 */
  maxQueryLength?: number;
  /** クエリを自動的にトリムするか。デフォルト: true */
  autoTrim?: boolean;
  /** suggestion判定の類似度閾値（0-1）。デフォルト: 0.6 */
  similarityThreshold?: number;
}

/** バリデーション結果 */
export interface ValidationResult {
  /** バリデーションが成功したか */
  isValid: boolean;
  /** エラーメッセージの配列 */
  errors: string[];
}
