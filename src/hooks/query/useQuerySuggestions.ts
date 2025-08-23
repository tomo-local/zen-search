import { useCallback, useEffect, useState } from "react";
import { type Suggestion, suggestionService } from "@/services/suggestion";
import { ResultType } from "@/types/result";

export default function useQuerySuggestions(
  query: string,
  type: ResultType,
  init: boolean = false
) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const result = await suggestionService.query({ query });
      setSuggestions(result);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!init) {
      return;
    }

    if (type !== ResultType.Google && type !== ResultType.All) {
      setSuggestions([]);
      return;
    }

    if (type !== ResultType.All && !query) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(query);
  }, [query, type, init, fetchSuggestions]);

  return {
    suggestions,
    loading,
  };
}
