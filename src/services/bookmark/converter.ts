import { ResultType } from "@/types/result";
import { calcMatchRateResult } from "@/utils/match";
import * as Type from "./types";

/**
 * Chrome BookmarkTreeNode を Bookmark オブジェクトに変換する
 */
export const convertToBookmarks = (
  bookmarkNodes: chrome.bookmarks.BookmarkTreeNode[],
  query?: string
): Type.Bookmark[] => {
  return bookmarkNodes.map(
    (bookmark): Type.Bookmark => ({
      type: ResultType.Bookmark,
      id: bookmark.id,
      title: bookmark.title || "",
      url: bookmark.url || "",
      match: calcMatchRateResult(query || "", bookmark.title, bookmark.url),
    })
  );
};

/**
 * 単一の BookmarkTreeNode を Bookmark オブジェクトに変換する
 */
export const convertSingleBookmark = (
  bookmark: chrome.bookmarks.BookmarkTreeNode,
  query: string
): Type.Bookmark | null => {
  if (!bookmark.url) {
    return null;
  }

  return {
    type: ResultType.Bookmark,
    id: bookmark.id,
    title: bookmark.title || "",
    url: bookmark.url,
    match: calcMatchRateResult(query, bookmark.title, bookmark.url),
  };
};
