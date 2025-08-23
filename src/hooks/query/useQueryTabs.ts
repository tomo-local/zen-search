import { useCallback, useEffect, useState } from "react";
import { runtimeService } from "@/services/runtime/service";
import type { Tab } from "@/services/tab/types";
import { ResultType } from "@/types/result";

export default function useQueryTabs(query: string, type: ResultType) {
  const [loading, setLoading] = useState(false);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);

  const queryTabs = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setFilteredTabs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await runtimeService.queryTabs({
        query: searchQuery,
      });
      setFilteredTabs(result);
    } catch (err) {
      console.error("Failed to query tabs:", err);
      setFilteredTabs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (type !== ResultType.Tab && type !== ResultType.All) {
      setFilteredTabs([]);
      return;
    }
    queryTabs(query);
  }, [query, type, queryTabs]);

  return {
    tabs: filteredTabs,
    loading,
    refetch: () => queryTabs(query), // 手動で再取得する関数
  };
}
