/**
 * Suggestion Service - マイクロサービス形式のGoogle検索候補管理サービス
 * 責任: Google検索候補の取得を担当
 */

import { convertSuggestions } from "./converter";
import { buildSuggestUrl, extractSuggestions, limitResults } from "./helper";
import type * as Type from "./types";

// 型定義
export interface SuggestionService {
  query: (request: Type.QuerySuggestionsRequest) => Promise<Type.Suggestion[]>;
}
const querySuggestions = async ({
  query,
  option,
}: Type.QuerySuggestionsRequest): Promise<Type.Suggestion[]> => {
  if (!query?.trim()) {
    return [];
  }

  try {
    const endpoint = buildSuggestUrl(query);
    const response = await fetch(endpoint, {
      // mode: "cors",
    });

    if (!response.ok) {
      console.error("Failed to fetch Google suggestions:", response.statusText);
      // エラー時は元のクエリのみ返す
      return [convertSuggestions(query, query)];
    }

    const text = await response.text();

    const match = text.match(/window\.google\.ac\.h\((\[.*?\])\)/);
    if (!match) {
      throw new Error("Invalid JSONP response format");
    }

    const data = JSON.parse(match[1]);
    const suggestions = extractSuggestions(data);

    const result = [
      convertSuggestions(query, query),
      ...suggestions.map((title) => convertSuggestions(title, query)),
    ];

    return limitResults(option?.count)(result) as Type.Suggestion[];
  } catch (error) {
    console.error("Error fetching Google suggestions:", error);
    // エラー時は元のクエリのみ返す
    return [convertSuggestions(query, query)];
  }
};

// サービスオブジェクトのエクスポート
export const suggestionService: SuggestionService = {
  query: querySuggestions,
};

// デフォルトエクスポート
export default suggestionService;
