import { useEffect, useState } from "react";

import useQueryTabs from "@/hooks/query/useQueryTabs";
import useQuerySuggestions from "@/hooks/query/useQuerySuggestions";
import useQueryHistories from "@/hooks/query/useQueryHistories";
import useQueryBookmarks from "@/hooks/query/useQueryBookmarks";

import { ResultType, Result } from "@/types/result";

export default function useResult(query: string, type: ResultType) {
  const [result, setResult] = useState<Result[]>([]);
  const { tabs } = useQueryTabs(query, type);
  const { suggestions } = useQuerySuggestions(query, type, tabs.length);
  const { histories } = useQueryHistories(query, type, tabs.length);
  const { bookmarks } = useQueryBookmarks(query, type, tabs.length);

  useEffect(() => {
    const items = [...tabs, ...suggestions, ...histories, ...bookmarks].sort(
      (a, b) => b.match - a.match
    );

    setResult(items);
  }, [query, tabs, suggestions, histories, bookmarks]);

  return {
    result,
  };
}
