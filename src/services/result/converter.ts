/**
 * Result Service Converter - Resultの変換ヘルパー
 */

import type { NewBookmark as Bookmark } from "@/services/bookmark/types";
import type { NewHistory as History } from "@/services/history/types";
import type { NewSuggestion as Suggestion } from "@/services/suggestion/types";
import type { NewTab as Tab } from "@/services/tab/types";
import type { Kind, Result } from "./types";

/**
 * サンプル変換関数
 */
export const convertResultToResult = (data: Result<Kind>): Result<Kind> => {
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    url: data.url,
    data: data.data,
  };
};

export const convertTabToResult = (tab: Tab): Result<"Tab"> => {
  return {
    id: tab.data.id?.toString() || generateUniqueId(),
    type: "Tab",
    title: tab.data.title || "",
    url: tab.data.url || "",
    data: tab.data,
  };
};

export const convertMultipleTabsToResult = (tabs: Tab[]): Result<"Tab">[] => {
  return tabs.map((tab) => convertTabToResult(tab));
};

export const convertBookmarkToResult = (
  bookmark: Bookmark,
): Result<"Bookmark"> => {
  return {
    id: bookmark.data.id,
    type: "Bookmark",
    title: bookmark.data.title || "",
    url: bookmark.data.url || "",
    data: bookmark.data,
  };
};

export const convertMultipleBookmarksToResult = (
  bookmarks: Bookmark[],
): Result<"Bookmark">[] => {
  return bookmarks.map((bookmark) => convertBookmarkToResult(bookmark));
};

export const convertHistoryToResult = (history: History): Result<"History"> => {
  return {
    id: history.data.id,
    type: "History",
    title: history.data.title || "",
    url: history.data.url || "",
    data: history.data,
  };
};

export const convertMultipleHistoriesToResult = (
  histories: History[],
): Result<"History">[] => {
  return histories.map((history) => convertHistoryToResult(history));
};

export const convertSuggestionToResult = (
  suggestion: Suggestion,
): Result<"Suggestion"> => {
  return {
    id: generateUniqueId(),
    type: "Suggestion",
    title: suggestion.data.title || "",
    url: suggestion.data.url || "",
    data: suggestion.data,
  };
};

export const convertMultipleSuggestionsToResult = (
  suggestions: Suggestion[],
): Result<"Suggestion">[] => {
  return suggestions.map((suggestion) => convertSuggestionToResult(suggestion));
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
