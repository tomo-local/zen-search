import { contentService } from "@/services/content";
import { MessageType } from "@/services/runtime/types";
import { storageService } from "@/services/storage";

export const routeCommand = async (command: string, tab: chrome.tabs.Tab) => {
  switch (command) {
    case MessageType.OPEN_POPUP: {
      const viewMode = await storageService.getViewMode();
      if (viewMode === "sidepanel" && tab.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
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
