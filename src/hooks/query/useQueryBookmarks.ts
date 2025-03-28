import { useState, useEffect } from "react";
import { Bookmark } from "@/types/chrome";
import { ResultType, MessageType } from "@/types/result";

export default function useQueryBookmarks(
  query: string,
  type: ResultType,
  init: boolean = false
) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!init) {
      return;
    }

    if (type !== ResultType.Bookmark && type !== ResultType.All) {
      setBookmarks([]);
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
