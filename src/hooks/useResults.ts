import { useEffect, useMemo, useState } from "react";
import useQueryBookmarks from "@/hooks/query/useQueryBookmarks";
import useQueryHistories from "@/hooks/query/useQueryHistories";
import useQuerySuggestions from "@/hooks/query/useQuerySuggestions";
import useQueryTabs from "@/hooks/query/useQueryTabs";

import type { Result, ResultType } from "@/types/result";
import { useActionCalculation } from "./action/useActionCalculation";

export default function useResults(query: string, type: ResultType) {
  const [init, setInit] = useState(false);
  const { tabs, loading: tabLoading } = useQueryTabs(query, type);
  const { suggestions, loading: suggestionLoading } = useQuerySuggestions(
    query,
    type,
    init,
  );
  const { histories, loading: historyLoading } = useQueryHistories(
    query,
    type,
    init,
  );
  const { bookmarks, loading: bookmarkLoading } = useQueryBookmarks(
    query,
    type,
    init,
  );

  const { result: calculationResult } = useActionCalculation(query);

  useEffect(() => {
    setInit(true);
  }, []);

  const result = useMemo<Result[]>(() => {
    const queryList = [
      ...tabs,
      ...suggestions,
      ...histories,
      ...bookmarks,
    ].sort((a, b) => b.match - a.match);

    return calculationResult ? [calculationResult, ...queryList] : queryList;
  }, [tabs, suggestions, histories, bookmarks]);

  return {
    result,
    loading:
      tabLoading || suggestionLoading || historyLoading || bookmarkLoading,
  };
}
