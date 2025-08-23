import { useState, useEffect } from "react";
import { Tab } from "@/services/tab";
import { ResultType, MessageType } from "@/types/result";

export default function useQueryTabs(query: string, type: ResultType) {
  const [loading, setLoading] = useState(false);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);

  useEffect(() => {
    if (type !== ResultType.Tab && type !== ResultType.All) {
      setFilteredTabs([]);
      return;
    }

    setLoading(true);
    chrome.runtime.sendMessage(
      { type: MessageType.QUERY_TAB, query },
      (response) => {
        setFilteredTabs(response.result);
        setLoading(false);
      }
    );
  }, [query]);

  return {
    tabs: filteredTabs,
    loading,
  };
}
