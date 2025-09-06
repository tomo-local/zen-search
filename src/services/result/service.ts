/**
 * Result Service - Result管理サービス
 */

import type * as Type from "./types";

// 型定義
export interface ResultService {
  query: (
    request: Type.QueryResultsRequest
  ) => Promise<Type.Result<Type.Kind>[]>;
}

// サンプル実装
const queryResults = async (
  request: Type.QueryResultsRequest
): Promise<Type.Result<Type.Kind>[]> => {
  const results: Type.Result<Type.Kind>[] = [];
  const { filters } = request;

  if (filters.categories.includes("Tab")) {
    const item = {
      id: "1",
      type: "Tab",
      title: "Sample Tab Result",
      url: "https://example.com/tab",
    } as Type.Result<"Tab">;

    results.push(item);
  }

  if (filters.categories.includes("Bookmark")) {
    const item = {
      id: "2",
      type: "Bookmark",
      title: "Sample Bookmark Result",
      url: "https://example.com/bookmark",
    } as Type.Result<"Bookmark">;

    results.push(item);
  }

  if (filters.categories.includes("History")) {
    const item = {
      id: "3",
      type: "History",
      title: "Sample History Result",
      url: "https://example.com/history",
    } as Type.Result<"History">;

    results.push(item);
  }

  if (filters.categories.includes("Suggestion")) {
    const item = {
      id: "4",
      type: "Suggestion",
      title: "Sample Suggestion Result",
      url: "https://example.com/suggestion",
    } as Type.Result<"Suggestion">;

    results.push(item);
  }

  const query = filters.query ?? "";

  if (query && query.trim() !== "") {
    return results.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.url.toLowerCase().includes(query.toLowerCase())
    );
  }
  return results;
};

// サービスのエクスポート
export const resultService: ResultService = {
  query: queryResults,
};
