import { BaseService } from '@/services/base';
import { MessageType } from '@/types/result';
import { QueryMessage } from '@/types/chrome';
import { queryHistory } from '@/function/chrome/history';

/**
 * 履歴関連の操作を担当するサービス
 */
export class HistoryService extends BaseService {
  async initialize(): Promise<void> {
    this.log('History service initialized');
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log('History service disposed');
    this.isInitialized = false;
  }

  /**
   * 履歴を検索する
   */
  async queryHistory(message: QueryMessage): Promise<any> {
    try {
      const { query } = message;
      const history = await queryHistory({ query });

      return {
        type: MessageType.QUERY_HISTORY,
        result: history,
      };
    } catch (error) {
      this.error('Failed to query history', error as Error);
      throw error;
    }
  }
}
