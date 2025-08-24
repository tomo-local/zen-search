/**
 * Bookmark Service - マイクロサービス形式のブックマーク管理サービス
 * 責任: ブックマークの検索、作成、更新、削除を担当
 */

import { convertBookmarkToResult } from "./converter";
import { filterValidBookmarks, limitResults } from "./helper";
import type * as Type from "./types";

// 型定義
export interface BookmarkService {
  search: (request: Type.QueryBookmarksRequest) => Promise<Type.Bookmark[]>;
  getRecent: (
    request: Type.GetRecentBookmarksRequest
  ) => Promise<Type.Bookmark[]>;
}

// サービス実装
const searchBookmarks = async ({
  query,
  option,
}: Type.QueryBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const response = await chrome.bookmarks.search(query);

    const bookmarks = filterValidBookmarks(response).map((bookmark) =>
      convertBookmarkToResult(bookmark)
    );

    return limitResults(option?.count)(bookmarks);
  } catch (error) {
    console.error("Failed to query bookmarks:", error);
    throw new Error("ブックマークの検索に失敗しました");
  }
};

const getRecentBookmarks = async ({
  option,
}: Type.GetRecentBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const count = option?.count || 10;

    const response = await chrome.bookmarks.getRecent(count);

    const bookmarks = filterValidBookmarks(response).map((bookmark) =>
      convertBookmarkToResult(bookmark)
    );

    return bookmarks;
  } catch (error) {
    console.error("Failed to get recent bookmarks:", error);
    throw new Error("最近のブックマークの取得に失敗しました");
  }
};

// サービスオブジェクトのエクスポート
export const createBookmarkService = (): BookmarkService => ({
  search: searchBookmarks,
  getRecent: getRecentBookmarks,
});

export const bookmarkService = createBookmarkService();

export { searchBookmarks, getRecentBookmarks };
