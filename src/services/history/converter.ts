import { getFaviconUrl } from "./helper";
import type * as Type from "./types";

export const convertItemToHistory = (
  history: chrome.history.HistoryItem,
): Type.History => {
  return {
    id: crypto.randomUUID(),
    type: "History",
    title: history.title || "",
    url: history.url || "",
    data: {
      ...history,
      favIconUrl: history.url ? getFaviconUrl(history.url) : undefined,
    },
  };
};
