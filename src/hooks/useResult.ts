import { useCallback, useEffect, useState } from "react";
import type { Kind, Result } from "@/services/result";
import { runtimeService } from "@/services/runtime";

export default function useResults(
  query?: string,
  categories: Kind[] = ["Tab"],
) {
  const [results, setResults] = useState<Result<Kind>[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const results = await runtimeService.queryResults({
      filters: { categories, query, count: 1000 },
    });
    setResults(results);
    setLoading(false);
  }, [query, categories]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return { results, loading, refresh: fetchResults };
}
