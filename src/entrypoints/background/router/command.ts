import { contentService } from "@/services/content";
import { MessageType } from "@/types/result";

export const routeCommand = (command: string, _tab: chrome.tabs.Tab) => {
  switch (command) {
    case MessageType.OPEN_POPUP:
      contentService.open();
      return true;
    case MessageType.CLOSE_POPUP:
      contentService.close();
      return true;
    default:
      return false;
  }
};
