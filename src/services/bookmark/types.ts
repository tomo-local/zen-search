/**
 * Bookmark Service Types - ブックマーク関連の型定義
 */

export interface Bookmark {
  id: string;
  type: "Bookmark";
  title: string;
  url: string;
  data: chrome.bookmarks.BookmarkTreeNode & {
    favIconUrl?: string;
  };
}

export interface QueryBookmarksRequest {
  query?: string;
  option?: QueryOption;
}

export interface QueryOption {
  count?: number;
}

export interface GetRecentBookmarksRequest {
  option?: QueryOption;
}
