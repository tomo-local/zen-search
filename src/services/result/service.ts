/**
 * Result Service - Result管理サービス
 */

import resultServiceDependencies from "./container";
import * as Helper from "./helper";
import type * as Type from "./types";

// 型定義
export interface ResultService {
  query: (
    request: Type.QueryResultsRequest
  ) => Promise<Type.Result<Type.Kind>[]>;
}

const queryResults = async (
  request: Type.QueryResultsRequest
): Promise<Type.Result<Type.Kind>[]> => {
  const { filters } = request;

  const queryPromises = [];

  const count = Helper.calSingleCount(filters.count, filters.categories.length);

  if (filters.categories.includes("Tab")) {
    queryPromises.push(
      resultServiceDependencies.tabService
        .query({
          query: filters?.query,
          option: { count, currentWindow: false },
        })
        .then((result) => ({ service: "Tab", data: result } as const))
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
            .then((result) => ({ service: "Bookmark", data: result } as const))
        : resultServiceDependencies.bookmarkService
            .getRecent({
              option: { count },
            })
            .then((result) => ({ service: "Bookmark", data: result } as const))
    );
  }

  if (filters.categories.includes("History")) {
    queryPromises.push(
      resultServiceDependencies.historyService
        .query({
          query: filters?.query ?? "",
          count,
        })
        .then((result) => ({ service: "History", data: result } as const))
    );
  }

  if (filters.categories.includes("Suggestion")) {
    queryPromises.push(
      resultServiceDependencies.suggestionService
        .query({
          query: filters?.query ?? "",
          option: { count },
        })
        .then((result) => ({ service: "Suggestion", data: result } as const))
    );
  }

  const resultArrays = await Promise.allSettled(queryPromises);

  const results = resultArrays.reduce((acc, curr) => {
    if (curr.status === "rejected") {
      console.error("Error querying results:", curr.reason);
      return acc;
    }

    acc.push(...curr.value.data);

    return acc;
  }, [] as Type.Result<Type.Kind>[]);

  return filters?.query ? Helper.fuseSearch(filters.query, results) : results;
};

/** サービスのエクスポート */
export const resultService: ResultService = {
  query: queryResults,
};
