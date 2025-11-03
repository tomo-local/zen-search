/**
 * useSearchResults - 検索結果の取得と管理を行うhook
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Kind, Result } from "@/services/result";
import { runtimeService } from "@/services/runtime";
import {
  DEFAULT_MAX_COUNT,
  DEFAULT_OPTIONS,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "./constants";
import {
  generateCacheKey,
  isCacheValid,
  withRetry,
  withTimeout,
} from "./helper";
import type {
  CacheEntry,
  LoadingState,
  ResultError,
  UseSearchResultsOptions,
  UseSearchResultsParams,
  UseSearchResultsReturn,
} from "./types";

/**
 * 検索結果の取得と管理を行うhook
 *
 * @description
 * このhookは以下の機能を提供します：
 * - 検索結果の取得
 * - キャッシュ機能（重複リクエスト防止）
 * - エラーハンドリング（タイムアウト、ネットワークエラー）
 * - リトライ機能（失敗時の自動再試行）
 * - ローディング状態の詳細管理（idle, loading, success, error）
 *
 * @param params - 検索パラメータ
 * @param options - オプション設定
 * @returns 検索結果と操作関数
 *
 * @example
 * ```tsx
 * const {
 *   results,
 *   loadingState,
 *   error,
 *   refresh,
 * } = useSearchResults(
 *   { query: "test", categories: ["Tab", "History"] },
 *   { enableCache: true, maxRetries: 3 }
 * );
 * ```
 */
export default function useSearchResults(
  params: UseSearchResultsParams,
  options: UseSearchResultsOptions = {},
): UseSearchResultsReturn {
  const maxCount = params.maxCount || DEFAULT_MAX_COUNT;

  const opts = useRef({ ...DEFAULT_OPTIONS, ...options }).current;

  const [results, setResults] = useState<Result<Kind>[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<ResultError | null>(null);

  // キャッシュ（Ref使用で再レンダリングを防ぐ）
  const cacheRef = useRef<Map<string, CacheEntry<Result<Kind>[]>>>(new Map());

  /**
   * 検索結果を取得（内部関数）
   */
  const fetchResults = useCallback(
    async (
      query: string | undefined,
      categories: Kind[],
    ): Promise<Result<Kind>[]> => {
      // キャッシュキー生成
      const cacheKey = generateCacheKey(query, categories);

      // キャッシュチェック
      if (opts.enableCache) {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && isCacheValid(cached, opts.cacheExpireMs)) {
          return cached.data;
        }
      }

      // API呼び出し
      const fetchFn = async () => {
        const results = await runtimeService.queryResults({
          filters: { query, categories, count: maxCount },
        });
        return results;
      };

      // タイムアウト + リトライ付き実行
      let fetchedResults: Result<Kind>[];

      if (opts.enableRetry) {
        fetchedResults = await withRetry(
          () => withTimeout(fetchFn(), opts.timeoutMs),
          opts.maxRetries,
          opts.retryDelayMs,
        );
      } else {
        fetchedResults = await withTimeout(fetchFn(), opts.timeoutMs);
      }

      // キャッシュに保存
      if (opts.enableCache) {
        cacheRef.current.set(cacheKey, {
          data: fetchedResults,
          timestamp: Date.now(),
          key: cacheKey,
        });
      }

      return fetchedResults;
    },
    [opts, maxCount],
  );

  /**
   * 検索を実行
   */
  const executeSearch = useCallback(async () => {
    setLoadingState("loading");
    setError(null);

    try {
      const results = await fetchResults(params.query, params.categories);
      setResults(results);
      setLoadingState("success");
    } catch (err) {
      const error = err as Error;
      let resultError: ResultError;

      if (error.message === "TIMEOUT") {
        resultError = {
          message: ERROR_MESSAGES.TIMEOUT,
          code: ERROR_CODES.TIMEOUT,
          originalError: err,
        };
      } else if (error.message.includes("MAX_RETRIES")) {
        resultError = {
          message: ERROR_MESSAGES.MAX_RETRIES,
          code: ERROR_CODES.MAX_RETRIES,
          originalError: err,
        };
      } else if (error.message.includes("network")) {
        resultError = {
          message: ERROR_MESSAGES.NETWORK,
          code: ERROR_CODES.NETWORK,
          originalError: err,
        };
      } else {
        resultError = {
          message: ERROR_MESSAGES.UNKNOWN,
          code: ERROR_CODES.UNKNOWN,
          originalError: err,
        };
      }

      setError(resultError);
      setLoadingState("error");
      console.error("Failed to fetch search results:", err);
    }
  }, [fetchResults, params.query, params.categories]);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * 再取得（キャッシュをクリアして再検索）
   */
  const refresh = useCallback(async () => {
    clearCache();
    await executeSearch();
  }, [clearCache, executeSearch]);

  /**
   * リトライ（エラー時に再実行）
   */
  const retry = useCallback(async () => {
    if (loadingState === "error") {
      await executeSearch();
    }
  }, [loadingState, executeSearch]);

  // パラメータ変更時に自動実行
  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  return {
    results,
    loadingState,
    loading: loadingState === "loading", // 後方互換性のため
    error,
    refresh,
    clearCache,
    retry,
  };
}
