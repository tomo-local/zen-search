/**
 * 検索クエリと状態を管理するhook
 */

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { categoriesMap, initialState } from "./constants";
import { matchType } from "./helper";
import { queryReducer } from "./reducer";
import {
  clearQueryHistory as clearStorageHistory,
  loadQueryHistory,
  saveQueryHistory,
} from "./storage";
import type { ResultType, UseSearchOptions, ValidationResult } from "./types";

/**
 * 検索クエリと状態を管理するhook
 *
 * @description
 * このhookは以下の機能を提供します：
 * - クエリの入力と管理
 * - デバウンス処理
 * - タイプ（All/Tab/History等）の切り替え
 * - サジェスション機能
 * - クエリ履歴の保存・読み込み
 * - バリデーション（最大文字数、自動トリム）
 *
 * @param options - オプション設定
 * @returns 検索状態と操作関数
 *
 * @example
 * ```tsx
 * const {
 *   state: { query, type, suggestion },
 *   debouncedQuery,
 *   setQuery,
 *   updateType,
 *   queryHistory,
 * } = useSearch({ debounceMs: 300 });
 * ```
 */
export default function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 200,
    maxQueryLength = 500,
    maxHistorySize = 10,
    autoTrim = true,
    similarityThreshold = 0.6,
  } = options;

  const [state, dispatch] = useReducer(queryReducer, initialState);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);

  // クエリ履歴の読み込み
  useEffect(() => {
    loadQueryHistory().then(setQueryHistory);
  }, []);

  // デバウンス処理
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(state.query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [state.query, debounceMs]);

  // サジェスション判定
  useEffect(() => {
    if (state.type === "All" && state.query) {
      const suggestion = matchType(state.query, similarityThreshold);
      if (suggestion !== state.suggestion) {
        dispatch({ type: "suggestion", value: suggestion });
      }
    } else if (state.suggestion !== null) {
      dispatch({ type: "suggestion", value: null });
    }
  }, [state.query, state.type, state.suggestion, similarityThreshold]);

  /**
   * クエリを更新
   * @param rawQuery - 入力されたクエリ
   */
  const setQuery = useCallback(
    (rawQuery: string) => {
      // 自動トリム
      let processedQuery = autoTrim ? rawQuery.trim() : rawQuery;

      // 最大文字数チェック
      if (processedQuery.length > maxQueryLength) {
        processedQuery = processedQuery.slice(0, maxQueryLength);
      }

      dispatch({ type: "query", value: processedQuery });
    },
    [autoTrim, maxQueryLength],
  );

  /**
   * タイプを更新
   * @param type - 新しいタイプ
   */
  const updateType = useCallback((type: ResultType) => {
    dispatch({ type: "type", value: type });
  }, []);

  /**
   * カテゴリを更新
   * @param type - タイプに基づいてカテゴリを設定
   */
  const updateCategory = useCallback((type: ResultType) => {
    const categories = categoriesMap[type];
    dispatch({ type: "category", value: categories });
  }, []);

  /**
   * タイプをリセット
   */
  const reset = useCallback(() => {
    dispatch({ type: "resetType" });
  }, []);

  /**
   * クエリ履歴に追加して保存
   * @param query - 保存するクエリ
   */
  const addToHistory = useCallback(
    async (query: string) => {
      if (!query || query.length === 0) {
        return;
      }

      const trimmedQuery = query.trim();
      if (trimmedQuery.length === 0) {
        return;
      }

      setQueryHistory((prev) => {
        // 重複を削除
        const filtered = prev.filter((q) => q !== trimmedQuery);
        // 先頭に追加
        const newHistory = [trimmedQuery, ...filtered].slice(0, maxHistorySize);

        // ストレージに保存（非同期）
        saveQueryHistory(newHistory);

        return newHistory;
      });
    },
    [maxHistorySize],
  );

  /**
   * クエリ履歴をクリア
   */
  const clearHistory = useCallback(async () => {
    setQueryHistory([]);
    await clearStorageHistory();
  }, []);

  /**
   * クエリのバリデーション結果
   */
  const validation = useMemo<ValidationResult>(() => {
    const errors: string[] = [];

    if (state.query.length > maxQueryLength) {
      errors.push(`Query exceeds maximum length of ${maxQueryLength}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [state.query, maxQueryLength]);

  return {
    /** 現在の検索状態 */
    state,
    /** デバウンス後のクエリ */
    debouncedQuery,
    /** クエリ履歴 */
    queryHistory,
    /** IME入力中かどうか */
    isComposing,
    /** バリデーション結果 */
    validation,
    /** クエリを設定 */
    setQuery,
    /** タイプを更新 */
    updateType,
    /** カテゴリを更新 */
    updateCategory,
    /** タイプをリセット */
    reset,
    /** 履歴に追加 */
    addToHistory,
    /** 履歴をクリア */
    clearHistory,
    /** IME状態を設定 */
    setIsComposing,
  };
}
