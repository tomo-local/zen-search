import {
  actionRuntimeContent,
  actionTabsContent,
  actionPopupContent,
} from "@/utils/chrome";
import { ActionType } from "@/types/chrome";
import { MessageType } from "@/types/result";

const openContent = async (type: ActionType) => {
  if (type === ActionType.runtime) {
    return actionRuntimeContent(MessageType.OPEN_POPUP);
  }

  if (type === ActionType.tabs) {
    return actionTabsContent(MessageType.OPEN_POPUP);
  }

  if (type === ActionType.popup) {
    return actionPopupContent();
  }
};

const closeContent = (type: ActionType) => {
  if (type === ActionType.runtime) {
    return actionRuntimeContent(MessageType.CLOSE_POPUP);
  }

  if (type === ActionType.tabs) {
    return actionTabsContent(MessageType.CLOSE_POPUP);
  }
};

export { openContent, closeContent };
