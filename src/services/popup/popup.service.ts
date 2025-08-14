import { BaseService } from '@/services/base';
import { ActionType } from '@/types/chrome';
import { openContent } from '@/function/chrome/open';

/**
 * ポップアップ関連の操作を担当するサービス
 */
export class PopupService extends BaseService {
  async initialize(): Promise<void> {
    this.log('Popup service initialized');
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.log('Popup service disposed');
    this.isInitialized = false;
  }

  /**
   * ポップアップを開く
   */
  async openPopup(): Promise<void> {
    try {
      await openContent(ActionType.tabs);
      this.log('Popup opened successfully');
    } catch (error) {
      this.error('Failed to open popup', error as Error);
      throw error;
    }
  }

  /**
   * ポップアップを閉じる
   */
  async closePopup(): Promise<void> {
    try {
      // 必要に応じて閉じる処理を実装
      this.log('Popup closed successfully');
    } catch (error) {
      this.error('Failed to close popup', error as Error);
      throw error;
    }
  }
}
