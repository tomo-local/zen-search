import { BaseService } from '@/services/base';
import { MessageType, ResultType } from '@/types/result';
import { calcMatchRateResult } from '@/utils/match';
import { Bookmark, QueryBookmarkMessage, QueryMessage } from './bookmark.types';

/**
 * ブックマーク関連の操作を担当するサービス
 */
export class BookmarkService extends BaseService {
  async initialize(): Promise<void> {
    this.log('Bookmark service initialized');
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log('Bookmark service disposed');
    this.isInitialized = false;
  }

  /**
   * Chrome Bookmarks API でブックマークを検索する
   * @private
   */
  private async actionBookmarkQuery(query: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const response = await chrome.bookmarks.search(query);
    return response;
  }

  /**
   * Chrome Bookmarks API で最近のブックマークを取得する
   * @private
   */
  private async actionRecentBookmarks(count: number): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const response = await chrome.bookmarks.getRecent(count);
    return response;
  }

  /**
   * ブックマークを検索してフォーマットする
   * @private
   */
  private async performBookmarkQuery({
    query,
    count,
  }: Omit<QueryBookmarkMessage, "type">): Promise<Bookmark[]> {
    const response = query
      ? await this.actionBookmarkQuery(query)
      : await this.actionRecentBookmarks(count || 10);

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
  }

  /**
   * ブックマークを検索する
   */
  async queryBookmarks(message: QueryMessage): Promise<any> {
    try {
      const { query } = message;
      const bookmarks = await this.performBookmarkQuery({ query });

      return {
        type: MessageType.QUERY_BOOKMARK,
        result: bookmarks,
      };
    } catch (error) {
      this.error('Failed to query bookmarks', error as Error);
      throw error;
    }
  }
}
