import { BaseService } from "@/services/base";
import { MessageType } from "@/types/result";
import * as Type from "./history.types";
import { convertToHistories } from "./converter";
import { normalizeHistoryQueryParams, filterValidHistoryItems } from "./history.utils";

/**
 * 履歴関連の操作を担当するサービス
 */
export class HistoryService extends BaseService {
  async initialize(): Promise<void> {
    this.log("History service initialized");
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log("History service disposed");
    this.isInitialized = false;
  }

  /**
   * Chrome APIを使って履歴を検索する
   * @private
   */
  private async searchChromeHistory(
    params: Type.HistoryQueryRequest
  ): Promise<chrome.history.HistoryItem[]> {
    const queryParams = normalizeHistoryQueryParams(params);
    const response = await chrome.history.search(queryParams);

    return filterValidHistoryItems(response);
  }

  /**
   * 履歴クエリを実行してフォーマットする
   * @private
   */
  private async performHistoryQuery(
    request: Type.HistoryQueryRequest
  ): Promise<Type.History[]> {
    const response = await this.searchChromeHistory(request);
    return convertToHistories(response, request.query);
  }

  /**
   * 履歴を検索する
   */
  async query(request: Type.HistoryQueryRequest): Promise<{
    type: MessageType.QUERY_HISTORY;
    result: Type.History[];
  }> {
    try {
      const histories = await this.performHistoryQuery(request);

      return {
        type: MessageType.QUERY_HISTORY,
        result: histories,
      };
    } catch (error) {
      this.error("Failed to query history", error as Error);
      throw error;
    }
  }
}
