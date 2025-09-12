/**
 * Bookmark Service Types - ブックマーク関連の型定義
 */

export interface Bookmark {
  data: chrome.bookmarks.BookmarkTreeNode & {
    favIconUrl?: string;
  };
}

export interface QueryBookmarksRequest {
  query: string;
  option?: QueryOption;
}

export interface QueryOption {
  count?: number;
}

export interface GetRecentBookmarksRequest {
  option?: QueryOption;
}
