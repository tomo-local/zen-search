/**
 * Bookmark Helper - ブックマーク関連のヘルパー関数
 */

import type { Bookmark } from "./types";

/**
 * 結果数を制限する
 */
export const limitResults = (count?: number) => (bookmarks: Bookmark[]): Bookmark[] => {
  return count ? bookmarks.slice(0, count) : bookmarks;
};
/**
 * URLが存在するブックマークのみフィルタ
 */
export const filterValidBookmarks = (bookmarks: chrome.bookmarks.BookmarkTreeNode[]): chrome.bookmarks.BookmarkTreeNode[] => {
  return bookmarks.filter((bookmark) => bookmark.url);
};
