import { MessageType, ResultType } from "@/types/result";

/**
 * 履歴クエリのリクエスト
 */
export interface HistoryQueryRequest {
  query: string;
  startTime?: number;
  endTime?: number;
  count?: number;
}

/**
 * 履歴
 */
export interface History {
  id: number;
  title: string;
  url: string;
  match: number;
}

/**
 * 履歴クエリのメッセージ（下位互換性用）
 */
export interface QueryHistoryMessage {
  query: string;
  startTime?: number;
  endTime?: number;
  count?: number;
}
