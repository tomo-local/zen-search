import { BaseService } from "@/services/base";
import { MessageType } from "@/types/result";
import * as Type from "./bookmark.types";
import { BookmarkConverter } from "./bookmark.converter";

/**
 * ブックマーク関連の操作を担当するサービス
 */
export class BookmarkService extends BaseService {
  private static readonly DEFAULT_RECENT_COUNT = 10;

  async initialize(): Promise<void> {
    this.log("Bookmark service initialized");
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log("Bookmark service disposed");
    this.isInitialized = false;
  }

  /**
   * @description クエリでブックマークのサイトのみを検索する
   * @private
   */
  private async searchBookmarksOnlySites(
    request: Type.BookmarkQuery
  ): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const response = await chrome.bookmarks.search(request);

    const bookmarksOnlySites = response.filter((bookmark) => bookmark.url);

    return bookmarksOnlySites;
  }

  /**
   * 最近のブックマークを取得する
   * @private
   */
  private async getRecentBookmarksOnlySites(
    count: number
  ): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const response = await chrome.bookmarks.getRecent(count);

    const bookmarksOnlySites = response.filter((bookmark) => bookmark.url);

    return bookmarksOnlySites;
  }

  /**
   * ブックマークを検索してフォーマットする
   * @private
   */
  private async performBookmarkQuery(
    request: Type.QueryBookmarkRequest
  ): Promise<Type.Bookmark[]> {
    if (!request.query) {
      return BookmarkConverter.convertToBookmarks(
        await this.getRecentBookmarksOnlySites(
          request.count || BookmarkService.DEFAULT_RECENT_COUNT
        ),
        undefined
      );
    }

    const response = await this.searchBookmarksOnlySites(request.query);

    // queryが文字列かオブジェクトかを判定して適切な値を取得
    const queryString =
      typeof request.query === "string"
        ? request.query
        : request.query.query || "";

    const bookmarks = BookmarkConverter.convertToBookmarks(
      response,
      queryString
    );

    return request.count ? bookmarks.slice(0, request.count) : bookmarks;
  }

  /**
   * ブックマークを検索する
   */
  async query(request: Type.QueryBookmarkRequest): Promise<{
    type: MessageType.QUERY_BOOKMARK;
    result: Type.Bookmark[];
  }> {
    try {
      const bookmarks = await this.performBookmarkQuery({
        query: request.query,
        count: request.count,
      });

      return {
        type: MessageType.QUERY_BOOKMARK,
        result: bookmarks,
      };
    } catch (error) {
      this.error("Failed to query bookmarks", error as Error);
      throw error;
    }
  }
}
