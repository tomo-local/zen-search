import { bookmarkService } from "@/services/bookmark";
import { contentService } from "@/services/content";
import { get30DaysAgo, getNow, historyService } from "@/services/history";
import { runtimeService } from "@/services/runtime";
import { tabService } from "@/services/tab/service";

import type {
  CreateMessage,
  QueryMessage,
  RemoveMessage,
  UpdateMessage,
} from "@/types/chrome";
import { MessageType } from "@/types/result";

const {
  OPEN_POPUP,
  CLOSE_POPUP,
  QUERY_TAB,
  CREATE_TAB,
  UPDATE_TAB,
  REMOVE_TAB,
  QUERY_HISTORY,
  QUERY_BOOKMARK,
} = MessageType;

function sendResponse(
  type: string,
  result: unknown,
  response: (res: object) => void
) {
  response({ type, result });
}

export function routeMessage(
  message: { type: string },
  _sender: chrome.runtime.MessageSender,
  response: (res?: object) => void
): boolean {
  switch (message.type) {
    case OPEN_POPUP:
    case CLOSE_POPUP:
      contentService.openTabs(contentService.open());
      return true;

    case QUERY_TAB: {
      const { query, count } = message as QueryMessage;
      tabService.query({ query, option: { count } }).then((tabs) => {
        sendResponse(QUERY_TAB, tabs, response);
      });
      return true;
    }
    case CREATE_TAB: {
      const { url } = message as CreateMessage;
      tabService.create({ url }).then(() => {
        sendResponse(CREATE_TAB, true, response);
      });
      return true;
    }
    case UPDATE_TAB: {
      const { tabId, windowId } = message as UpdateMessage;
      tabService.update({ tabId, windowId }).then(() => {
        sendResponse(UPDATE_TAB, true, response);
      });
      return true;
    }
    case REMOVE_TAB: {
      const { tabId } = message as RemoveMessage;
      tabService.remove({ tabId }).then(() => {
        sendResponse(REMOVE_TAB, true, response);
      });
      return true;
    }
    case QUERY_HISTORY: {
      const { query } = message as QueryMessage;

      const end = getNow();
      const start = get30DaysAgo(end);

      historyService
        .search({ query, startTime: start.getTime(), endTime: end.getTime() })
        .then((history) => {
          sendResponse(QUERY_HISTORY, history, response);
        });
      return true;
    }
    case QUERY_BOOKMARK: {
      const { query } = message as QueryMessage;
      bookmarkService.query({ query }).then((bookmarks) => {
        sendResponse(QUERY_BOOKMARK, bookmarks, response);
      });
      return true;
    }

    default:
      // 未対応メッセージ
      return false;
  }
}
