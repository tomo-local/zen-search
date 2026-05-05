import type * as Type from "./types";

/** Fetches search suggestions from external search engine APIs. */
export interface SuggestionService {
  /** Fetches suggestions from a single search engine. */
  query: (request: Type.QuerySuggestionsRequest) => Promise<Type.Suggestion[]>;
  /** Fetches and deduplicates suggestions across multiple search engines. */
  multiEngineQuery: (
    request: Type.MultiEngineQuerySuggestionsRequest,
  ) => Promise<Type.Suggestion[]>;
}
