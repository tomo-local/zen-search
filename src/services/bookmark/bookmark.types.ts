import { MessageType, ResultType } from '@/types/result';

export interface Bookmark {
  type: ResultType.Bookmark;
  id: number | string;
  title: string;
  url: string;
  match: number;
}

export type BookmarkQuery = chrome.bookmarks.BookmarkSearchQuery;

export interface QueryBookmarkMessage {
  type: MessageType.QUERY_BOOKMARK;
  query: BookmarkQuery;
  count?: number;
}

export interface QueryMessage {
  type: MessageType.QUERY_BOOKMARK;
  query: BookmarkQuery;
  count?: number;
}
