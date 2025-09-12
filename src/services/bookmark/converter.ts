/**
 * Bookmark Converter - chrome.bookmarks.BookmarkTreeNodeをBookmark型に変換
 */

import { getFaviconUrl } from "./helper";
import type { Bookmark } from "./types";

export function convertBookmark(
  bookmark: chrome.bookmarks.BookmarkTreeNode,
): Bookmark {
  return {
    data: {
      ...bookmark,
      favIconUrl: bookmark.url ? getFaviconUrl(bookmark.url) : undefined,
    },
  };
}
