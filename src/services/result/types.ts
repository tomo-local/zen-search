/**
 * Result Service Types - Result関連の型定義
 */

import type { Bookmark } from "@/services/bookmark/types";
import type { History } from "@/services/history/types";
import type { Suggestion } from "@/services/suggestion/types";
import type { Tab } from "@/services/tab/types";

export type Kind = "Tab" | "Bookmark" | "History" | "Suggestion";

export interface Result<T extends Kind> {
  id: string;
  type: T;
  title: string;
  url: string;
  data: ResultData<T>;
}

export type ResultDataMap = {
  Tab: Tab["data"];
  Bookmark: Bookmark["data"];
  History: History["data"];
  Suggestion: Suggestion["data"];
};

export type ResultData<T extends Kind> = ResultDataMap[T];

export interface QueryResultsRequest {
  filters: ResultFilters;
}

export interface ResultFilters {
  query?: string;
  count?: number;
  categories: Kind[];
}
