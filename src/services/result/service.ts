/**
 * Result Service - Result管理サービス
 */

import type { ActionService } from "@/services/action/interface";
import type { BookmarkService } from "@/services/bookmark/interface";
import type { HistoryService } from "@/services/history/interface";
import type { StorageService } from "@/services/storage/interface";
import type { SuggestionService } from "@/services/suggestion/interface";
import type { TabService } from "@/services/tab/interface";
import resultServiceDependencies from "./container";
import * as Helper from "./helper";
import type { ResultService } from "./interface";
import { logger } from "./internal";
import type * as Type from "./types";

export type ResultServiceDependencies = {
  tabService: Pick<TabService, "query">;
  bookmarkService: Pick<BookmarkService, "query" | "getRecent">;
  historyService: Pick<HistoryService, "query">;
  suggestionService: Pick<SuggestionService, "multiEngineQuery">;
  actionService: Pick<ActionService, "isCalculation" | "calculate">;
  storageService: Pick<StorageService, "getSearchEngines">;
};

/** サービスのエクスポート */
export const createResultService = (
  deps: ResultServiceDependencies,
): ResultService => ({
  query: async (
    request: Type.QueryResultsInternalRequest,
  ): Promise<Type.Result<Type.Kind>[]> => {
    const { filters, signal } = request;

    const headResults: Type.Result<Type.Kind>[] = [];
    const queryPromises = [];

    const count = Helper.calSingleCount(
      filters.count,
      filters.categories.length,
    );

    if (filters.categories.includes("Tab")) {
      queryPromises.push(
        deps.tabService
          .query({
            query: filters?.query,
            option: { count, currentWindow: false },
          })
          .then((result) => ({ service: "Tab", data: result }) as const),
      );
    }

    if (filters.categories.includes("Bookmark")) {
      queryPromises.push(
        filters.query
          ? deps.bookmarkService
              .query({
                query: filters?.query ?? "",
                option: { count },
              })
              .then(
                (result) => ({ service: "Bookmark", data: result }) as const,
              )
          : deps.bookmarkService
              .getRecent({
                option: { count },
              })
              .then(
                (result) => ({ service: "Bookmark", data: result }) as const,
              ),
      );
    }

    if (filters.categories.includes("History")) {
      queryPromises.push(
        deps.historyService
          .query({
            query: filters?.query ?? "",
            count,
          })
          .then((result) => ({ service: "History", data: result }) as const),
      );
    }

    if (filters.categories.includes("Suggestion")) {
      const engines = filters.searchEngines?.length
        ? filters.searchEngines
        : await deps.storageService.getSearchEngines();
      queryPromises.push(
        deps.suggestionService
          .multiEngineQuery({
            query: filters?.query ?? "",
            searchEngines: engines,
            option: { count },
            signal,
          })
          .then((result) => ({ service: "Suggestion", data: result }) as const),
      );
    }

    if (filters.categories.includes("Action.Calculation") && filters?.query) {
      const isCalculation = deps.actionService.isCalculation(filters.query);

      if (isCalculation) {
        const action = deps.actionService.calculate({
          expression: filters.query,
        });
        headResults.push(action);
      }
    }

    const resultArrays = await Promise.allSettled(queryPromises);

    const results = resultArrays.reduce((acc, curr) => {
      if (curr.status === "rejected") {
        logger.error("Error querying results:", curr.reason);
        return acc;
      }

      acc.push(...curr.value.data);

      return acc;
    }, [] as Type.Result<Type.Kind>[]);

    const fusedResults = filters?.query
      ? Helper.fuseSearch(filters.query, results)
      : results;

    // headResultsを先頭に配置
    return [...headResults, ...fusedResults];
  },
});

export const resultService = createResultService(resultServiceDependencies);
