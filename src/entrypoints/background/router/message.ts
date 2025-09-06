import {
  bookmarkService,
  type QueryBookmarksRequest,
} from "@/services/bookmark";
import { contentService } from "@/services/content";
import {
  get30DaysAgo,
  getNow,
  historyService,
  type SearchHistoryRequest,
} from "@/services/history";
import {
  type CreateTabRequest,
  type QueryTabsRequest,
  type RemoveTabRequest,
  tabService,
  type UpdateTabRequest,
} from "@/services/tab";

import { MessageType } from "@/types/result";

const {
  OPEN_POPUP,
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

type Message =
  | { type: "OPEN_POPUP" }
  | QueryTabsRequest
  | CreateTabRequest
  | UpdateTabRequest
  | RemoveTabRequest
  | SearchHistoryRequest
  | QueryBookmarksRequest;

export function routeMessage(
  message: { type: MessageType } & Message,
  _sender: chrome.runtime.MessageSender,
  response: (res?: object) => void,
): boolean {
  switch (message.type) {
    case OPEN_POPUP:
      contentService.openTabs(contentService.open({}));
      return true;

    case QUERY_TAB: {
      const { query, option } = message as QueryTabsRequest;
      tabService.query({ query, option }).then((tabs) => {
        sendResponse(QUERY_TAB, tabs, response);
      });
      return true;
    }
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
    case QUERY_HISTORY: {
      const { query } = message as SearchHistoryRequest;
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
      const { query, option } = message as QueryBookmarksRequest;

      // queryが空の場合、最近のブックマークを取得
      if (!query) {
        bookmarkService.getRecent({ option }).then((bookmarks) => {
          sendResponse(QUERY_BOOKMARK, bookmarks, response);
        });
        return true;
      }
      bookmarkService.search({ query, option }).then((bookmarks) => {
        sendResponse(QUERY_BOOKMARK, bookmarks, response);
      });
      return true;
    }

    default:
      // 未対応メッセージ
      return false;
  }
}
