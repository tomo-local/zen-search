/**
 * Suggestion Service Types - Google検索候補関連の型定義
 */

import type { SearchEngineValue } from "@/services/storage/types";

type SearchKind =
  | "Google"
  | "Bing"
  | "DuckDuckGo"
  | "Brave"
  | "Ecosia"
  | "Yahoo Japan"
  | "Perplexity";

export interface Suggestion {
  id: string;
  type: "Suggestion";
  title: string;
  url: string;
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
  searchEngine?: SearchEngineValue;
}

export interface MultiEngineQuerySuggestionsRequest {
  query: string;
  option?: QueryOption;
  searchEngines: SearchEngineValue[];
}

export interface QueryOption {
  count?: number;
}

export interface CreateSuggestionOptions {
  match?: boolean;
}
