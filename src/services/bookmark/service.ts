/**
 * Bookmark Service - マイクロサービス形式のブックマーク管理サービス
 * 責任: ブックマークの検索、作成、更新、削除を担当
 */

import { actionBookmarkQuery, actionRecentBookmarks } from "@/utils/chrome";
import { convertBookmarkToResult } from "./converter";
import { filterValidBookmarks, limitResults } from "./helper";
import type * as Type from "./types";

// 型定義
export interface BookmarkService {
  query: (request: Type.QueryBookmarksRequest) => Promise<Type.Bookmark[]>;
}

// サービス実装
const queryBookmarks = async ({
  query,
  option,
}: Type.QueryBookmarksRequest): Promise<Type.Bookmark[]> => {
  try {
    const response = query
      ? await actionBookmarkQuery(query)
      : await actionRecentBookmarks(option?.count || 10);

    const bookmarks = filterValidBookmarks(response).map((bookmark) =>
      convertBookmarkToResult(bookmark),
    );

    return limitResults(option?.count)(bookmarks);
  } catch (error) {
    console.error("Failed to query bookmarks:", error);
    throw new Error("ブックマークの検索に失敗しました");
  }
};

// サービスオブジェクトのエクスポート
export const bookmarkService: BookmarkService = {
  query: queryBookmarks,
};

// デフォルトエクスポート
export default bookmarkService;
