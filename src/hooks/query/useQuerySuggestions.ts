import { useState, useEffect } from "react";
import { Suggestion } from "@/types/google";
import { querySuggestions } from "@/function/google/query";
import { ResultType } from "@/types/result";

const DEFAULT_COUNT = undefined;
const DEFAULT_TAB_COUNT = 3;

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

    if (tabCount > DEFAULT_TAB_COUNT) {
      return;
    }

    querySuggestions(query, { count }).then((result) => {
      setSuggestions(result);
    });
    setCount(undefined);
  }, [query, tabCount]);

  return {
    suggestions,
  };
}
