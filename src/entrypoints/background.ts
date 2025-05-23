import {
  QueryMessage,
  CreateMessage,
  UpdateMessage,
  RemoveMessage,
  ActionType,
} from "@/types/chrome";
import { MessageType } from "@/types/result";

import { openContent } from "@/function/chrome/open";
import { queryTabs, updateTab, removeTab } from "@/function/chrome/tab";
import { queryBookmarks } from "@/function/chrome/bookmark";
import { queryHistory } from "@/function/chrome/history";

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

export default defineBackground(() => {
  chrome.commands.onCommand.addListener((command) => {
    if (command === OPEN_POPUP) {
      openContent(ActionType.tabs);
      return true;
    }
  });

  chrome.runtime.onMessage.addListener((message, _, response) => {
    if ([OPEN_POPUP, CLOSE_POPUP].includes(message.type)) {
      openContent(ActionType.tabs);
      return true;
    }

    if (message.type === QUERY_TAB) {
      const { query, count } = message as QueryMessage;

      queryTabs(query, { count }).then((tabs) => {
        response({
          type: QUERY_TAB,
          result: tabs,
        });
      });
      return true;
    }

    if (message.type === CREATE_TAB) {
      const { url } = message as CreateMessage;
      chrome.tabs.create({ url });

      response({
        type: CREATE_TAB,
        result: true,
      });
      return true;
    }

    if (message.type === UPDATE_TAB) {
      const { tabId, windowId } = message as UpdateMessage;
      updateTab({
        tabId,
        windowId,
      });

      response({
        type: UPDATE_TAB,
        result: true,
      });
      return true;
    }

    if (message.type === REMOVE_TAB) {
      const { tabId } = message as RemoveMessage;
      removeTab({ tabId });

      response({
        type: REMOVE_TAB,
        result: true,
      });
      return true;
    }

    if (message.type === QUERY_HISTORY) {
      const { query } = message as QueryMessage;
      queryHistory({ query }).then((history) => {
        response({
          type: QUERY_HISTORY,
          result: history,
        });
      });
      return true;
    }

    if (message.type === QUERY_BOOKMARK) {
      const { query } = message as QueryMessage;
      queryBookmarks({ query }).then((bookmarks) => {
        response({
          type: QUERY_BOOKMARK,
          result: bookmarks,
        });
      });
      return true;
    }
  });
});
