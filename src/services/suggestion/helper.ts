/**
 * Suggestion Helper - 検索候補関連のヘルパー関数
 */

import type { SearchEngineValue } from "@/services/storage/types";
import type { Suggestion } from "./types";

/**
 * 結果数を制限する
 */
export const limitResults =
  (count?: number) =>
  (suggestions: Suggestion[]): Suggestion[] => {
    return count ? suggestions.slice(0, count) : suggestions;
  };

// サジェストAPIのURL。対応APIがないエンジンは空文字を返す
const SUGGEST_URLS: Record<SearchEngineValue, (q: string) => string> = {
  google: (q) => `https://www.google.com/complete/search?client=firefox&q=${q}`,
  bing: (q) => `https://api.bing.com/osjson.aspx?query=${q}`,
  duckduckgo: (q) => `https://ac.duckduckgo.com/ac/?q=${q}&type=list`,
  brave: (q) => `https://search.brave.com/api/suggest?q=${q}`,
  ecosia: (q) => `https://ac.ecosia.org/autocomplete?q=${q}&type=list`,
  yahoo_japan: (q) => `https://search.yahoo.co.jp/sugg/ss?p=${q}&output=json`,
  perplexity: () => "",
};

// 検索URLビルダー。エンジンごとにクエリパラメータ名が異なる場合に対応
const SEARCH_URLS: Record<SearchEngineValue, (q: string) => string> = {
  google: (q) => `https://www.google.com/search?q=${q}`,
  bing: (q) => `https://www.bing.com/search?q=${q}`,
  duckduckgo: (q) => `https://duckduckgo.com/?q=${q}`,
  brave: (q) => `https://search.brave.com/search?q=${q}`,
  ecosia: (q) => `https://www.ecosia.org/search?q=${q}`,
  yahoo_japan: (q) => `https://search.yahoo.co.jp/search?p=${q}`,
  perplexity: (q) => `https://www.perplexity.ai/search?q=${q}`,
};

/**
 * 検索エンジンのSuggest APIエンドポイントURLを構築。
 * 対応APIがないエンジンは空文字を返す。
 */
export const buildSuggestUrl = (
  query: string,
  engine: SearchEngineValue = "google",
): string => {
  const keyword = encodeURIComponent(query.trim());
  return SUGGEST_URLS[engine](keyword);
};

/**
 * 検索エンジンの検索URLを構築
 */
export const buildSearchUrl = (
  query: string,
  engine: SearchEngineValue = "google",
): string => {
  if (/^https?:\/\//i.test(query)) {
    return query;
  }
  return SEARCH_URLS[engine](encodeURIComponent(query));
};

/**
 * Yahoo Japan サジェストAPIレスポンスからサジェスチョンリストを抽出
 * レスポンス形式: {"Result":{"Query":"...","Hit":[{"Key":"..."},...]}}
 */
export const extractYahooJapanSuggestions = (data: unknown): string[] => {
  if (typeof data !== "object" || data === null || !("Result" in data)) {
    return [];
  }
  const result = (data as { Result: unknown }).Result;
  if (typeof result !== "object" || result === null || !("Hit" in result)) {
    return [];
  }
  const hit = (result as { Hit: unknown }).Hit;
  if (!Array.isArray(hit)) return [];
  return hit
    .filter(
      (h): h is { Key: string } =>
        typeof h === "object" &&
        h !== null &&
        "Key" in h &&
        typeof (h as { Key: unknown }).Key === "string",
    )
    .map((h) => h.Key);
};

/**
 * 標準 OpenSearch 形式からテキストを抽出
 * 形式: ["query", ["suggestion1", "suggestion2", ...]]
 */
export const extractSuggestions = (data: unknown): string[] => {
  if (!Array.isArray(data) || !Array.isArray(data[1])) return [];

  return (data[1] as unknown[]).filter(
    (s): s is string => typeof s === "string",
  );
};
