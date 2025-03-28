import { useEffect, useState } from "react";

import useQueryTabs from "@/hooks/query/useQueryTabs";
import useQuerySuggestions from "@/hooks/query/useQuerySuggestions";
import useQueryHistories from "@/hooks/query/useQueryHistories";
import useQueryBookmarks from "@/hooks/query/useQueryBookmarks";

import { ResultType, Result } from "@/types/result";

export default function useResult(query: string, type: ResultType) {
  const [result, setResult] = useState<Result[]>([]);
  const [init, setInit] = useState(false);
  const { tabs } = useQueryTabs(query, type);
  const { suggestions } = useQuerySuggestions(query, type, init);
  const { histories } = useQueryHistories(query, type, init);
  const { bookmarks } = useQueryBookmarks(query, type, init);

  useEffect(() => {
    const items = [...tabs, ...suggestions, ...histories, ...bookmarks].sort(
      (a, b) => b.match - a.match
    );

    setResult(items);

    if (!init) {
      setInit(true);
    }
  }, [query, tabs, suggestions, histories, bookmarks]);

  return {
    result,
  };
}
