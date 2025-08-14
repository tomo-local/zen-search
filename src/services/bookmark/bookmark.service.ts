import { BaseService } from '@/services/base';
import { MessageType } from '@/types/result';
import { QueryMessage } from '@/types/chrome';
import { queryBookmarks } from '@/function/chrome/bookmark';

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
   * ブックマークを検索する
   */
  async queryBookmarks(message: QueryMessage): Promise<any> {
    try {
      const { query } = message;
      const bookmarks = await queryBookmarks({ query });

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
