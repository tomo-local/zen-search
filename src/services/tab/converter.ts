import { ResultType } from "@/types/result";
import * as Type from "./types";

/**
 * Chrome APIのタブデータを内部のタブ形式に変換する
 */
export const convertToTabs = (
  chromeTabs: chrome.tabs.Tab[],
  query?: string
): Type.Tab[] => {
  return chromeTabs.map((chromeTab) => {
    const tab: Type.Tab = {
      type: ResultType.Tab,
      id: chromeTab.id || 0,
      title: chromeTab.title || "",
      url: chromeTab.url || "",
      icon: chromeTab.favIconUrl || "",
      active: chromeTab.active || false,
      lastAccessed: chromeTab.lastAccessed || 0,
      windowId: chromeTab.windowId || 0,
      // TODO: 現在のウィンドウかどうかの判定ロジックが必要な場合
      currentWindow: false,
    };

    return tab;
  });
};
