/**
 * Suggestion Service - マイクロサービス形式のGoogle検索候補管理サービス
 * 責任: Google検索候補の取得を担当
 */

import { convertSuggestion } from "./converter";
import { buildSuggestUrl, extractSuggestions, limitResults } from "./helper";
import type * as Type from "./types";

// 型定義
export interface SuggestionService {
  query: (request: Type.QuerySuggestionsRequest) => Promise<Type.Suggestion[]>;
}

// サービス実装
const querySuggestions = async ({
  query,
  option,
}: Type.QuerySuggestionsRequest): Promise<Type.Suggestion[]> => {
  if (!query?.trim()) {
    return [];
  }

  try {
    const endpoint = buildSuggestUrl(query);
    const response = await fetch(endpoint, { mode: "cors" });

    if (!response.ok) {
      console.error("Failed to fetch Google suggestions:", response.statusText);
      // エラー時は元のクエリのみ返す
      return [convertSuggestion(query, query)];
    }

    const data = await response.json();
    const suggestions = extractSuggestions(data);

    // 元のクエリを最初に追加し、その後にサジェスチョンを追加
    const result = [
      convertSuggestion(query, query),
      ...suggestions.map((title) => convertSuggestion(title, query)),
    ];

    return limitResults(option?.count)(result);
  } catch (error) {
    console.error("Error fetching Google suggestions:", error);
    // エラー時は元のクエリのみ返す
    return [convertSuggestion(query, query)];
  }
};

// サービスオブジェクトのエクスポート
export const suggestionService: SuggestionService = {
  query: querySuggestions,
};

// デフォルトエクスポート
export default suggestionService;
