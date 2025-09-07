/**
 * Bookmark Helper - ブックマーク関連のヘルパー関数
 */

import type { Bookmark, NewBookmark } from "./types";

/**
 * 結果数を制限する
 */
export const limitResults =
  (count?: number) =>
  (bookmarks: (Bookmark | NewBookmark)[]): (Bookmark | NewBookmark)[] => {
    return count ? bookmarks.slice(0, count) : bookmarks;
  };
/**
 * URLが存在するブックマークのみフィルタ
 */
export const filterValidBookmarks = (
  bookmarks: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] => {
  return bookmarks.filter((bookmark) => bookmark.url);
};
