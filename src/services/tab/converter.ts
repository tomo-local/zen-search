/**
 * Tab Converter - タブデータの変換を担当
 * 責任: chrome.tabs.Tab → Tab への変換ロジック
 */

import type { Tab } from "./types";

export const convertNewTabToData = (newTab: chrome.tabs.Tab): Tab => ({
  data: {
    ...newTab,
    id: newTab.id ?? 0,
    lastAccessed: newTab.lastAccessed ?? 0,
  },
});
