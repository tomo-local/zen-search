import { actionQuery } from "@/utils/chrome";
import {
  Tab,
  QueryOption,
  CreateMessage,
  UpdateMessage,
  RemoveMessage,
} from "@/types/chrome";
import { ResultType } from "@/types/result";
import { calcMatchRateResult } from "@/utils/match";

const queryTabs = async (query: string, option: QueryOption) => {
  const response = await actionQuery(query, {
    currentWindow: option.currentWindow,
  });

  const tabs = response
    .map((tab) => {
      return {
        type: ResultType.Tab,
        id: tab.id,
        title: tab.title || "",
        url: tab.url || "",
        icon: tab.favIconUrl || "",
        active: tab.active || false,
        lastAccessed: tab.lastAccessed || 0,
        windowId: tab.windowId || 0,
        match: calcMatchRateResult(query, tab.title, tab.url),
      } as Tab;
    })
    .sort((a, b) => b.lastAccessed - a.lastAccessed);

  return option.count ? tabs.slice(0, option.count) : tabs;
};

const createTab = async ({ url }: Omit<CreateMessage, "type">) => {
  await chrome.tabs.create({ url });
};

const updateTab = async ({ tabId, windowId }: Omit<UpdateMessage, "type">) => {
  await chrome.tabs.update(tabId, { active: true });

  // Focus on the window
  if (windowId) {
    await chrome.windows.update(windowId, { focused: true });
  }
};

const removeTab = async ({ tabId }: Omit<RemoveMessage, "type">) =>
  await chrome.tabs.remove(tabId);

export { queryTabs, createTab, updateTab, removeTab };
