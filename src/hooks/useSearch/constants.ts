/**
 * useSearch関連の定数
 */

import type { Kind } from "@/services/result";
import type { QueryState, ResultType } from "./types";

/** デフォルトのカテゴリ */
export const defaultCategories: Kind[] = [
  "Tab",
  "History",
  "Bookmark",
  "Suggestion",
  "Action.Calculation",
];

/** 初期状態 */
export const initialState: QueryState = {
  type: "All",
  categories: [...defaultCategories],
  suggestion: null,
  query: "",
  init: false,
};

/** タイプごとのカテゴリマッピング */
export const categoriesMap: { [key in ResultType]: Kind[] } = {
  All: defaultCategories,
  Tab: ["Tab"],
  History: ["History"],
  Bookmark: ["Bookmark"],
  Google: ["Suggestion"],
};

/** クエリ履歴のストレージキー */
export const QUERY_HISTORY_KEY = "zen-search:query-history";
