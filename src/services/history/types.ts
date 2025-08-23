import type { ResultType } from "@/types/result";

export interface History {
  type: ResultType.History;
  id: string;
  title: string;
  url: string;
  data: HistoryData;
}

export type HistoryData = {
  lastVisitTime?: number;
  typedCount?: number;
  visitCount?: number;
};

export interface SearchHistoryRequest {
  query: string;
  startTime?: number;
  endTime?: number;
  count?: number;
}