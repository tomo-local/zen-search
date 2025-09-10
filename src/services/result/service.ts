/**
 * Result Service - Result管理サービス
 */

import resultServiceDependencies from "./container";
import * as converter from "./converter";
import * as Helper from "./helper";
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
  const { filters } = request;

  const queryPromises = [];

  const count = Helper.calSingleCount(filters.count, filters.categories.length);

  if (filters.categories.includes("Tab")) {
    queryPromises.push(
      resultServiceDependencies.tabService
        .queryNew({
          query: filters?.query,
          option: { count, currentWindow: false },
        })
        .then((result) => ({ service: "Tab", data: result }) as const),
    );
  }

  if (filters.categories.includes("Bookmark")) {
    queryPromises.push(
      filters.query
        ? resultServiceDependencies.bookmarkService
            .query({
              query: filters?.query ?? "",
              option: { count },
            })
            .then((result) => ({ service: "Bookmark", data: result }) as const)
        : resultServiceDependencies.bookmarkService
            .getRecentNew({
              option: { count },
            })
            .then((result) => ({ service: "Bookmark", data: result }) as const),
    );
  }

  if (filters.categories.includes("History")) {
    queryPromises.push(
      resultServiceDependencies.historyService
        .query({
          query: filters?.query ?? "",
          count,
        })
        .then((result) => ({ service: "History", data: result }) as const),
    );
  }

  if (filters.categories.includes("Suggestion")) {
    queryPromises.push(
      resultServiceDependencies.suggestionService
        .queryNew({
          query: filters?.query ?? "",
          option: { count },
        })
        .then((result) => ({ service: "Suggestion", data: result }) as const),
    );
  }

  const resultArrays = await Promise.all(queryPromises);

  const results = resultArrays.reduce((acc, curr) => {
    switch (curr.service) {
      case "Tab":
        acc.push(...converter.convertMultipleTabsToResult(curr.data));
        break;
      case "Bookmark":
        acc.push(...converter.convertMultipleBookmarksToResult(curr.data));
        break;
      case "History":
        acc.push(...converter.convertMultipleHistoriesToResult(curr.data));
        break;
      case "Suggestion":
        acc.push(...converter.convertMultipleSuggestionsToResult(curr.data));
        break;
    }
    return acc;
  }, [] as Type.Result<Type.Kind>[]);

  return results;
};

// サービスのエクスポート
export const resultService: ResultService = {
  query: queryResults,
};
