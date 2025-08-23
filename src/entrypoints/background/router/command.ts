import { MessageType } from "@/types/result";
import { ActionType } from "@/types/chrome";
import { openContent } from "@/function/chrome/open";

export const routeCommand = (command: string, _tab: chrome.tabs.Tab) => {
  switch (command) {
    case MessageType.OPEN_POPUP:
      openContent(ActionType.tabs);
      return true;
    case MessageType.CLOSE_POPUP:
      return true;
    default:
      return false;
  }
};
