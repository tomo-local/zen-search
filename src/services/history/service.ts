/**
 * History Service - マイクロサービス形式の履歴管理サービス
 * 責任: 履歴の検索
 */

import { DEFAULT_COUNT, defaultEndTime, defaultStartTime } from "./constant";
import { convertMultipleItemsToHistory } from "./converter";
import type * as Type from "./types";

export interface HistoryService {
  search(request: Type.SearchHistoryRequest): Promise<Type.History[]>;
}

const searchHistory = async ({
  query,
  startTime = defaultStartTime,
  endTime = defaultEndTime,
  count = DEFAULT_COUNT,
}: Type.SearchHistoryRequest): Promise<Type.History[]> => {
  const response = await chrome.history.search({
    text: query,
    startTime,
    endTime,
    maxResults: count,
  });

  return convertMultipleItemsToHistory(response);
};

export const createHistoryService = (): HistoryService => ({
  search: searchHistory,
});

export const historyService = createHistoryService();

export { searchHistory };
