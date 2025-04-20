import { useEffect, useState, useMemo } from "react";

import useQueryTabs from "@/hooks/query/useQueryTabs";
import useQuerySuggestions from "@/hooks/query/useQuerySuggestions";
import useQueryHistories from "@/hooks/query/useQueryHistories";
import useQueryBookmarks from "@/hooks/query/useQueryBookmarks";

import { ResultType, Result } from "@/types/result";

export default function useResult(query: string, type: ResultType) {
  const [init, setInit] = useState(false);
  const { tabs, loading: tabLoading } = useQueryTabs(query, type);
  const { suggestions, loading: suggestionLoading } = useQuerySuggestions(
    query,
    type,
    init
  );
  const { histories, loading: historyLoading } = useQueryHistories(
    query,
    type,
    init
  );
  const { bookmarks, loading: bookmarkLoading } = useQueryBookmarks(
    query,
    type,
    init
  );

  useEffect(() => {
    setInit(true);
  }, []);

  const result = useMemo<Result[]>(() => {
    return [...tabs, ...suggestions, ...histories, ...bookmarks].sort(
      (a, b) => b.match - a.match
    );
  }, [tabs, suggestions, histories, bookmarks]);

  return {
    result,
    loading:
      tabLoading || suggestionLoading || historyLoading || bookmarkLoading,
  };
}
