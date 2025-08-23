import { useCallback, useEffect, useState } from "react";
import type { History } from "@/services/history/types";
import { runtimeService } from "@/services/runtime/service";
import { ResultType } from "@/types/result";

export default function useQueryHistories(
  query: string,
  type: ResultType,
  init: boolean = false,
) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History[]>([]);

  const fetchHistory = useCallback(async (query: string) => {
    if (!query.trim()) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await runtimeService.searchHistory({ query });
      setHistory(result);
    } catch (err) {
      console.error("Failed to search history:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!init) {
      return;
    }

    if (type !== ResultType.History && type !== ResultType.All) {
      setHistory([]);
      return;
    }

    if (type === ResultType.All && !query) {
      setHistory([]);
      return;
    }

    fetchHistory(query);
  }, [query, type, init, fetchHistory]);

  return {
    histories: history,
    loading,
    refetch: () => fetchHistory(query),
  };
}
