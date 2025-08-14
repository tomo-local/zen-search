import { BaseService } from '@/services/base';
import { MessageType } from '@/types/result';
import { QueryMessage, CreateMessage, UpdateMessage, RemoveMessage } from '@/types/chrome';
import { queryTabs, updateTab, removeTab } from '@/function/chrome/tab';

/**
 * タブ関連の操作を担当するサービス
 */
export class TabService extends BaseService {
  async initialize(): Promise<void> {
    this.log('Tab service initialized');
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log('Tab service disposed');
    this.isInitialized = false;
  }

  /**
   * タブを検索する
   */
  async queryTabs(message: QueryMessage): Promise<any> {
    try {
      const { query, count } = message;
      const tabs = await queryTabs(query, { count });

      return {
        type: MessageType.QUERY_TAB,
        result: tabs,
      };
    } catch (error) {
      this.error('Failed to query tabs', error as Error);
      throw error;
    }
  }

  /**
   * 新しいタブを作成する
   */
  async createTab(message: CreateMessage): Promise<any> {
    try {
      const { url } = message;
      await chrome.tabs.create({ url });

      return {
        type: MessageType.CREATE_TAB,
        result: true,
      };
    } catch (error) {
      this.error('Failed to create tab', error as Error);
      throw error;
    }
  }

  /**
   * タブを更新する
   */
  async updateTab(message: UpdateMessage): Promise<any> {
    try {
      const { tabId, windowId } = message;
      await updateTab({ tabId, windowId });

      return {
        type: MessageType.UPDATE_TAB,
        result: true,
      };
    } catch (error) {
      this.error('Failed to update tab', error as Error);
      throw error;
    }
  }

  /**
   * タブを削除する
   */
  async removeTab(message: RemoveMessage): Promise<any> {
    try {
      const { tabId } = message;
      await removeTab({ tabId });

      return {
        type: MessageType.REMOVE_TAB,
        result: true,
      };
    } catch (error) {
      this.error('Failed to remove tab', error as Error);
      throw error;
    }
  }
}
