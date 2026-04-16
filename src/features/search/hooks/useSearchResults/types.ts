/**
 * useSearchResults関連の型定義
 */

import type { Kind, Result } from "@/services/result";

/** ローディング状態 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** 検索結果の取得パラメータ */
export interface UseSearchResultsParams {
  /** 検索クエリ */
  query?: string;
  /** 検索対象のカテゴリ */
  categories: Kind[];
  /** 取得する最大件数。デフォルト: 1000 */
  maxCount?: number;
}

/** 検索結果のオプション */
export interface UseSearchResultsOptions {
  /** キャッシュを有効にするか。デフォルト: true */
  enableCache?: boolean;
  /** キャッシュの有効期限（ミリ秒）。デフォルト: 60000 (1分) */
  cacheExpireMs?: number;
  /** リトライを有効にするか。デフォルト: true */
  enableRetry?: boolean;
  /** リトライの最大回数。デフォルト: 3 */
  maxRetries?: number;
  /** リトライの待機時間（ミリ秒）。デフォルト: 1000 */
  retryDelayMs?: number;
  /** タイムアウト時間（ミリ秒）。デフォルト: 10000 (10秒) */
  timeoutMs?: number;
}

/** エラー情報 */
export interface ResultError {
  /** エラーメッセージ */
  message: string;
  /** エラーコード */
  code?: string;
  /** 元のエラー */
  originalError?: unknown;
}

/** キャッシュエントリ */
export interface CacheEntry<T> {
  /** キャッシュされたデータ */
  data: T;
  /** キャッシュの作成時刻 */
  timestamp: number;
  /** キャッシュキー */
  key: string;
}

/** useSearchResultsの戻り値 */
export interface UseSearchResultsReturn {
  /** 検索結果 */
  results: Result<Kind>[];
  /** ローディング状態 */
  loadingState: LoadingState;
  /** ローディング中かどうか（後方互換性のため） */
  loading: boolean;
  /** エラー情報 */
  error: ResultError | null;
  /** 結果を再取得 */
  refresh: () => Promise<void>;
  /** キャッシュをクリア */
  clearCache: () => void;
  /** リトライ */
  retry: () => Promise<void>;
}
