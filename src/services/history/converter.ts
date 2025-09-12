import { getFaviconUrl } from "./helper";
import type * as Type from "./types";

export const convertItemToHistory = (
  history: chrome.history.HistoryItem,
): Type.History => {
  return {
    data: {
      ...history,
      // MEMO: chrome://favicon APIでは何故か取得できない場合があるため、GoogleのFaviconサービスを利用する
      favIconUrl: history.url ? getFaviconUrl(history.url) : undefined,
    },
  };
};
