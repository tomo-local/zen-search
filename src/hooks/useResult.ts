import { useCallback, useEffect, useState } from "react";
import type { Kind, Result } from "@/services/result";
import { runtimeService } from "@/services/runtime";

interface UseResultsParams {
  query?: string;
  categories: Kind[];
}
interface UseResultsReturn {
  results: Result<Kind>[];
  loading: boolean;
  refresh: ({
    query,
    categories,
  }: {
    query?: string;
    categories: Kind[];
  }) => Promise<void>;
}

export default function useResults(params: UseResultsParams): UseResultsReturn {
  const [results, setResults] = useState<Result<Kind>[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(
    async ({
      query,
      categories,
    }: {
      query?: string;
      categories: Kind[];
    }): Promise<void> => {
      setLoading(true);
      const results = await runtimeService.queryResults({
        filters: { query, categories, count: 1000 },
      });
      setResults(results);
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    fetchResults({
      query: params.query,
      categories: params.categories,
    });
  }, [fetchResults, params.query, params.categories]);

  return { results, loading, refresh: fetchResults };
}
