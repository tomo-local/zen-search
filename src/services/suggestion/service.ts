/**
 * Suggestion Service - 検索候補管理サービス
 * 責任: 各検索エンジンの候補取得を担当
 */

import type { SearchEngineValue } from "@/services/storage/types";
import { convertSuggestions } from "./converter";
import {
  buildSearchUrl,
  buildSuggestUrl,
  extractSuggestions,
  extractYahooJapanSuggestions,
  limitResults,
} from "./helper";
import type * as Type from "./types";

// 型定義
export interface SuggestionService {
  query: (request: Type.QuerySuggestionsRequest) => Promise<Type.Suggestion[]>;
  multiEngineQuery: (
    request: Type.MultiEngineQuerySuggestionsRequest,
  ) => Promise<Type.Suggestion[]>;
}

/**
 * 検索エンジン API からサジェストテキストのみを取得する。
 * 失敗した場合は空配列を返す（raw query のフォールバックは含まない）。
 */
const fetchApiSuggestions = async (
  query: string,
  engine: SearchEngineValue,
): Promise<string[]> => {
  const endpoint = buildSuggestUrl(query, engine);
  if (!endpoint) return [];

  try {
    const response = await fetch(endpoint);

    if (!response.ok) return [];

    const text = await response.text();

    if (engine === "yahoo_japan") {
      return extractYahooJapanSuggestions(JSON.parse(text));
    }

    // Google (client=firefox) および Bing・DDG 等はすべて
    // ["query", ["s1", "s2", ...]] の plain JSON 形式
    return extractSuggestions(JSON.parse(text));
  } catch {
    console.error("Error fetching suggestions:", { query, engine, endpoint });

    return [];
  }
};

/**
 * クエリをそのまま「直接検索」するサジェストアイテムを生成する。
 * URL はそのエンジンの検索 URL。
 */
const buildDirectSearch = (
  query: string,
  engine: SearchEngineValue,
): Type.Suggestion => {
  const url = buildSearchUrl(query, engine);

  return {
    id: crypto.randomUUID(),
    type: "Suggestion",
    title: query,
    url,
    data: convertSuggestions(query, query, engine).data,
  };
};

/**
 * 単一エンジン向けクエリ: 直接検索 + API サジェスト
 */
const querySuggestions = async ({
  query,
  option,
  searchEngine = "google",
}: Type.QuerySuggestionsRequest): Promise<Type.Suggestion[]> => {
  if (!query?.trim()) return [];

  const texts = await fetchApiSuggestions(query, searchEngine);

  const result = [
    buildDirectSearch(query, searchEngine),
    ...texts.map((title) => convertSuggestions(title, query, searchEngine)),
  ];
  return limitResults(option?.count)(result) as Type.Suggestion[];
};

/**
 * 複数エンジン向けクエリ:
 * - 直接検索アイテムを各エンジン分生成（URL が異なるため重複排除しない）
 * - API サジェストはエンジン横断でタイトル重複排除して結合
 */
const multiEngineQuerySuggestions = async ({
  query,
  option,
  searchEngines,
}: Type.MultiEngineQuerySuggestionsRequest): Promise<Type.Suggestion[]> => {
  if (!query?.trim()) return [];

  const directSearchItems = searchEngines.map((e) =>
    buildDirectSearch(query, e),
  );

  const apiResultsPerEngine = await Promise.all(
    searchEngines.map((e) => fetchApiSuggestions(query, e)),
  );

  const seenTitles = new Set<string>([query]); // 直接検索と同タイトルは除外
  const apiSuggestions: Type.Suggestion[] = [];
  for (const [i, texts] of apiResultsPerEngine.entries()) {
    const engine = searchEngines[i];
    for (const title of texts) {
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        apiSuggestions.push(convertSuggestions(title, query, engine));
      }
    }
  }

  return limitResults(option?.count)([
    ...directSearchItems,
    ...apiSuggestions,
  ]) as Type.Suggestion[];
};

// サービスオブジェクトのエクスポート
export const suggestionService: SuggestionService = {
  query: querySuggestions,
  multiEngineQuery: multiEngineQuerySuggestions,
};

// デフォルトエクスポート
export default suggestionService;
