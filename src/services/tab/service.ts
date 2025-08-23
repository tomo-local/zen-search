/**
 * Tab Service - マイクロサービス形式のタブ管理サービス
 * 責任: タブの検索、作成、更新、削除を担当
 */

import { convertTabToResult } from "./converter";
import { limitResults, queryFiltered, sortByLastAccessed } from "./helper";
import type * as Type from "./types";

// 型定義
export interface TabService {
  query: (request: Type.QueryTabsRequest) => Promise<Type.Tab[]>;
  create: (request: Type.CreateTabRequest) => Promise<void>;
  update: (request: Type.UpdateTabRequest) => Promise<void>;
  remove: (request: Type.RemoveTabRequest) => Promise<void>;
}

// サービス実装
const queryTabs = async ({
  query,
  option,
}: Type.QueryTabsRequest): Promise<Type.Tab[]> => {
  try {
    const response = await chrome.tabs.query({
      currentWindow: option?.currentWindow,
    });

    const tabs = queryFiltered(response, query)
      .map((tab) => convertTabToResult(tab, option?.currentWindow ?? false))
      .sort(sortByLastAccessed);

    return limitResults(option?.count)(tabs);
  } catch (error) {
    console.error("Failed to query tabs:", error);
    throw new Error("タブの検索に失敗しました");
  }
};

const createTab = async ({ url }: Type.CreateTabRequest): Promise<void> => {
  try {
    await chrome.tabs.create({ url });
  } catch (error) {
    console.error("Failed to create tab:", error);
    throw new Error("タブの作成に失敗しました");
  }
};

const updateTab = async ({
  tabId,
  windowId,
}: Type.UpdateTabRequest): Promise<void> => {
  try {
    await chrome.tabs.update(tabId, { active: true });

    // Focus on the window
    if (windowId) {
      await chrome.windows.update(windowId, { focused: true });
    }
  } catch (error) {
    console.error("Failed to update tab:", error);
    throw new Error("タブの更新に失敗しました");
  }
};

const removeTab = async ({ tabId }: Type.RemoveTabRequest): Promise<void> => {
  try {
    await chrome.tabs.remove(tabId);
  } catch (error) {
    console.error("Failed to remove tab:", error);
    throw new Error("タブの削除に失敗しました");
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

// 個別エクスポート（後方互換性のため）
export { queryTabs, createTab, updateTab, removeTab };
