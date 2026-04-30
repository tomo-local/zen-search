import { contentService } from "@/services/content";
import { MessageType } from "@/services/runtime/types";
import type { ViewModeValue } from "@/services/storage/types";

export const routeCommand = (
  command: string,
  tab: chrome.tabs.Tab,
  viewMode: ViewModeValue,
) => {
  switch (command) {
    case MessageType.OPEN_POPUP: {
      // chrome.sidePanel.open() はユーザージェスチャートークンが必要なため、
      // await より前に同期的に呼び出す
      if (viewMode === "sidepanel" && tab.id) {
        chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);
      } else {
        contentService.open({}).then((res) => {
          if (!res.success) {
            chrome.runtime.sendMessage({ type: "CLOSE_POPUP" });
          }
        });
      }
      return true;
    }
    default:
      return false;
  }
};
