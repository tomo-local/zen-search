import { contentService } from "@/services/content";
import { type QueryResultsRequest, resultService } from "@/services/result";
import { MessageType } from "@/services/runtime/types";
import {
  type CreateTabRequest,
  type RemoveTabRequest,
  tabService,
  type UpdateTabRequest,
} from "@/services/tab";

const { OPEN_POPUP, CREATE_TAB, UPDATE_TAB, REMOVE_TAB, QUERY_RESULT } =
  MessageType;

function sendResponse(
  type: string,
  result: unknown,
  response: (res: object) => void,
) {
  response({ type, result });
}

type Message =
  | { type: "OPEN_POPUP" }
  | CreateTabRequest
  | UpdateTabRequest
  | RemoveTabRequest
  | QueryResultsRequest;

export function routeMessage(
  message: { type: MessageType } & Message,
  _sender: chrome.runtime.MessageSender,
  response: (res?: object) => void,
): boolean {
  switch (message.type) {
    case OPEN_POPUP:
      contentService.openTabs(contentService.open({}));
      return true;

    case CREATE_TAB: {
      const { url } = message as CreateTabRequest;
      tabService.create({ url }).then(() => {
        sendResponse(CREATE_TAB, true, response);
      });
      return true;
    }
    case UPDATE_TAB: {
      const { tabId, windowId } = message as UpdateTabRequest;
      tabService.update({ tabId, windowId }).then(() => {
        sendResponse(UPDATE_TAB, true, response);
      });
      return true;
    }
    case REMOVE_TAB: {
      const { tabId } = message as RemoveTabRequest;
      tabService.remove({ tabId }).then(() => {
        sendResponse(REMOVE_TAB, true, response);
      });
      return true;
    }

    case QUERY_RESULT: {
      const { filters } = message as QueryResultsRequest;
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

    default:
      // 未対応メッセージ
      return false;
  }
}
