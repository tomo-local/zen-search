/**
 * Suggestion Converter - APIレスポンスをSuggestion型に変換
 */

import type { SearchEngineValue } from "@/services/storage/types";
import { buildSearchUrl } from "./helper";
import type { Suggestion } from "./types";

type SearchKind = Suggestion["data"]["type"];

const ENGINE_TO_KIND: Record<SearchEngineValue, SearchKind> = {
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  brave: "Brave",
  ecosia: "Ecosia",
  yahoo_japan: "Yahoo Japan",
  perplexity: "Perplexity",
};

export function convertSuggestions(
  suggestion: string,
  originalQuery: string,
  engine: SearchEngineValue = "google",
): Suggestion {
  const url = buildSearchUrl(suggestion, engine);
  return {
    id: crypto.randomUUID(),
    type: "Suggestion",
    title: suggestion,
    url,
    data: {
      type: ENGINE_TO_KIND[engine],
      suggestion,
      title: suggestion,
      url,
      query: originalQuery,
    },
  };
}
