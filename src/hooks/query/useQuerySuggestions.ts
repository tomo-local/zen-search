import { useEffect, useState } from "react";
import { querySuggestions } from "@/function/google/query";
import type { Suggestion } from "@/types/google";
import { MessageType, ResultType } from "@/types/result";

export default function useQuerySuggestions(
  query: string,
  type: ResultType,
  init: boolean = false,
) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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

    setLoading(true);
    querySuggestions(query).then((result) => {
      setSuggestions(result);
      setLoading(false);
    });
  }, [query]);

  return {
    suggestions,
    loading,
  };
}
