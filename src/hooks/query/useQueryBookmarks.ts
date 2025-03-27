import { useState, useEffect } from "react";
import { Bookmark, MessageType } from "@/types/chrome";
import { ResultType } from "@/types/result";

const DEFAULT_TAB_COUNT = 3;

export default function useQueryBookmarks(
  query: string,
  type: ResultType,
  tabCount: number
) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (type !== ResultType.Bookmark && type !== ResultType.All) {
      setBookmarks([]);
      return;
    }

    if (tabCount > DEFAULT_TAB_COUNT) {
      return;
    }

    chrome.runtime.sendMessage(
      { type: MessageType.QUERY_BOOKMARK, query },
      (response) => {
        setBookmarks(response.result);
      }
    );
  }, [query]);

  return {
    bookmarks,
  };
}
