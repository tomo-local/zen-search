/**
 * Result Service - Result管理サービス
 */

import type * as Type from "./types";

// 型定義
export interface ResultService {
  query: (
    request: Type.QueryResultsRequest,
  ) => Promise<Type.Result<Type.Kind>[]>;
}

// サンプル実装
const queryResults = async (
  request: Type.QueryResultsRequest,
): Promise<Type.Result<Type.Kind>[]> => {
  const results: Type.Result<Type.Kind>[] = [];
  const { filters } = request;

  if (filters.categories.includes("Bookmark")) {
    const item = {
      id: "2",
      type: "Bookmark",
      title: "Sample Bookmark Result",
      url: "https://example.com/bookmark",
      data: {
        id: "2",
        title: "Sample Bookmark Result",
        url: "https://example.com/bookmark",
        data: {
          dateAdded: Date.now(),
          parentId: "0",
          unmodifiable: undefined,
          dateGroupModified: undefined,
        },
      },
    } as Type.Result<"Bookmark">;

    results.push(item);
  }

  if (filters.categories.includes("History")) {
    const item = {
      id: "3",
      type: "History",
      title: "Sample History Result",
      url: "https://example.com/history",
      data: {
        id: "3",
        title: "Sample History Result",
        url: "https://example.com/history",
        data: {
          lastVisitTime: Date.now(),
          typedCount: 1,
          visitCount: 5,
        },
      },
    } as Type.Result<"History">;

    results.push(item);
  }

  if (filters.categories.includes("Suggestion")) {
    const item = {
      id: "4",
      type: "Suggestion",
      title: "Sample Suggestion Result",
      url: "https://example.com/suggestion",
      data: {
        id: "4",
        title: "Sample Suggestion Result",
        url: "https://example.com/suggestion",
        data: {},
      },
    } as Type.Result<"Suggestion">;

    results.push(item);
  }

  const query = filters.query ?? "";

  if (query && query.trim() !== "") {
    return results.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.url.toLowerCase().includes(query.toLowerCase()),
    );
  }
  return results;
};

// サービスのエクスポート
export const resultService: ResultService = {
  query: queryResults,
};
