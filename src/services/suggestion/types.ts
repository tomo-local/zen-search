/**
 * Suggestion Service Types - Google検索候補関連の型定義
 */

export interface Suggestion {
  id: string;
  type: "Google";
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
