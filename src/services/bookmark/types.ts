import { MessageType, ResultType } from "@/types/result";

export interface Bookmark {
  type: ResultType.Bookmark;
  id: number | string;
  title: string;
  url: string;
  match: number;
}

export type BookmarkQuery = chrome.bookmarks.BookmarkSearchQuery;

export interface QueryBookmarkRequest {
  query: BookmarkQuery;
  count?: number;
}
