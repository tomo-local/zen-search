/**
 * Tab Converter - タブデータの変換を担当
 * 責任: chrome.tabs.Tab → Tab への変換ロジック
 */

import type { NewTab, Tab, TabData } from "./types";

// TODO:削除予定
export const convertTabToResult = (
  tab: chrome.tabs.Tab,
  currentWindow: boolean,
): Tab => ({
  type: "Tab",
  id: tab.id ?? 0,
  title: tab.title ?? "",
  url: tab.url ?? "",
  data: convertTabToData(tab, currentWindow),
});

// TODO:削除予定
export const convertTabToData = (
  tab: chrome.tabs.Tab,
  currentWindow?: boolean,
): TabData => ({
  icon: tab.favIconUrl ?? "",
  active: tab.active ?? false,
  lastAccessed: tab.lastAccessed ?? 0,
  windowId: tab.windowId ?? 0,
  currentWindow: currentWindow ?? false,
});

// TODO:削除予定
export const convertMultipleTabsToResult = (
  tabs: chrome.tabs.Tab[],
  currentWindow: boolean,
): Tab[] => {
  return tabs.map((tab) => convertTabToResult(tab, currentWindow));
};

export const convertNewTabToData = (newTab: chrome.tabs.Tab): NewTab => ({
  data: {
    ...newTab,
    id: newTab.id ?? 0,
    lastAccessed: newTab.lastAccessed ?? 0,
  },
});

// デフォルトタブオブジェクトの作成（テスト用やフォールバック用）
export const createDefaultTab = (overrides: Partial<Tab> = {}): Tab => ({
  type: "Tab",
  id: 0,
  title: "",
  url: "",
  data: {
    icon: "",
    active: false,
    lastAccessed: 0,
    windowId: 0,
    currentWindow: false,
  },
  ...overrides,
});
