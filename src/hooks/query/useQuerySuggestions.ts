import { useState, useEffect } from "react";
import { Suggestion } from "@/types/google";
import { ResultType, MessageType } from "@/types/result";
import { querySuggestions } from "@/function/google/query";

const DEFAULT_COUNT = undefined;

export default function useQuerySuggestions(
  query: string,
  type: ResultType,
  tabCount: number
) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [count, setCount] = useState<number | undefined>(DEFAULT_COUNT);

  useEffect(() => {
    if (type !== ResultType.Google && type !== ResultType.All) {
      setSuggestions([]);
      return;
    }

    if (!query) {
      setSuggestions([]);
      return;
    }

    querySuggestions(query).then((result) => {
      setSuggestions(result);
    });

    setCount(undefined);
  }, [query]);

  return {
    suggestions,
  };
}
