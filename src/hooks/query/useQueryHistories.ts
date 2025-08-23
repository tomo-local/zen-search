import { useEffect, useState } from "react";
import type { History } from "@/types/chrome";
import { MessageType, ResultType } from "@/types/result";

export default function useQueryHistories(
  query: string,
  type: ResultType,
  init: boolean = false,
) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History[]>([]);

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

    setLoading(true);
    chrome.runtime.sendMessage(
      { type: MessageType.QUERY_HISTORY, query },
      (response) => {
        setHistory(response.result);
        setLoading(false);
      },
    );
  }, [query, type, init]);

  return {
    histories: history,
    loading,
  };
}
