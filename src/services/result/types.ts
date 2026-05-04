/**
 * Result Service Types - Result関連の型定義
 */

import type { Action, Kind as ActionKind } from "@/services/action/types";
import type { Bookmark } from "@/services/bookmark/types";
import type { History } from "@/services/history/types";
import type { SearchEngineValue } from "@/services/storage/types";
import type { Suggestion } from "@/services/suggestion/types";
import type { Tab } from "@/services/tab/types";

export type Kind = "Tab" | "Bookmark" | "History" | "Suggestion" | ActionKind;

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
  // 特殊なAction機能
  "Action.Calculation": Action<"Action.Calculation">["data"];
};

export type ResultData<T extends Kind> = ResultDataMap[T];

/** Result<Kind> を特定の型に絞り込む型ガード関数 */
export function isTabResult(result: Result<Kind>): result is Result<"Tab"> {
  return result.type === "Tab";
}

export function isBookmarkResult(
  result: Result<Kind>,
): result is Result<"Bookmark"> {
  return result.type === "Bookmark";
}

export function isHistoryResult(
  result: Result<Kind>,
): result is Result<"History"> {
  return result.type === "History";
}

export function isSuggestionResult(
  result: Result<Kind>,
): result is Result<"Suggestion"> {
  return result.type === "Suggestion";
}

export function isActionResult(
  result: Result<Kind>,
): result is Result<"Action.Calculation"> {
  return result.type === "Action.Calculation";
}

export interface QueryResultsRequest {
  filters: ResultFilters;
  /** バックグラウンド内部でのみ使用。メッセージ境界を越えない。 */
  signal?: AbortSignal;
}

export interface ResultFilters {
  query?: string;
  count?: number;
  categories: Kind[];
  searchEngines?: SearchEngineValue[];
}
