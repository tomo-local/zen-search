/**
 * Bookmark Converter - chrome.bookmarks.BookmarkTreeNodeをBookmark型に変換
 */

import { ResultType } from "@/types/result";
import type { Bookmark } from "./types";

export function convertBookmarkToResult(
  bookmark: chrome.bookmarks.BookmarkTreeNode,
): Bookmark {
  return {
    type: ResultType.Bookmark,
    id: bookmark.id,
    title: bookmark.title || "",
    url: bookmark.url || "",
    data: {
      parentId: bookmark?.parentId || "",
      dateAdded: bookmark?.dateAdded || 0,
      dateGroupModified: bookmark?.dateGroupModified || 0,
      unmodifiable: bookmark?.unmodifiable,
    },
  };
}
