/**
 * Tab Service - マイクロサービス形式のタブ管理サービス
 * 責任: タブの検索、作成、更新、削除を担当
 */

import { actionQuery } from "@/utils/chrome";
import { convertTabToResult } from "./converter";
import { limitResults, sortByLastAccessed } from "./helper";
import type * as Type from "./types";

// 型定義
export interface TabService {
  query: (request: Type.QueryRequest) => Promise<Type.Tab[]>;
  create: (request: Type.CreateRequest) => Promise<void>;
  update: (request: Type.UpdateRequest) => Promise<void>;
  remove: (request: Type.RemoveRequest) => Promise<void>;
}

// サービス実装
const queryTabs = async ({
  query,
  option,
}: Type.QueryRequest): Promise<Type.Tab[]> => {
  try {
    const response = await actionQuery(query, {
      currentWindow: option?.currentWindow,
    });

    const tabs = response
      .map((tab) => convertTabToResult(tab, option?.currentWindow ?? false))
      .sort(sortByLastAccessed);

    return limitResults(option?.count)(tabs);
  } catch (error) {
    console.error("Failed to query tabs:", error);
    throw new Error("タブの検索に失敗しました");
  }
};

const createTab = async ({ url }: Type.CreateRequest): Promise<void> => {
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
}: Type.UpdateRequest): Promise<void> => {
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

const removeTab = async ({ tabId }: Type.RemoveRequest): Promise<void> => {
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
