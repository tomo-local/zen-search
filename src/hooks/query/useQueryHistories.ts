import { useState, useEffect } from "react";
import { History, MessageType } from "@/types/chrome";
import { ResultType } from "@/types/result";

const DEFAULT_TAB_COUNT = 3;

export default function useQueryHistories(
  query: string,
  type: ResultType,
  tabCount: number
) {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    if (type !== ResultType.History && type !== ResultType.All) {
      setHistory([]);
      return;
    }

    if (tabCount > DEFAULT_TAB_COUNT) {
      return;
    }

    chrome.runtime.sendMessage(
      { type: MessageType.QUERY_HISTORY, query },
      (response) => {
        setHistory(response.result);
      }
    );
  }, [query]);

  return {
    histories: history,
  };
}
