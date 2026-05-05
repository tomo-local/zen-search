/**
 * History Service - マイクロサービス形式の履歴管理サービス
 * 責任: 履歴の検索
 */

import { DEFAULT_COUNT } from "./constant";
import { convertItemToHistory } from "./converter";
import { HistoryServiceError, toError } from "./error";
import type { HistoryService } from "./interface";
import { createHistoryLogger } from "./logger";
import type * as Type from "./types";

const logger = createHistoryLogger();

const queryHistory = async ({
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

    return response.map((item) => convertItemToHistory(item));
  } catch (error) {
    logger.error("Failed to query history:", error, {
      payload: { query, count },
    });
    throw new HistoryServiceError("Failed to query history", toError(error));
  }
};

export const createHistoryService = (): HistoryService => ({
  query: queryHistory,
});

export const historyService = createHistoryService();
