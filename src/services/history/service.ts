/**
 * History Service - マイクロサービス形式の履歴管理サービス
 * 責任: 履歴の検索
 */

import { DEFAULT_COUNT } from "./constant";
import { convertMultipleItemsToHistory } from "./converter";
import type * as Type from "./types";

export interface HistoryService {
  search(request: Type.SearchHistoryRequest): Promise<Type.History[]>;
}

const searchHistory = async ({
  query,
  startTime,
  endTime,
  count = DEFAULT_COUNT,
}: Type.SearchHistoryRequest): Promise<Type.History[]> => {
  try {
    const response = await chrome.history.search({
      text: query,
      startTime,
      endTime,
      maxResults: count,
    });

    return convertMultipleItemsToHistory(response);
  } catch (error) {
    console.error("Failed to search history:", error);
    throw new Error("履歴の検索に失敗しました");
  }
};

export const createHistoryService = (): HistoryService => ({
  search: searchHistory,
});

export const historyService = createHistoryService();

export { searchHistory };
