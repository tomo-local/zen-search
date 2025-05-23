import { useState, useEffect } from "react";
import { Bookmark } from "@/types/chrome";
import { ResultType, MessageType } from "@/types/result";

export default function useQueryBookmarks(
  query: string,
  type: ResultType,
  init: boolean = false
) {
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!init) {
      return;
    }

    if (type !== ResultType.Bookmark && type !== ResultType.All) {
      setBookmarks([]);
      return;
    }

    if (type === ResultType.All && !query) {
      setBookmarks([]);
      return;
    }

    setLoading(true);
    chrome.runtime.sendMessage(
      { type: MessageType.QUERY_BOOKMARK, query },
      (response) => {
        setBookmarks(response.result);
        setLoading(false);
      }
    );
  }, [query]);

  return {
    bookmarks,
    loading,
  };
}
