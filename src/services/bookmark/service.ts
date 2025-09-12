/**
 * Bookmark Service - マイクロサービス形式のブックマーク管理サービス
 * 責任: ブックマークの検索、作成、更新、削除を担当
 */

import { convertBookmark } from "./converter";
import { filterValidBookmarks, limitResults } from "./helper";
import type * as Type from "./types";

// 型定義
export interface BookmarkService {
  query: (request: Type.QueryBookmarksRequest) => Promise<Type.Bookmark[]>;
  getRecent: (
    request: Type.GetRecentBookmarksRequest
  ) => Promise<Type.Bookmark[]>;
}

const queryBookmarks = async ({
  query,
  option,
}: Type.QueryBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const response = await chrome.bookmarks.search(query);

    const bookmarks = filterValidBookmarks(response).map((bookmark) => ({
      data: bookmark,
    }));

    return limitResults(option?.count)(bookmarks) as Type.Bookmark[];
  } catch (error) {
    console.error("Failed to query bookmarks:", error);
    throw new Error("ブックマークの取得に失敗しました");
  }
};

const getRecentBookmarks = async ({
  option,
}: Type.GetRecentBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const count = option?.count || 10;

    const response = await chrome.bookmarks.getRecent(count);
    const bookmarks = filterValidBookmarks(response).map((bookmark) =>
      convertBookmark(bookmark)
    );

    return bookmarks;
  } catch (error) {
    console.error("Failed to get recent bookmarks:", error);
    throw new Error("最近のブックマークの取得に失敗しました");
  }
};

// サービスオブジェクトのエクスポート
export const createBookmarkService = (): BookmarkService => ({
  query: queryBookmarks,
  getRecent: getRecentBookmarks,
});

export const bookmarkService = createBookmarkService();
