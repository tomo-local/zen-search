import { queryBookmarks } from "@/function/chrome/bookmark";
import { queryHistory } from "@/function/chrome/history";
import { openContent } from "@/function/chrome/open";
import { queryTabs, removeTab, updateTab } from "@/function/chrome/tab";
import {
  ActionType,
  type CreateMessage,
  type QueryMessage,
  type RemoveMessage,
  type UpdateMessage,
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
  response: (res: object) => void,
) {
  response({ type, result });
}

export function routeMessage(
  message: { type: string },
  _sender: chrome.runtime.MessageSender,
  response: (res?: object) => void,
): boolean {
  switch (message.type) {
    case OPEN_POPUP:
    case CLOSE_POPUP:
      openContent(ActionType.tabs);
      return true;

    case QUERY_TAB: {
      const { query, count } = message as QueryMessage;
      queryTabs(query, { count }).then((tabs) => {
        sendResponse(QUERY_TAB, tabs, response);
      });
      return true;
    }
    case CREATE_TAB: {
      const { url } = message as CreateMessage;
      chrome.tabs.create({ url });
      sendResponse(CREATE_TAB, true, response);
      return true;
    }
    case UPDATE_TAB: {
      const { tabId, windowId } = message as UpdateMessage;
      updateTab({ tabId, windowId });
      sendResponse(UPDATE_TAB, true, response);
      return true;
    }
    case REMOVE_TAB: {
      const { tabId } = message as RemoveMessage;
      removeTab({ tabId });
      sendResponse(REMOVE_TAB, true, response);
      return true;
    }
    case QUERY_HISTORY: {
      const { query } = message as QueryMessage;
      queryHistory({ query }).then((history) => {
        sendResponse(QUERY_HISTORY, history, response);
      });
      return true;
    }
    case QUERY_BOOKMARK: {
      const { query } = message as QueryMessage;
      queryBookmarks({ query }).then((bookmarks) => {
        sendResponse(QUERY_BOOKMARK, bookmarks, response);
      });
      return true;
    }

    default:
      // 未対応メッセージ
      return false;
  }
}
