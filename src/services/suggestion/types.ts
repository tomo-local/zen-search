/**
 * Suggestion Service Types - Google検索候補関連の型定義
 */

type SearchKind = "Google" | "Bing" | "DuckDuckGo" | "Brave" | "Ecosia";

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
}

export interface QueryOption {
  count?: number;
}

export interface CreateSuggestionOptions {
  match?: boolean;
}
