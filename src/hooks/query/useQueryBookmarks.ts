import { useCallback, useEffect, useState } from "react";
import type { Bookmark } from "@/services/bookmark/types";
import { runtimeService } from "@/services/runtime/service";
import { ResultType } from "@/types/result";

export default function useQueryBookmarks(
  query: string,
  type: ResultType,
  init: boolean = false,
) {
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await runtimeService.searchBookmarks({ query });
      setBookmarks(response);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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

    fetchBookmarks(query);
  }, [query, type, init, fetchBookmarks]);

  return {
    bookmarks,
    loading,
  };
}
