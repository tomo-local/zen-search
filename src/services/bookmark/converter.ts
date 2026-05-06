/**
 * Bookmark Converter - chrome.bookmarks.BookmarkTreeNodeをBookmark型に変換
 */

import { getFaviconUrl } from "./helper";
import type { Bookmark } from "./types";

export function convertBookmark(
  bookmark: chrome.bookmarks.BookmarkTreeNode,
): Bookmark {
  return {
    id: crypto.randomUUID(),
    type: "Bookmark",
    title: bookmark.title || "",
    url: bookmark.url || "",
    data: {
      ...bookmark,
      favIconUrl: bookmark.url ? getFaviconUrl(bookmark.url) : undefined,
    },
  };
}
