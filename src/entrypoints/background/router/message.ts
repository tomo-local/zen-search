import { contentService } from "@/services/content";
import { type QueryResultsRequest, resultService } from "@/services/result";
import { MessageType } from "@/services/runtime/types";
import {
  type CreateTabRequest,
  type RemoveTabRequest,
  tabService,
  type UpdateTabRequest,
} from "@/services/tab";

const {
  OPEN_POPUP,
  CREATE_TAB,
  UPDATE_TAB,
  REMOVE_TAB,
  QUERY_RESULT,
  SWITCH_VIEW_MODE,
} = MessageType;

function sendResponse(
  type: string,
  result: unknown,
  response: (res: object) => void,
) {
  response({ type, result });
}

type RouterMessage =
  | { type: MessageType.OPEN_POPUP }
  | { type: MessageType.SWITCH_VIEW_MODE }
  | ({ type: MessageType.CREATE_TAB } & CreateTabRequest)
  | ({ type: MessageType.UPDATE_TAB } & UpdateTabRequest)
  | ({ type: MessageType.REMOVE_TAB } & RemoveTabRequest)
  | ({ type: MessageType.QUERY_RESULT } & QueryResultsRequest);

const HANDLED_TYPES = new Set<string>([
  MessageType.OPEN_POPUP,
  MessageType.SWITCH_VIEW_MODE,
  MessageType.CREATE_TAB,
  MessageType.UPDATE_TAB,
  MessageType.REMOVE_TAB,
  MessageType.QUERY_RESULT,
]);

function isRouterMessage(msg: unknown): msg is RouterMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    "type" in msg &&
    HANDLED_TYPES.has((msg as { type: unknown }).type as string)
  );
}

export function routeMessage(
  message: unknown,
  _sender: chrome.runtime.MessageSender,
  response: (res?: object) => void,
): boolean {
  if (!isRouterMessage(message)) return false;

  switch (message.type) {
    case OPEN_POPUP:
      contentService.openTabs(contentService.open({}));
      return true;

    case CREATE_TAB: {
      const { url } = message;
      tabService.create({ url }).then(() => {
        sendResponse(CREATE_TAB, true, response);
      });
      return true;
    }
    case UPDATE_TAB: {
      const { tabId, windowId } = message;
      tabService.update({ tabId, windowId }).then(() => {
        sendResponse(UPDATE_TAB, true, response);
      });
      return true;
    }
    case REMOVE_TAB: {
      const { tabId } = message;
      tabService.remove({ tabId }).then(() => {
        sendResponse(REMOVE_TAB, true, response);
      });
      return true;
    }

    case QUERY_RESULT: {
      const { filters } = message;
      resultService
        .query({ filters })
        .then((results) => {
          sendResponse(QUERY_RESULT, results, response);
        })
        .catch((error) => {
          console.error("Error handling QUERY_RESULT:", error);
        });
      return true;
    }

    case SWITCH_VIEW_MODE: {
      // ユーザージェスチャートークンが有効なうちに同期的に呼ぶ
      chrome.action.openPopup().catch(console.error);
      sendResponse(SWITCH_VIEW_MODE, true, response);
      return true;
    }

    default: {
      const _exhaustive: never = message;
      return false;
    }
  }
}
