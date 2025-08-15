import { MessageType, ResultType } from '@/types/result';

export interface Bookmark {
  type: ResultType.Bookmark;
  id: number | string;
  title: string;
  url: string;
  match: number;
}

export interface QueryBookmarkMessage {
  type: MessageType.QUERY_BOOKMARK;
  query: string;
  count?: number;
}

export interface QueryMessage {
  type: MessageType.QUERY_BOOKMARK;
  query: string;
  count?: number;
}
