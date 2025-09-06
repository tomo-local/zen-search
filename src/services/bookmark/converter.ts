/**
 * Bookmark Converter - chrome.bookmarks.BookmarkTreeNodeをBookmark型に変換
 */

import { ResultType } from "@/types/result";
import type { Bookmark, NewBookmark } from "./types";

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
      dateAdded: bookmark?.dateAdded,
      dateGroupModified: bookmark?.dateGroupModified,
      unmodifiable: bookmark?.unmodifiable,
    },
  };
}

export function convertNewBookmark(
  bookmark: chrome.bookmarks.BookmarkTreeNode,
): NewBookmark {
  return {
    data: bookmark,
  };
}
