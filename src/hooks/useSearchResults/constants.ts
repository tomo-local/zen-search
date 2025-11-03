/**
 * useSearchResults関連の定数
 */

import type { UseSearchResultsOptions } from "./types";

/** デフォルトオプション */
export const DEFAULT_OPTIONS: Required<UseSearchResultsOptions> = {
  enableCache: true,
  cacheExpireMs: 60000, // 1分
  enableRetry: true,
  maxRetries: 3,
  retryDelayMs: 1000, // 1秒
  timeoutMs: 10000, // 10秒
};

/** デフォルトの最大取得件数 */
export const DEFAULT_MAX_COUNT = 1000;

/** エラーメッセージ */
export const ERROR_MESSAGES = {
  TIMEOUT: "検索がタイムアウトしました",
  NETWORK: "ネットワークエラーが発生しました",
  UNKNOWN: "予期しないエラーが発生しました",
  MAX_RETRIES: "最大リトライ回数に達しました",
} as const;

/** エラーコード */
export const ERROR_CODES = {
  TIMEOUT: "TIMEOUT",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
  MAX_RETRIES: "MAX_RETRIES",
} as const;
