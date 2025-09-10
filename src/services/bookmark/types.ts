/**
 * Bookmark Service Types - ブックマーク関連の型定義
 */

import type { ResultType } from "@/types/result";

export interface Bookmark {
  type: ResultType.Bookmark;
  id: string;
  title: string;
  url: string;
  data: BookMarkData;
}

export type BookMarkData = {
  unmodifiable?: "managed" | undefined;
  dateAdded?: number | undefined;
  dateGroupModified?: number | undefined;
  parentId?: string | undefined;
};

export interface NewBookmark {
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
