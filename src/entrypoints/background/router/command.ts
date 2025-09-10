import { contentService } from "@/services/content";
import { MessageType } from "@/services/runtime/types";

export const routeCommand = (command: string, _tab: chrome.tabs.Tab) => {
  switch (command) {
    case MessageType.OPEN_POPUP: {
      contentService.open({}).then((res) => {
        if (!res.success) {
          chrome.runtime.sendMessage({ type: "CLOSE_POPUP" });
        }
      });
      return true;
    }
    default:
      return false;
  }
};
