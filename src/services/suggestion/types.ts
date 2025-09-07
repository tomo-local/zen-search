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

type SearchKind = "Google" | "Bing" | "DuckDuckGo" | "Brave" | "Ecosia";

export interface NewSuggestion {
  data: {
    type: SearchKind;
    suggestion: string;
    title: string;
    url: string;
    query: string;
  };
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
