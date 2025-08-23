/**
 * Suggestion Service Types - Google検索候補関連の型定義
 */

import type { ResultType } from "@/types/result";

export interface Suggestion {
  id: string;
  type: ResultType.Google;
  title: string;
  url: string;
  data: SuggestionData;
}

export interface SuggestionData {
  originalQuery: string;
}

export interface QuerySuggestionsRequest {
  query: string;
  option?: QueryOption;
}

export interface QueryOption {
  count?: number;
}

export interface CreateSuggestionOptions {
  match?: boolean;
}
