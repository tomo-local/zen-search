import { useState, useEffect } from "react";
import { History } from "@/types/chrome";
import { ResultType, MessageType } from "@/types/result";

export default function useQueryHistories(
  query: string,
  type: ResultType,
  init: boolean = false
) {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    if (!init) {
      return;
    }

    if (type !== ResultType.History && type !== ResultType.All) {
      setHistory([]);
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
