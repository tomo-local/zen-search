/**
 * Suggestion Helper - Google検索候補関連のヘルパー関数
 */

import type { NewSuggestion, Suggestion } from "./types";

/**
 * 結果数を制限する
 */
export const limitResults =
  (count?: number) =>
  (
    suggestions: (Suggestion | NewSuggestion)[],
  ): (Suggestion | NewSuggestion)[] => {
    return count ? suggestions.slice(0, count) : suggestions;
  };

/**
 * Google Suggest APIのエンドポイントURLを構築
 */
export const buildSuggestUrl = (query: string): string => {
  const keyword = encodeURIComponent(query.trim());
  return `https://www.google.com/complete/search?client=chrome&q=${keyword}`;
};

/**
 * APIレスポンスからサジェスチョンリストを抽出
 */
export const extractSuggestions = (data: unknown): string[] => {
  if (!Array.isArray(data) || !Array.isArray(data[1])) {
    return [];
  }
  return data[1] as string[];
};
