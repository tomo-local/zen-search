import { BaseService } from "@/services/base";
import { MessageType } from "@/types/result";
import * as Type from "./tab.types";
import { TabConverter } from "./tab.converter";

/**
 * タブ関連の操作を担当するサービス
 */
export class TabService extends BaseService {
  async initialize(): Promise<void> {
    this.log("Tab service initialized");
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log("Tab service disposed");
    this.isInitialized = false;
  }

  /**
   * Chrome APIを使ってタブを検索する（utils/chrome.tsのactionQueryを統合）
   * @private
   */
  private async searchChromeTab(
    query: string,
    option: chrome.tabs.QueryInfo
  ): Promise<chrome.tabs.Tab[]> {
    const response = await chrome.tabs.query(option);

    if (!query) {
      return response;
    }

    return response.filter((tab) => {
      const title = tab.title || "";
      const url = tab.url ? new URL(tab.url).hostname : "";

      const isTitleMatch = title.toLowerCase().includes(query.toLowerCase());
      const isUrlMatch = url.toLowerCase().includes(query.toLowerCase());

      return isTitleMatch || isUrlMatch;
    }) as chrome.tabs.Tab[];
  }

  /**
   * タブクエリを実行してフォーマットする
   * @private
   */
  private async performTabQuery(request: Type.TabQueryRequest): Promise<Type.Tab[]> {
    const response = await this.searchChromeTab(request.query || "", {
      currentWindow: request.currentWindow,
    });

    const tabs = TabConverter.convertToTabs(response, request.query);

    return request.count ? tabs.slice(0, request.count) : tabs;
  }

  /**
   * タブを検索する
   */
  async query(request: Type.TabQueryRequest): Promise<{
    type: MessageType.QUERY_TAB;
    result: Type.Tab[];
  }> {
    try {
      const tabs = await this.performTabQuery(request);

      return {
        type: MessageType.QUERY_TAB,
        result: tabs,
      };
    } catch (error) {
      this.error("Failed to query tabs", error as Error);
      throw error;
    }
  }

  /**
   * 新しいタブを作成する
   */
  async create(request: Type.CreateTabRequest): Promise<{
    type: MessageType.CREATE_TAB;
    result: boolean;
  }> {
    try {
      await chrome.tabs.create({ url: request.url });

      return {
        type: MessageType.CREATE_TAB,
        result: true,
      };
    } catch (error) {
      this.error("Failed to create tab", error as Error);
      throw error;
    }
  }

  /**
   * タブを更新する（アクティブにして、ウィンドウにフォーカス）
   */
  async update(request: Type.UpdateTabRequest): Promise<{
    type: MessageType.UPDATE_TAB;
    result: boolean;
  }> {
    try {
      await chrome.tabs.update(request.tabId, { active: true });

      // Focus on the window
      if (request.windowId) {
        await chrome.windows.update(request.windowId, { focused: true });
      }

      return {
        type: MessageType.UPDATE_TAB,
        result: true,
      };
    } catch (error) {
      this.error("Failed to update tab", error as Error);
      throw error;
    }
  }

  /**
   * タブを削除する
   */
  async remove(request: Type.RemoveTabRequest): Promise<{
    type: MessageType.REMOVE_TAB;
    result: boolean;
  }> {
    try {
      await chrome.tabs.remove(request.tabId);

      return {
        type: MessageType.REMOVE_TAB,
        result: true,
      };
    } catch (error) {
      this.error("Failed to remove tab", error as Error);
      throw error;
    }
  }
}
