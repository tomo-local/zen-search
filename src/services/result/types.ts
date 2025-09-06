/**
 * Result Service Types - Result関連の型定義
 */

import type { Bookmark } from "@/services/bookmark/types";
import type { History } from "@/services/history/types";
import type { Suggestion } from "@/services/suggestion/types";
import type { Tab } from "@/services/tab/types";

export type Kind = "Tab" | "Bookmark" | "History" | "Suggestion";

export interface Result<T extends Kind> {
  type: T;
  id: string;
  title: string;
  url: string;
  data?: ResultDataMap[T];
}

export type ResultDataMap = {
  Tab: Tab;
  Bookmark: Bookmark;
  History: History;
  Suggestion: Suggestion;
};

export type ResultData<T extends Kind> = ResultDataMap[T];

export interface QueryResultsRequest {
  filters: ResultFilters;
}

export interface ResultFilters {
  categories: Kind[];
  query?: string;
}
