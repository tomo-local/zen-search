import { actionBookmarkQuery, actionRecentBookmarks } from "@/utils/chrome";
import { Bookmark, QueryBookmarkMessage } from "@/types/chrome";
import { ResultType } from "@/types/result";
import { calcMatchRateResult } from "@/utils/match";

const queryBookmarks = async ({
  query,
  count,
}: Omit<QueryBookmarkMessage, "type">): Promise<Bookmark[]> => {
  const response = query
    ? await actionBookmarkQuery(query)
    : await actionRecentBookmarks(count || 10);

  const bookmarks = response
    .filter((bookmark) => bookmark.url)
    .map(
      (bookmark) =>
        ({
          type: ResultType.Bookmark,
          id: bookmark.id,
          title: bookmark.title || "",
          url: bookmark.url || "",
          match: calcMatchRateResult(query, bookmark.title, bookmark.url),
        } as Bookmark)
    );

  return count ? bookmarks.slice(0, count) : bookmarks;
};

export { queryBookmarks };
