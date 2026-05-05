/**
 * Tab Service - マイクロサービス形式のタブ管理サービス
 * 責任: タブの検索、作成、更新、削除を担当
 */

import { convertNewTabToData } from "./converter";
import { TabServiceError, toError } from "./error";
import { limitResults } from "./helper";
import type TabService from "./interface";
import { createTabLogger } from "./logger";
import type * as Type from "./types";

const logger = createTabLogger();

const queryTabs = async ({
  option,
}: Type.QueryTabsRequest): Promise<Type.Tab[]> => {
  try {
    const response = await chrome.tabs.query({});

    const tabs = response
      .map(convertNewTabToData)
      .sort((a, b) => b.data.lastAccessed - a.data.lastAccessed);

    logger.info(`Queried tabs: ${tabs.length} tabs found`, {
      payload: { option },
      count: tabs.length,
    });

    return limitResults(option?.count)(tabs);
  } catch (error) {
    logger.error("Failed to newQuery tabs:", error, { payload: { option } });
    throw new TabServiceError("タブの検索に失敗しました", toError(error));
  }
};

const createTab = async ({ url }: Type.CreateTabRequest): Promise<void> => {
  try {
    logger.info(`Creating tab with URL: ${url}`);
    await chrome.tabs.create({ url });
  } catch (error) {
    logger.error("Failed to create tab:", error, { payload: { url } });
    throw new TabServiceError("タブの作成に失敗しました", toError(error));
  }
};

const updateTab = async ({
  tabId,
  windowId,
}: Type.UpdateTabRequest): Promise<void> => {
  try {
    logger.info(`Updating tab with ID: ${tabId}`);
    await chrome.tabs.update(tabId, { active: true });

    // Focus on the window
    if (windowId) {
      await chrome.windows.update(windowId, { focused: true });
    }
  } catch (error) {
    logger.error("Failed to update tab:", error, {
      payload: { tabId, windowId },
    });
    throw new TabServiceError("タブの更新に失敗しました", toError(error));
  }
};

const removeTab = async ({ tabId }: Type.RemoveTabRequest): Promise<void> => {
  try {
    logger.info(`Removing tab with ID: ${tabId}`);
    await chrome.tabs.remove(tabId);
  } catch (error) {
    logger.error("Failed to remove tab:", error, { payload: { tabId } });
    throw new TabServiceError("タブの削除に失敗しました", toError(error));
  }
};

// サービスファクトリー（依存性注入対応）
export const createTabService = (): TabService => ({
  query: queryTabs,
  create: createTab,
  update: updateTab,
  remove: removeTab,
});

// デフォルトサービスインスタンス
export const tabService = createTabService();
