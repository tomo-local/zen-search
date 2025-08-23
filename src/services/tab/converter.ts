/**
 * Tab Converter - タブデータの変換を担当
 * 責任: chrome.tabs.Tab → Tab への変換ロジック
 */

import { ResultType } from "@/types/result";
import type { Tab, TabData } from "./types";

// Chrome Tab から アプリ用 Tab への変換
export const convertTabToResult = (
  tab: chrome.tabs.Tab,
  currentWindow: boolean,
): Tab => ({
  type: ResultType.Tab,
  id: tab.id ?? 0,
  title: tab.title ?? "",
  url: tab.url ?? "",
  data: convertTabToData(tab, currentWindow),
});

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

// 複数タブの変換（バッチ処理用）
export const convertMultipleTabsToResult = (
  tabs: chrome.tabs.Tab[],
  currentWindow: boolean,
): Tab[] => {
  return tabs.map((tab) => convertTabToResult(tab, currentWindow));
};

// デフォルトタブオブジェクトの作成（テスト用やフォールバック用）
export const createDefaultTab = (overrides: Partial<Tab> = {}): Tab => ({
  type: ResultType.Tab,
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
