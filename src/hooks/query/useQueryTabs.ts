import { useState, useEffect } from "react";
import { Tab, MessageType } from "@/types/chrome";
import { ResultType } from "@/types/result";

const DEFAULT_COUNT = undefined;

export default function useQueryTabs(query: string, type: ResultType) {
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);
  const [count, setCount] = useState<number | undefined>(DEFAULT_COUNT);

  useEffect(() => {
    if (type !== ResultType.Tab && type !== ResultType.All) {
      setFilteredTabs([]);
      return;
    }

    chrome.runtime.sendMessage(
      { type: MessageType.QUERY_TAB, query, count },
      (response) => {
        setFilteredTabs(response.result);
      }
    );
    setCount(undefined);
  }, [query]);

  return {
    tabs: filteredTabs,
  };
}
