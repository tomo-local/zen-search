/**
 * Bookmark Service - マイクロサービス形式のブックマーク管理サービス
 * 責任: ブックマークの検索、作成、更新、削除を担当
 */

import { convertBookmark } from "./converter";
import { filterValidBookmarks } from "./helper";
import type { BookmarkService } from "./interface";
import { BookmarkServiceError, logger, toError } from "./internal";
import type * as Type from "./types";

const queryBookmarks = async ({
  query,
  option,
}: Type.QueryBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const count = option?.count;
    let nodes: chrome.bookmarks.BookmarkTreeNode[];

    if (query) {
      nodes = await chrome.bookmarks.search({ query });
    } else {
      const tree = await chrome.bookmarks.getTree();
      nodes = filterValidBookmarks(tree);
    }

    const bookmarks = nodes
      .filter((n) => !!n.url)
      .slice(0, count)
      .map(convertBookmark);

    return bookmarks;
  } catch (error) {
    logger.error("Failed to query bookmarks:", error, {
      payload: { query, option },
    });
    throw new BookmarkServiceError("Failed to query bookmarks", toError(error));
  }
};

const getRecentBookmarks = async ({
  option,
}: Type.GetRecentBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const count = option?.count || 10;

    const response = await chrome.bookmarks.getRecent(count);
    const bookmarks = filterValidBookmarks(response).map(convertBookmark);

    return bookmarks;
  } catch (error) {
    logger.error("Failed to get recent bookmarks:", error, {
      payload: { option },
    });
    throw new BookmarkServiceError(
      "Failed to get recent bookmarks",
      toError(error),
    );
  }
};

const createBookmarkService = (): BookmarkService => ({
  query: queryBookmarks,
  getRecent: getRecentBookmarks,
});

export const bookmarkService = createBookmarkService();
