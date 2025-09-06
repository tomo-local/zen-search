import { ResultType } from "@/types/result";
import type * as Type from "./types";

export const convertItemToHistory = (
  history: chrome.history.HistoryItem,
): Type.History => {
  return {
    type: ResultType.History,
    id: history.id,
    title: history.title || "",
    url: history.url || "",
    data: convertItemToHistoryData(history),
  };
};

export const convertItemToHistoryData = (
  history: chrome.history.HistoryItem,
): Type.HistoryData => {
  return {
    lastVisitTime: history.lastVisitTime,
    typedCount: history.typedCount,
    visitCount: history.visitCount,
  };
};

export const convertItemToNewHistory = (
  history: chrome.history.HistoryItem,
): Type.NewHistory => {
  return {
    data: history,
  };
};

export const convertMultipleItemsToHistory = (
  histories: chrome.history.HistoryItem[],
): Type.History[] => {
  return histories.map((history) => convertItemToHistory(history));
};
