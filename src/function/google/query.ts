import { Suggestion, SuggestionOptions } from "@/types/google";
import { ResultType } from "@/types/result";

import { calcMatchRateResult } from "@/utils/match";

const suggest_url = "https://www.google.com/complete/search";
const search_url = "https://www.google.com/search";

export const querySuggestions = async (
  query: string,
  option?: SuggestionOptions
) => {
  if (!query) return [];

  const keyword = encodeURIComponent(query.trim());

  const endpoint = `${suggest_url}?client=chrome&q=${keyword}`;
  try {
    const response = await fetch(endpoint, { mode: "no-cors" });

    if (!response.ok) {
      console.error("Failed to fetch Google suggestions:", response.statusText);
      return [createSuggestion(query, { match: true })] as Suggestion[];
    }

    const data = await response.json();

    const result = data[1].map((title: string) => createSuggestion(title));

    return [createSuggestion(query, { match: true }), ...result];
  } catch (error) {
    console.error("Error fetching Google suggestions:", error);
    return [createSuggestion(query, { match: true })] as Suggestion[];
  }
};

const createSuggestion = (
  query: string,
  option?: { match: boolean }
): Suggestion => ({
  id: createRandomId(),
  title: query,
  url: `${search_url}?q=${encodeURIComponent(query)}`,
  type: ResultType.Google,
  match: option?.match
    ? 1
    : calcMatchRateResult(
        query,
        query,
        `${search_url}?q=${encodeURIComponent(query)}`
      ),
});

// 乱数を作成 10桁の乱数を作成
const createRandomId = () => {
  return Math.floor(Math.random() * 10000000000);
};
