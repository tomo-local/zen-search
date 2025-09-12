/**
 * Suggestion Converter - Google APIレスポンスをSuggestion型に変換
 */

import type { Suggestion } from "./types";

const SEARCH_URL = "https://www.google.com/search";

export function convertNewSuggestions(
  suggestion: string,
  originalQuery: string,
): Suggestion {
  return {
    data: {
      type: "Google",
      suggestion: suggestion,
      title: suggestion,
      url: createSearchUrl(suggestion),
      query: originalQuery,
    },
  };
}

/**
 * 検索URLを作成（URLの場合はそのまま、検索クエリの場合はGoogle検索URL）
 */
function createSearchUrl(query: string): string {
  if (/^https?:\/\//i.test(query)) {
    return query;
  }

  return `${SEARCH_URL}?q=${encodeURIComponent(query)}`;
}
